// Adresse de l'API qui renvoie la liste des travaux de Sophie Bluel
const API_WORKS_URL = "http://localhost:5678/api/works";

// Fonction asynchrone pour récupérer les travaux depuis l'API
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

// Fonction chargée de créer et d'ajouter les éléments HTML pour chaque travail dans la galerie
function displayWorks(works) {
    // Sélectionne la <div class"'gallery"> présent dans l'HTML
    const gallery = document.querySelector(".gallery");

    // Sécurité au cas où la classe .gallery n'existe pas dans le HTML
    if (!gallery) {
        console.error("La galerie n'a pas été trouvée dans le DOM.");
        return;
    }

    // Vide la galerie avant d'ajouter les nouveaux éléments
    gallery.innerHTML = "";

    // Parcourt chaque objet "work" du tableau reçu depuis l'API
    // forEach donne directement chaque élément un à un de "work" 
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

// Appelle la fonction pour récupérer et afficher les travaux dès que le script est chargé
getWorks();