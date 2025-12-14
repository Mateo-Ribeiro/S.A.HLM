// Navbar
const navItems = document.querySelectorAll(".nav-item");

navItems.forEach((item) => {
    item.addEventListener("click", () => {
        // Supprime la classe 'active' de tous les éléments
        navItems.forEach((i) => i.classList.remove("active"));
        // Ajoute la classe 'active' à l'élément cliqué
        item.classList.add("active");
    });
});


// Pop-up de déconnexion
const logoutLink = document.getElementById('logoutLinkHeader'); // Bouton dans le menu-header
const logoutModal = document.getElementById('logoutModal');
const confirmLogoutBtn = document.getElementById('confirmLogoutBtn');
const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');
const navMenu = document.getElementById('navMenu'); // Référence au menu burger


// Fonction pour ouvrir la modale
function openLogoutModal() {
    // CORRECTION : Vérifie et retire la classe 'active' utilisée par global.js
    if (navMenu && navMenu.classList.contains('active')) {
        navMenu.classList.remove('active'); 
    }
    
    // Affiche la modale
    if (logoutModal) {
        logoutModal.classList.add('is-visible');
    }
}

// Fonction pour fermer la modale
function closeLogoutModal() {
    if (logoutModal) {
        logoutModal.classList.remove('is-visible');
    }
}


// Ouvrir la modale quand on clique sur le picto "Déconnexion"
if (logoutLink) {
    logoutLink.addEventListener('click', function(event) {
        event.preventDefault(); 
        openLogoutModal();
    });
}

// Annuler la déconnexion 
if (cancelLogoutBtn) {
    cancelLogoutBtn.addEventListener('click', closeLogoutModal);
}

// Confirmer la déconnexion et rediriger
if (confirmLogoutBtn) {
    confirmLogoutBtn.addEventListener('click', function() {
        // *** LOGIQUE DE DÉCONNEXION ICI (nettoyage de session, etc.) ***
        
        // Redirection vers la page de connexion
        window.location.href = 'index.html'; 
    });
}

// Fermer la modale en cliquant sur l'arrière-plan sombre
if (logoutModal) {
    window.addEventListener('click', function(event) {
        if (event.target === logoutModal) {
            closeLogoutModal();
        }
    });
}