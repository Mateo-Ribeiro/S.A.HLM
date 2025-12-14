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
const descriptionInput = document.getElementById('description');

/**
 * Échappe les guillemets simples pour l'insertion dans un attribut HTML onclick.
 * @param {string} text - Le texte à échapper.
 * @returns {string} Le texte échappé.
 */
function escapeForHtmlAttribute(text) {
    if (typeof text !== 'string') return text;
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
    return parts[parts.length - 1].trim().replace(/\\'/g, "'");
}

/**
 * Fonction principale asynchrone pour charger les données et initialiser l'application.
 */
async function loadDataAndInitialize() {
    let rawData;
    
    // --- Chargement des données ---
    try {
        const response = await fetch('assets/js/data.json'); 
        if (!response.ok) {
            throw new Error(`Erreur HTTP! Statut: ${response.status}. Vérifiez le chemin 'data.json'.`);
        }
        rawData = await response.json();
    } catch (error) {
        console.error("Erreur critique lors du chargement de data.json :", error);
        alert("Impossible de charger les données de catégorie. Veuillez vérifier le chemin du fichier 'data.json' et la console.");
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

    // --- PRÉ-REMPLISSAGE ET VALIDATION ---
    if (descriptionInput) {
        const prefilledNature = localStorage.getItem('finalCategoryText');
        const prefilledDescription = localStorage.getItem('finalDescription');
        const prefilledId = localStorage.getItem('finalClassificationId'); 

        if (prefilledNature) {
            searchInput.value = prefilledNature; 
            clearBtn.classList.add('show'); 
            
            // Remplir le champ caché (pour passer la validation)
            categoryValue.value = prefilledId || prefilledNature; 
            
            // Nettoyer les valeurs
            localStorage.removeItem('finalCategoryText');
            localStorage.removeItem('finalClassificationId');
        }

        if (prefilledDescription) {
            descriptionInput.value = prefilledDescription;
            localStorage.removeItem('finalDescription');
        }
    }
    // --- FIN DU PRÉ-REMPLISSAGE ---


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
                const parentLevel2Text = classifiedData[parts[0]].subcategories[parts[0] + '.' + parts[1]].text;
                fullText = `${classifiedData[parts[0]].text} > ${parentLevel2Text} > ${itemText}`;
            }

            const itemMatches = itemText.toLowerCase().includes(lowerQuery);

            let subItemsKey;
            let hasChildren = false;

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

                if (!hasChildren) { 
                    // Item sélectionnable (Feuille de n'importe quel niveau)
                    const escapedFullText = escapeForHtmlAttribute(fullText);
                    levelHtml += `
                        <div class="subcategory-item" data-id="${id}" onclick="window.selectCategory('${id}', '${escapedFullText}')">
                            ${highlightedText}
                        </div>
                    `;
                } else {
                    // Conteneur (A des enfants et doit être un groupe collapsible)
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

    // Fonction de recherche dans les catégories
    function searchCategories(query) {
        if (!query.trim()) {
            // Si pas de recherche, afficher le menu normal
            createDropdown();
            return;
        }

        // Utiliser renderLevel pour filtrer et afficher les résultats
        const result = renderLevel(classifiedData, 1, query, classifiedData);
        
        if (result.localHasMatches) {
            dropdownMenu.innerHTML = result.html;
        } else {
            dropdownMenu.innerHTML = '<div class="no-results">Aucun résultat trouvé</div>';
        }
    }

    // Crée le menu déroulant complet (mode normal, sans recherche)
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
                    // Cas Feuille de niveau 2 (Sélectionnable)
                   const fullText = `${category.text} > ${subcategory.text}`;
                   const escapedFullText = escapeForHtmlAttribute(fullText);
                   subcategoriesHtml += `
                        <div class="subcategory-item" data-id="${subcatId}" onclick="window.selectCategory('${subcatId}', '${escapedFullText}')">
                            ${subcategory.text}
                        </div>
                    `;
                } else {
                    // Cas Groupe de niveau 2 (Ouvrable)
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

            if (Object.keys(subcategories).length === 0) {
                 // Cas Feuille de niveau 1 (Sélectionnable, si le data.json le permet)
                 const fullText = category.text;
                 const escapedFullText = escapeForHtmlAttribute(fullText);
                 html += `
                    <div class="subcategory-item" data-id="${catId}" onclick="window.selectCategory('${catId}', '${escapedFullText}')">
                        ${category.text}
                    </div>
                `;
            } else {
                // Cas Groupe de niveau 1 (Ouvrable)
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
        // 1. Définir la valeur de l'input caché avec l'ID de classification pour l'envoi
        categoryValue.value = id; 
        
        // 2. Extraire la catégorie la plus précise à afficher dans l'input visible
        const displayValue = getLastCategory(text);
        searchInput.value = displayValue; 
        
        // 3. Fermer le menu déroulant
        dropdownMenu.classList.remove('show');
        searchInput.classList.remove('has-results');
        
        if (displayValue) { 
            clearBtn.classList.add('show');
        }
    }


    // --- 3. Événements DOM ---

    // Événement FOCUS 
    searchInput.addEventListener('focus', function() {
        if (!searchInput.value.trim()) {
            createDropdown();
        } else {
            searchCategories(searchInput.value);
        }

        dropdownMenu.classList.add('show');
        searchInput.classList.add('has-results');
    });

    // Événement INPUT (Recherche)
    searchInput.addEventListener('input', function(e) {
        const query = e.target.value;
        
        searchCategories(query);
        
        dropdownMenu.classList.add('show');
        searchInput.classList.add('has-results'); 
        
        if (query.trim()) {
             // Si l'utilisateur tape, on efface l'ID/texte de validation
            categoryValue.value = ''; 
            clearBtn.classList.add('show');
        } else {
            clearBtn.classList.remove('show');
            categoryValue.value = '';
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
        
        if (mainForm.checkValidity() && categoryValue.value.trim() !== '') { 
            modal.style.display = "block";
        } else if (categoryValue.value.trim() === '') {
            alert("Veuillez sélectionner une nature d'incident en cliquant sur un élément dans la liste déroulante.");
            searchInput.focus();
        }
    });

    confirmSendBtn.addEventListener('click', function() {
        modal.style.display = "none";
        
        const formData = {
            classification_id: categoryValue.value,
            nature_selection: searchInput.value,
            description: descriptionInput.value, 
            heure: document.getElementById('heure').value, 
            lieu: document.getElementById('lieu').value
        };

        console.log('Rapport soumis :', formData);
        alert('Rapport soumis avec succès !'); 
        
        // Réinitialisation complète
        mainForm.reset();
        searchInput.value = '';
        categoryValue.value = '';
        clearBtn.classList.remove('show');
        searchInput.classList.remove('has-results');
        searchInput.setAttribute('placeholder', "Choisir une nature");
        
        if (descriptionInput) {
            descriptionInput.value = '';
        }
    });

    cancelSendBtn.addEventListener('click', function() {
        modal.style.display = "none";
    });
    
    // Initialise le dropdown
    createDropdown();
}

// Démarre l'application
loadDataAndInitialize();