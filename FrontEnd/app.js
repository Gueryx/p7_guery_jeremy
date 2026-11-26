
// =============================================================================================
// 1. CONSTANTES
// =============================================================================================

// Adresse de l'API qui renvoie la liste des travaux
const API_WORKS_URL = "http://localhost:5678/api/works";

// Adresse de l'API qui renvoie la liste des catégories de travaux
const API_CATEGORIES_URL = "http://localhost:5678/api/categories";

// Garde en mémoire la liste complète des travaux récupérés au chargement
// pour pouvoir filtrer sans refaire un appel API à chaque clic
let allWorks = [];


// =============================================================================================
// 2. RÉCUPÉRATION DES DONNÉES (FETCH / API)
// =============================================================================================

// Récupère tous les travaux depuis le back-end
// Fonction asynchrone
// Utilisation de async/await pour gérer la promesse d'un résultat futur
async function getWorks() {
  try {
    // Appel HTTP GET à l'API pour récupérer les travaux
    const response = await fetch(API_WORKS_URL);

    // Vérification si la réponse est OK (statut 200)
    if (!response.ok) {
      throw new Error(`Erreur HTTP lors du chargement des travaux : ${response.status}`);
    }

    // Une fois la réponse reçue, on attend qu'elle soit convertie en JSON
    allWorks = await response.json();

    // Affiche tous les travaux dans la galerie au démarrage
    displayWorks(allWorks);

  } catch (error) {
    // Afficher l'erreur dans la console si le serveur est éteint ou l'URL est incorrecte
    console.error("Erreur dans getWorks() :", error);
  }
}

// Récupère toutes les catégories depuis le back-end
// Fonction asynchrone
// Utilisation de async/await pour gérer la promesse d'un résultat futur
async function getCategories() {
  try {
    // Appel HTTP GET à l'API pour récupérer les catégories
    const response = await fetch(API_CATEGORIES_URL);

    // Vérification si la réponse est OK (statut 200)
    if (!response.ok) {
      throw new Error(`Erreur HTTP lors du chargement des catégories : ${response.status}`);
    }

    // Une fois la réponse reçue, on attend qu'elle soit convertie en JSON
    const categories = await response.json();

     // Affiche les boutons de filtre au-dessus de la galerie
    displayFilters(categories);

  } catch (error) {
    console.error("Erreur dans getCategories() :", error);
  }
}


// ================================================================================================
// 3. AFFICHAGE DANS LE DOM
// ================================================================================================

// Fonction chargée de créer et d'ajouter les éléments HTML pour chaque --------- TRAVAIL --------- dans la galerie
function displayWorks(worksToDisplay) {

  // Récupère la <div class="gallery"> présent dans l'HTML
  const gallery = document.querySelector(".gallery");

  // Sécurité au cas où la classe .gallery n'existe pas dans le HTML
  if (!gallery) {
    console.error("Élément .gallery introuvable dans le DOM.");
    return;
  }

  // Vide la galerie avant d'ajouter les nouveaux éléments
  gallery.innerHTML = "";

  // Parcourt chaque objet "work" du tableau reçu depuis l'API
  // forEach exécute une fonction une fois pour chaque élément du tableau
  worksToDisplay.forEach((work) => {

    // Crée un élément <figure> pour chaque travail
    const figure = document.createElement("figure");

    // Crée un élément <img ... > pour l'image du travail
    const img = document.createElement("img");
    img.src = work.imageUrl; // Assigne l'URL de l'image
    img.alt = work.title; // Assigne le titre comme texte alternatif

    // Crée un élément <figcaption> pour le titre du travail
    const figcaption = document.createElement("figcaption");
    figcaption.textContent = work.title; // Assigne le titre du travail

    // Assemble les éléments <img> et <figcaption> dans <figure>
    figure.appendChild(img);
    figure.appendChild(figcaption);

    // Ajoute <figure> dans <div class="gallery">
    gallery.appendChild(figure);
  });
}


