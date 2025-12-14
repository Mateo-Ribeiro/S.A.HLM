// Récupération des éléments
const sizeMinusBtn = document.querySelector('.size-minus');
const sizePlusBtn = document.querySelector('.size-plus');
const daltonismeToggle = document.getElementById('daltonismeToggle');
const darkModeToggle = document.getElementById('darkModeToggle');
const resetBtn = document.querySelector('.reset-btn');

// Valeurs par défaut
const DEFAULT_FONT_SIZE = 16;
const MIN_FONT_SIZE = 12;
const MAX_FONT_SIZE = 24;
const FONT_SIZE_STEP = 2;

// Clés de stockage localStorage
const STORAGE_KEYS = {
    fontSize: 'app-font-size',
    daltonisme: 'app-daltonisme',
    darkMode: 'app-dark-mode'
};

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    loadSettings();
});

// Charger les paramètres sauvegardés
function loadSettings() {
    // Charger la taille de texte
    const savedFontSize = localStorage.getItem(STORAGE_KEYS.fontSize);
    if (savedFontSize) {
        applyFontSize(parseInt(savedFontSize));
    }

    // Charger le mode daltonisme
    const savedDaltonisme = localStorage.getItem(STORAGE_KEYS.daltonisme);
    if (savedDaltonisme === 'true') {
        daltonismeToggle.checked = true;
        applyDaltonisme(true);
    }

    // Charger le mode sombre
    const savedDarkMode = localStorage.getItem(STORAGE_KEYS.darkMode);
    if (savedDarkMode === 'true') {
        darkModeToggle.checked = true;
        applyDarkMode(true);
    }
}

// Gestion de la taille de texte
sizeMinusBtn.addEventListener('click', () => {
    const currentSize = getCurrentFontSize();
    const newSize = Math.max(MIN_FONT_SIZE, currentSize - FONT_SIZE_STEP);
    applyFontSize(newSize);
    localStorage.setItem(STORAGE_KEYS.fontSize, newSize);
});

sizePlusBtn.addEventListener('click', () => {
    const currentSize = getCurrentFontSize();
    const newSize = Math.min(MAX_FONT_SIZE, currentSize + FONT_SIZE_STEP);
    applyFontSize(newSize);
    localStorage.setItem(STORAGE_KEYS.fontSize, newSize);
});

function getCurrentFontSize() {
    const saved = localStorage.getItem(STORAGE_KEYS.fontSize);
    return saved ? parseInt(saved) : DEFAULT_FONT_SIZE;
}

function applyFontSize(size) {
    document.documentElement.style.setProperty('--base-font-size', `${size}px`);
    document.body.style.fontSize = `${size}px`;
}

// Gestion du mode daltonisme
daltonismeToggle.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    applyDaltonisme(isEnabled);
    localStorage.setItem(STORAGE_KEYS.daltonisme, isEnabled);
});

function applyDaltonisme(enabled) {
    if (enabled) {
        document.body.classList.add('daltonisme-mode');
    } else {
        document.body.classList.remove('daltonisme-mode');
    }
}

// Gestion du mode sombre
darkModeToggle.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    applyDarkMode(isEnabled);
    localStorage.setItem(STORAGE_KEYS.darkMode, isEnabled);
});

function applyDarkMode(enabled) {
    if (enabled) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// Réinitialisation de tous les paramètres
resetBtn.addEventListener('click', () => {
    // Confirmation
    if (confirm('Voulez-vous réinitialiser tous les paramètres ?')) {
        // Supprimer tous les paramètres du localStorage
        localStorage.removeItem(STORAGE_KEYS.fontSize);
        localStorage.removeItem(STORAGE_KEYS.daltonisme);
        localStorage.removeItem(STORAGE_KEYS.darkMode);

        // Réinitialiser l'interface
        applyFontSize(DEFAULT_FONT_SIZE);
        applyDaltonisme(false);
        applyDarkMode(false);

        // Réinitialiser les toggles
        daltonismeToggle.checked = false;
        darkModeToggle.checked = false;

        // Animation de confirmation
        resetBtn.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            resetBtn.style.transform = '';
        }, 300);
    }
});