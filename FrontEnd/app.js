
// Adresse de l'API qui renvoie la liste des catégories de travaux
const API_CATEGORIES_URL = "http://localhost:5678/api/categories";

// Adresse de l'API qui renvoie la liste des travaux de Sophie Bluel
const API_WORKS_URL = "http://localhost:5678/api/works";



// Fonction asynchrone pour récupérer les --------- CATEGORIES --------- depuis l'API
// Utilisation de async/await pour gérer la promesse d'un résultat futur
async function getCategories() {
  try {
    // Appel HTTP GET à l'API pour récupérer les catégories
    const response = await fetch(API_CATEGORIES_URL);

    // Vérification si la réponse est OK (statut 200)
    if (!response.ok) {
      throw new Error(`Erreur HTTP : ${response.status}`);
    }

    // Transforme la réponse JSON en tableau d'objets catégories
    // Ex: [{ id: 1, name: "Objets" }, { id: 2, name: "Appartements" }, ...]
    const categories = await response.json();

    // Affiche les boutons de filtre au-dessus de la galerie
    displayFilters(categories);
  } catch (error) {
    console.error("Erreur lors du chargement des catégories :", error);
  }
}

// Fonction chargée de créer et d'ajouter les éléments HTML pour chaque --------- CATEGORIE --------- dans la galerie
function displayFilters(categories) {
  const portfolioSection = document.querySelector("#portfolio");
  const gallery = document.querySelector(".gallery");

  // Sécurité : vérifie que la section #portfolio et .gallery existent dans le HTML
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
  filtersContainer.appendChild(allBtn);

  // Parcourt chaque objet "category" du tableau reçu depuis l'API
  // forEach exécute une fonction une fois pour chaque élément du tableau 
  categories.forEach((category) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = category.name; // Texte visible : "Objets", "Appartements", etc.
    btn.classList.add("filter-btn");
    btn.dataset.categoryId = category.id; // Stocke l'ID numérique de la catégorie pour mieux les filtrer
    // filtersContainer est le parent de tous les boutons de filtre, on y ajoute le bouton créé pour chaque catégorie
    filtersContainer.appendChild(btn);
  });
}








// Fonction asynchrone pour récupérer les --------- TRAVAUX --------- depuis l'API
// Utilisation de async/await pour gérer la promesse d'un résultat futur
async function getWorks() {
    try {
        // Appel HTTP GET à l'API pour récupérer les travaux
        const response = await fetch(API_WORKS_URL);

        // Vérification si la réponse est OK (statut 200)
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        // Une fois la réponse reçue, on attend qu'elle soit convertie en JSON
        const works = await response.json();

        // Affiche les travaux dans la galerie HTML
        displayWorks(works);
        } catch (error) {
            // Afficher l'erreur dans la console si le serveur est éteint ou l'URL est incorrecte
            console.error("Erreur lors de la récupération des travaux:", error);
    }
}

// Fonction chargée de créer et d'ajouter les éléments HTML pour chaque --------- TRAVAIL --------- dans la galerie
function displayWorks(works) {
    // Récupère la <div class="gallery"> présent dans l'HTML
    const gallery = document.querySelector(".gallery");

    // Sécurité au cas où la classe .gallery n'existe pas dans le HTML
    if (!gallery) {
        console.error("La galerie n'a pas été trouvée dans le DOM.");
        return;
    }

    // Vide la galerie avant d'ajouter les nouveaux éléments
    gallery.innerHTML = "";

    // Parcourt chaque objet "work" du tableau reçu depuis l'API
    // forEach exécute une fonction une fois pour chaque élément du tableau 
    works.forEach(work => {
        // Crée un élément <figure> pour chaque travail
        const figure = document.createElement("figure");

        // Crée un élément <img src="..." alt="..."> pour l'image du travail
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


// Appelle la fonction pour récupérer et afficher les catégories dès que le script est chargé
getCategories();
// Appelle la fonction pour récupérer et afficher les travaux dès que le script est chargé
getWorks();