// Fonction chargée de créer et d'ajouter les éléments HTML pour chaque --------- CATEGORIE --------- dans la galerie
function displayFilters(categories) {

  // Récupère la section #portfolio et la galerie .gallery
  const portfolioSection = document.querySelector("#portfolio");
  const gallery = document.querySelector(".gallery");

  // Si l'un ou l'autre élément manque, on arrête pour éviter une erreur
  if (!portfolioSection || !gallery) {
    console.error("Impossible de trouver #portfolio ou .gallery dans le DOM.");
    return;
  }

  // Cherche un éventuel conteneur .filters déjà présent dans le HTML
  let filtersContainer = document.querySelector(".filters");

  // S'il n'existe pas encore, on le crée et on l'insère juste AVANT .gallery
  if (!filtersContainer) {
    filtersContainer = document.createElement("div");
    filtersContainer.classList.add("filters");

    // Insère le conteneur de filtres avant la galerie dans la section #portfolio
    portfolioSection.insertBefore(filtersContainer, gallery);
  }

  // Vide le conteneur avant de créer les boutons
  filtersContainer.innerHTML = "";

  // Bouton "Tous" actif par défaut (conformément à la maquette)
  const allBtn = document.createElement("button");
  allBtn.type = "button";
  allBtn.textContent = "Tous";
  allBtn.classList.add("filter-btn", "active");
  allBtn.dataset.categoryId = "all"; // Repère pour tout afficher
  // Ajoute le bouton "Tous" au conteneur de filtres
  filtersContainer.appendChild(allBtn);

  // Parcourt chaque objet "category" du tableau reçu depuis l'API
  // forEach exécute une fonction une fois pour chaque élément du tableau 
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = category.name; // Texte visible : "Objets", "Appartements", etc.
    btn.classList.add("filter-btn");
    btn.dataset.categoryId = category.id; // Repère pour filtrer par catégorie
    filtersContainer.appendChild(btn);
  });

  // Après avoir créé tous les boutons, on met en place les événements de filtrage
  setupFilterEvents();
}


// =================================================================================================
// 4. FILTRAGE AU CLIC
// =================================================================================================

// Fonction qui ajoute les événements "click" sur les boutons de filtre
function setupFilterEvents() {
  // Sélectionne tous les boutons de filtre
  const filterButtons = document.querySelectorAll(".filter-btn");

  // Parcourt chaque bouton et ajoute un écouteur d'événement "click"
  filterButtons.forEach((button) => {

    // Quand un bouton est cliqué, on exécute la fonction suivante
    button.addEventListener("click", () => {

      // Met à jour le style actif sur le bouton cliqué
      filterButtons.forEach((btn) => btn.classList.remove("active"));

      // Ajoute la classe "active" au bouton cliqué pour le mettre en couleur
      button.classList.add("active");

      // Récupère l'ID de catégorie associé au bouton cliqué
      const selectedCategoryId = button.dataset.categoryId;

      // Si le bouton "Tous" est cliqué, on réaffiche tous les travaux
      if (selectedCategoryId === "all") {

        // Réaffiche la liste complète
        displayWorks(allWorks);

      } else {

        // .filter() est une méthode de sélection sur un tableau : elle crée un nouveau
        // tableau contenant uniquement les travaux dont categoryId correspond à l'ID du
        // bouton cliqué (Number convertit la chaîne ex. "2" en vrai nombre pour ===)
        const filteredWorks = allWorks.filter(
          (work) => work.categoryId === Number(selectedCategoryId) // dataset.categoryId est une chaîne, donc on convertit en nombre pour comparer
        );

        // Affiche uniquement les travaux filtrés
        displayWorks(filteredWorks);
      }
    });
  });
}


// ================================================================================================
// 5. INITIALISATION AU CHARGEMENT
// ================================================================================================
// Appelle les fonctions pour récupérer les travaux et les catégories dès que le script est chargé

getWorks();
getCategories();