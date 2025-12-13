// assets/js/script.js

// --- VARIABLES GLOBALES ET DOM ---
const burgerBtn = document.getElementById("burgerBtn");
const closeBtn = document.getElementById("closeBtn"); 
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-menu-list a"); 
const categoriesContainer = document.querySelector(".categories");
const formBtn = document.querySelector(".form-btn");
const categoryButtons = document.querySelectorAll(".category-btn");

let dataCache = {};

// --- FONCTIONS UTILITAIRES ---

function closeMenu() {
    navMenu.classList.remove('active');
}

function openMenu() {
    navMenu.classList.add('active');
}

// Fonction pour charger les données et les mettre en cache
async function loadDataAndInitialize() {
    try {
        const response = await fetch('assets/js/data.json'); 
        
        if (!response.ok) {
            console.warn(`Impossible de charger data.json. Statut: ${response.status}`);
            return;
        }
        const rawData = await response.json();
        
        // Stocke les données des trois tableaux
        dataCache.category = rawData.category;
        dataCache.subcategory = rawData.subcategory;
        dataCache.content = rawData.content;
        
        console.log('Données chargées avec succès', dataCache);
        
    } catch (error) {
        console.error("Erreur lors du chargement de data.json :", error);
    }
}

// --- ÉVÉNEMENTS DOM ---

// Menu burger
if (burgerBtn) {
    burgerBtn.addEventListener('click', openMenu);
}

if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
}

// Fermer le menu en cliquant sur un lien
if (navLinks) {
    navLinks.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });
}

// Bouton principal Déclarer un incident
if (formBtn) {
    formBtn.addEventListener("click", function () {
        window.location.href = "form.html"; 
    });
}

// Boutons de catégories (dossiers) - LOGIQUE MISE À JOUR
if (categoryButtons) {
    categoryButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            if (dataCache.category && dataCache.category[index]) {
                 // Utilise la classification (ex: "1", "2") comme ID
                const categoryId = dataCache.category[index].classification;
            
                // Stocker l'ID et le Type pour le chargement de la prochaine page
                localStorage.setItem('parentId', categoryId);
                localStorage.setItem('parentType', 'category');
                
                // Redirection vers la nouvelle page générique
                window.location.href = "subcategories.html";
            } else {
                console.error("Erreur: Catégorie non trouvée dans dataCache.");
            }
        });
    });
}

// Fermer le menu si on clique en dehors
document.addEventListener('click', function(event) {
    if (navMenu && burgerBtn) {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickOnBurger = burgerBtn.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnBurger && navMenu.classList.contains('active')) {
            closeMenu();
        }
    }
});

// Empêcher la propagation des clics à l'intérieur du menu
if (navMenu) {
    navMenu.addEventListener('click', function(event) {
        event.stopPropagation();
    });
}

// Démarrage de l'application
loadDataAndInitialize();

