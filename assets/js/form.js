// assets/js/form.js

// Déclaration des variables DOM (accessible globalement si besoin)
const searchInput = document.getElementById('searchInput');
const dropdownMenu = document.getElementById('dropdownMenu');
const categoryValue = document.getElementById('categoryValue');
const clearBtn = document.getElementById('clearBtn');
const mainForm = document.getElementById('mainForm');
const modal = document.getElementById('confirmationModal');
const confirmSendBtn = document.getElementById('confirmSendBtn');
const cancelSendBtn = document.getElementById('cancelSendBtn');

/**
 * Échappe les guillemets simples pour l'insertion dans un attribut HTML onclick.
 * Cela empêche les apostrophes (ex: l'Oise) dans les noms de catégories de casser l'appel de fonction JavaScript.
 * @param {string} text - Le texte à échapper.
 * @returns {string} Le texte échappé.
 */
function escapeForHtmlAttribute(text) {
    if (typeof text !== 'string') return text;
    // Remplace les guillemets simples par une version échappée pour la chaîne JS
    return text.replace(/'/g, "\\'");
}

/**
 * Extrait la dernière catégorie de la chaîne complète (ex: "Cat1 > Cat2 > Cat3" donne "Cat3").
 * @param {string} fullText - La chaîne complète de la catégorie.
 * @returns {string} Le texte de la catégorie finale.
 */
function getLastCategory(fullText) {
    if (!fullText) return '';
    const parts = fullText.split('>');
    // Retourne la dernière partie, retire les espaces et enlève les échappements de guillemets simples
    return parts[parts.length - 1].trim().replace(/\\'/g, "'");
}

/**
 * Fonction principale asynchrone pour charger les données et initialiser l'application.
 */
async function loadDataAndInitialize() {
    let rawData;
    
    // --- Chargement des données (Gestion de l'erreur de chemin d'accès) ---
    try {
        // Le chemin 'assets/js/data.json' est relatif à la page HTML
        const response = await fetch('assets/js/data.json'); 
        
        if (!response.ok) {
            // Lance une erreur si le statut HTTP n'est pas 200 (ex: 404 Not Found)
            throw new Error(`Erreur HTTP! Statut: ${response.status}. Vérifiez le chemin 'data.json'.`);
        }
        rawData = await response.json();
        
    } catch (error) {
        console.error("Erreur critique lors du chargement de data.json :", error);
        alert("Impossible de charger les données de catégorie. Veuillez vérifier le chemin du fichier 'data.json' et la console.");
        // Fournit des données vides pour éviter un crash total
        rawData = { category: [], subcategory: [], subsubcategory: [] }; 
    }

    // --- 1. Construction de la structure hiérarchique ---
    function buildHierarchy(data) {
        const categories = {};

        data.category.forEach(cat => {
            categories[cat.classification] = { text: cat.text, subcategories: {} };
        });

        data.subcategory.forEach(subcat => {
            const catId = subcat.classification.split('.')[0];
            if (categories[catId]) {
                categories[catId].subcategories[subcat.classification] = {
                    text: subcat.text,
                    subsubcategories: {}
                };
            }
        });

        data.subsubcategory.forEach(subsubcat => {
            const parts = subsubcat.classification.split('.');
            const catId = parts[0];
            const subcatId = parts[0] + '.' + parts[1];

            if (categories[catId] && categories[catId].subcategories[subcatId]) {
                categories[catId].subcategories[subcatId].subsubcategories[subsubcat.classification] = {
                    text: subsubcat.text
                };
            }
        });

        return categories;
    }

    const classifiedData = buildHierarchy(rawData);

    // --- 2. Fonctions de gestion du menu déroulant et de recherche ---

    function highlightText(text, query) {
        if (!query.trim()) return text;
        const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
        return text.replace(regex, '<span class="highlight">$1</span>');
    }

    function renderLevel(items, level, query, classifiedData) {
        const lowerQuery = query.toLowerCase();
        let levelHtml = '';
        let localHasMatches = false;

        for (const id in items) {
            const item = items[id];
            const itemText = item.text;

            let fullText = itemText;
            if (level === 2) {
                fullText = `${classifiedData[id.split('.')[0]].text} > ${itemText}`;
            } else if (level === 3) {
                const parts = id.split('.');
                fullText = `${classifiedData[parts[0]].text} > ${classifiedData[parts[0]].subcategories[parts[0] + '.' + parts[1]].text} > ${itemText}`;
            }

            const itemMatches = itemText.toLowerCase().includes(lowerQuery);

            let subItemsKey;
            let hasChildren = false;

            // Détermine si l'élément a des enfants et si oui, quelle clé utiliser
            if (item.subcategories && Object.keys(item.subcategories).length > 0) {
                subItemsKey = 'subcategories';
                hasChildren = true;
            } else if (item.subsubcategories && Object.keys(item.subsubcategories).length > 0) {
                subItemsKey = 'subsubcategories';
                hasChildren = true;
            }
            
            let matchingSubItemsHtml = '';
            let hasSubMatches = false;

            if (hasChildren) {
                const subResult = renderLevel(item[subItemsKey], level + 1, query, classifiedData);
                matchingSubItemsHtml = subResult.html;
                hasSubMatches = subResult.localHasMatches;
            }

            if (itemMatches || hasSubMatches) {
                localHasMatches = true;
                const highlightedText = highlightText(itemText, query);

                // **CORRECTION ICI : Un élément est sélectionnable s'il est de niveau 3 OU s'il n'a AUCUN enfant (feuille).**
                if (level === 3 || !hasChildren) { 
                    // Item sélectionnable (Niveau 3 ou Niveau 2 sans enfant)
                    const escapedFullText = escapeForHtmlAttribute(fullText);
                    levelHtml += `
                        <div class="subcategory-item" data-id="${id}" onclick="window.selectCategory('${id}', '${escapedFullText}')">
                            ${highlightedText}
                        </div>
                    `;
                } else {
                    // Conteneur (Niveau 1 ou Niveau 2 avec enfants)
                    const isGroupItem = level === 2;
                    levelHtml += `
                        <div class="category-item ${isGroupItem ? 'sub-group' : ''}" data-id="${id}">
                            <div class="category-header" onclick="window.toggleSubcategories('${id}')">
                                <span>${highlightedText}</span>
                                <span class="sub-arrow" style="transform: rotate(${query.trim() ? '180deg' : '0deg'});">▼</span>
                            </div>
                            <div class="subcategory-list ${query.trim() ? 'show' : ''}" id="sub-${id}">
                                ${matchingSubItemsHtml}
                            </div>
                        </div>
                    `;
                }
            }
        }
        return { html: levelHtml, localHasMatches };
    }


    // Crée le menu déroulant complet (mode normal)
    function createDropdown() {
        let html = '';
        const data = classifiedData;
        
        for (const catId in data) {
            const category = data[catId];
            const subcategories = category.subcategories;
            
            let subcategoriesHtml = '';
            
            for (const subcatId in subcategories) {
                const subcategory = subcategories[subcatId];
                const subsubcategories = subcategory.subsubcategories;

                let subsubcategoriesHtml = '';
                
                for (const subsubcatId in subsubcategories) {
                    const subsubcategory = subsubcategories[subsubcatId];
                    const fullText = `${category.text} > ${subcategory.text} > ${subsubcategory.text}`;
                    const escapedFullText = escapeForHtmlAttribute(fullText);

                    subsubcategoriesHtml += `
                        <div class="subcategory-item" data-id="${subsubcatId}" onclick="window.selectCategory('${subsubcatId}', '${escapedFullText}')">
                            ${subsubcategory.text}
                        </div>
                    `;
                }

                if (Object.keys(subsubcategories).length === 0) {
                    // Cas Feuille (Sélectionnable)
                   const fullText = `${category.text} > ${subcategory.text}`;
                   const escapedFullText = escapeForHtmlAttribute(fullText);
                   subcategoriesHtml += `
                        <div class="subcategory-item" data-id="${subcatId}" onclick="window.selectCategory('${subcatId}', '${escapedFullText}')">
                            ${subcategory.text}
                        </div>
                    `;
                } else {
                    // Cas Groupe (Ouvrable)
                    subcategoriesHtml += `
                        <div class="category-item sub-group" data-id="${subcatId}">
                            <div class="category-header" onclick="window.toggleSubcategories('${subcatId}')">
                                <span>${subcategory.text}</span>
                                <span class="sub-arrow">▼</span>
                            </div>
                            <div class="subcategory-list" id="sub-${subcatId}">
                                ${subsubcategoriesHtml}
                            </div>
                        </div>
                    `;
                }
            }

            html += `
                <div class="category-item" data-id="${catId}">
                    <div class="category-header" onclick="window.toggleSubcategories('${catId}')">
                        <span>${category.text}</span>
                        <span class="sub-arrow">▼</span>
                    </div>
                    <div class="subcategory-list" id="sub-${catId}">
                        ${subcategoriesHtml}
                    </div>
                </div>
            `;
        }

        dropdownMenu.innerHTML = html;
    }

    // Fonction de recherche (mode saisie de texte)
    function searchCategories(query) {
        if (!query.trim()) {
            createDropdown();
            return;
        }

        const result = renderLevel(classifiedData, 1, query, classifiedData);
        let html = result.html;
        
        if (!result.localHasMatches) {
            html = '<div class="no-results">Aucun résultat trouvé</div>';
        }

        dropdownMenu.innerHTML = html;
    }


    // Rendre les fonctions globales pour les événements onclick dans le HTML généré
    window.toggleSubcategories = function(id) {
        const subList = document.getElementById(`sub-${id}`);
        const arrow = document.querySelector(`.category-item[data-id="${id}"] .sub-arrow`);
        
        if (subList) {
            subList.classList.toggle('show');
            
            if (arrow) {
                const isShown = subList.classList.contains('show');
                arrow.style.transform = isShown ? 'rotate(180deg)' : 'rotate(0deg)';
            }
        }
    }

    // Fonction pour sélectionner une catégorie
    window.selectCategory = function(id, text) {
        // 1. Définir la valeur de l'input caché (la chaîne complète non échappée)
        categoryValue.value = text.replace(/\\'/g, "'"); 
        
        // 2. Extraire la catégorie la plus précise à afficher dans l'input visible
        const displayValue = getLastCategory(text);
        searchInput.value = displayValue; // Affiche la dernière partie (ex: "Jets de détritus")
        
        // 3. Fermer le menu déroulant
        dropdownMenu.classList.remove('show');
        searchInput.classList.remove('has-results');
        
        if (displayValue) { 
            clearBtn.classList.add('show');
        }
    }


    // --- 3. Événements DOM ---

    // Événement FOCUS (Au clic initial sur l'input)
    searchInput.addEventListener('focus', function() {
        // Affiche la liste complète si le champ est vide
        if (!searchInput.value.trim()) {
            createDropdown();
        } else {
             // Effectue une recherche si du texte est déjà présent
            searchCategories(searchInput.value);
        }

        // Affiche le dropdown et ajoute le style actif
        dropdownMenu.classList.add('show');
        searchInput.classList.add('has-results');
    });

    // Événement INPUT (À CHAQUE saisie de caractère)
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value;
        
        // 1. Déclenche la recherche et la mise en surbrillance
        searchCategories(query);
        
        // 2. Assure l'affichage du menu déroulant
        dropdownMenu.classList.add('show');
        searchInput.classList.add('has-results'); 
        
        // 3. Gestion du bouton "Clear"
        if (query.trim()) {
            clearBtn.classList.add('show');
        } else {
            clearBtn.classList.remove('show');
        }
    });

    // Bouton clear
    clearBtn.addEventListener('click', function() {
        searchInput.value = '';
        categoryValue.value = '';
        clearBtn.classList.remove('show');
        searchInput.setAttribute('placeholder', "Choisir une nature"); 
        createDropdown(); 
        searchInput.focus();
    });

    // Fermer le dropdown si l'utilisateur clique ailleurs
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.category-selector')) {
            dropdownMenu.classList.remove('show');
            searchInput.classList.remove('has-results');
        }
    });

    // --- 4. Gestion du formulaire et de la modale de confirmation ---

    mainForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validation : assure qu'une catégorie a été sélectionnée
        if (mainForm.checkValidity() && categoryValue.value) { 
            modal.style.display = "block";
        } else if (!categoryValue.value) {
            alert("Veuillez sélectionner une nature d'incident dans la liste déroulante.");
            searchInput.focus();
        }
    });

    confirmSendBtn.addEventListener('click', function() {
        modal.style.display = "none";
        
        const formData = {
            classification_id: categoryValue.value,
            nature_selection: searchInput.value,
            description: document.getElementById('description').value,
            heure: document.getElementById('heure').value, 
            lieu: document.getElementById('lieu').value
        };

        console.log('Rapport soumis :', formData);
        alert('Rapport soumis avec succès !'); 
        
        // Réinitialisation du formulaire
        mainForm.reset();
        searchInput.value = '';
        categoryValue.value = '';
        clearBtn.classList.remove('show');
        searchInput.classList.remove('has-results');
        searchInput.setAttribute('placeholder', "Choisir une nature");
    });

    cancelSendBtn.addEventListener('click', function() {
        modal.style.display = "none";
    });
    
    // Initialise le dropdown au premier chargement (le remplissage sera fait au focus)
    createDropdown();
}

// Démarre l'application
loadDataAndInitialize();