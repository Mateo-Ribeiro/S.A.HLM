// assets/js/search.js

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Éléments DOM ---
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const historyList = document.getElementById('historyList');
    // NOUVEAU : Référence au bouton Vider l'historique
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    const MAX_HISTORY_ITEMS = 5; 

    // --- Fonctions de gestion du LocalStorage ---
    
    function getHistory() {
        const historyJson = localStorage.getItem('searchHistory');
        return historyJson ? JSON.parse(historyJson) : [];
    }

    function saveHistory(historyArray) {
        localStorage.setItem('searchHistory', JSON.stringify(historyArray));
    }

    function addToHistory(term) {
        if (!term || term.trim() === '') return;
        const normalizedTerm = term.trim();
        let history = getHistory();

        history = history.filter(item => item.toLowerCase() !== normalizedTerm.toLowerCase());
        history.unshift(normalizedTerm);
        history = history.slice(0, MAX_HISTORY_ITEMS);
        
        saveHistory(history);
        renderHistory();
    }
    
    // --- NOUVELLE FONCTION : Vider l'historique ---
    function clearSearchHistory() {
        if (confirm("Êtes-vous sûr de vouloir effacer tout votre historique de recherche ?")) {
            localStorage.removeItem('searchHistory');
            renderHistory();
            alert("L'historique a été vidé.");
        }
    }

    // --- Fonction de Rendu de l'Historique (MISE À JOUR) ---
    function renderHistory() {
        const history = getHistory();
        historyList.innerHTML = ''; 

        if (history.length === 0) {
            historyList.innerHTML = '<p class="no-history-message">Aucune recherche récente.</p>';
            clearHistoryBtn.classList.add('hidden'); // Masquer le bouton
            return;
        }

        // Afficher le bouton Vider l'historique
        clearHistoryBtn.classList.remove('hidden');

        history.forEach((term, index) => {
            const button = document.createElement('button');
            button.classList.add('history-btn');
            
            const labelText = index === 0 ? "dernière recherche" : `dernière recherche +${index}`;
            
            button.innerHTML = `<span class="icon-history"></span> ${term}`;
            button.setAttribute('title', term);
            
            button.addEventListener('click', () => {
                searchInput.value = term;
                performSearch(term); 
            });
            
            historyList.appendChild(button);
        });
    }
    
    // --- Logique de Recherche (Inchangée) ---
    function performSearch(term) {
        addToHistory(term);
        
        console.log(`Recherche lancée pour : "${term}"`);
        alert(`Recherche de "${term}" lancée. (Redirection vers la page d'accueil simulée)`);
        window.location.href = "home.html"; 
    }

    // --- Événements DOM ---
    
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const term = searchInput.value;
            if (term.trim() !== '') {
                performSearch(term);
            }
        });
    }
    
    // NOUVEAU : Événement pour le bouton Vider l'historique
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearSearchHistory);
    }
    
    // --- Initialisation ---
    renderHistory();
});