document.addEventListener('DOMContentLoaded', () => {
    
    // --- VARIABLES GLOBALES ET DOM ---
    const pageTitleElement = document.getElementById('pageTitle');
    const pageHeadingElement = document.getElementById('pageHeading');
    const categoryNameElement = pageHeadingElement.querySelector('.category-name'); 
    const backLinkElement = pageHeadingElement.querySelector('.back-link'); // NOUVEAU: Cible le lien de retour
    const container = document.getElementById('dynamicContainer'); 
    const modal = document.getElementById('contentModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalContent = document.getElementById('modalContent');
    const closeBtn = document.querySelector('.modal-close-btn'); 
    const declareIncidentBtn = document.querySelector('.modal-action-btn');

    let dataCache = {};
    let allClassifications = [];

    // --- MAPPING COMPLET DES ICÔNES PAR CLASSIFICATION ---
    const classificationIconMap = {
        // ... (votre mapping reste ici) ...
        // ===== CATÉGORIE 1 - Atteintes à la tranquillité des espaces collectifs =====
        '1.1': 'assets/img/Poubelle.svg', 	
        '1.2': 'assets/img/Caca.svg', 		
        '1.3': 'assets/img/Voiture.svg', 	
        '1.3.1': 'assets/img/Voiture.svg',	
        '1.3.2': 'assets/img/Voiture.svg',	
        '1.3.3': 'assets/img/Voiture.svg',	
        '1.4': 'assets/img/Outil.svg', 		
        
        // ===== CATÉGORIE 2 - Atteintes à la tranquillité des espaces privatifs =====
        '2.1': 'assets/img/nuisances_sonores.svg', 		
        '2.2': 'assets/img/nuisances_animaux.svg', 		
        
        // ===== CATÉGORIE 3 - Atteintes dû à des détournements d'usage =====
        '3.1': 'assets/img/squat_de_logements.svg', 		
        '3.2': 'assets/img/depot_darmes.svg', 		
        '3.3': 'assets/img/occupation_abusive_des_parties_communes.svg', 		
        '3.3.1': 'assets/img/violences_urbaines.svg', 	
        '3.3.2': 'assets/img/Poubelle.svg', 	
        '3.4': 'assets/img/violences_urbaines.svg', 		
        '3.5': 'assets/img/troubles_mentaux.svg', 		
        
        // ===== CATÉGORIE 4 - Atteintes aux biens =====
        '4.1': 'assets/img/aerosol.svg', 		
        '4.2': 'assets/img/degradations.svg', 		
        '4.3': 'assets/img/incendies_sinistres.svg', 		
        
        // ===== CATÉGORIE 5 - À l'attention des salariés =====
        '5.1': 'assets/img/cas_agression.svg', 		
        '5.1.1': 'assets/img/Outil.svg', 	
        '5.1.2': 'assets/img/Outil.svg', 	
        '5.2': 'assets/img/colaboration_acteurs_tranquilit.svg', 		
        '5.2.1': 'assets/img/Poubelle.svg', 	
        '5.2.2': 'assets/img/Outil.svg', 	
        '5.2.3': 'assets/img/Voiture.svg', 	
        '5.2.4': 'assets/img/Outil.svg', 	
        '5.2.5': 'assets/img/Outil.svg', 	
        '5.2.6': 'assets/img/Outil.svg', 	
        '5.2.7': 'assets/img/Outil.svg', 	
    };

    // --- FONCTION POUR OBTENIR L'ICÔNE APPROPRIÉE ---
    function getIconForItem(item) {
        if (classificationIconMap[item.classification]) {
            return classificationIconMap[item.classification];
        }

        const parts = item.classification.split('.');
        for (let i = parts.length - 1; i > 0; i--) {
            const parentClassification = parts.slice(0, i).join('.');
            if (classificationIconMap[parentClassification]) {
                return classificationIconMap[parentClassification];
            }
        }
        return 'assets/img/Outil.svg';
    }

    // --- UTILS : Détermine l'URL de retour ---
    function getBackUrl(currentClassification) {
        const parts = currentClassification.split('.');
        
        // Si on est dans une catégorie de niveau 1 (ex: '1'), le retour est l'accueil
        if (parts.length === 1) {
            return 'home.html';
        }
        
        // Sinon, le retour est la page de la classification parente
        const parentClassification = parts.slice(0, parts.length - 1).join('.');

        // Pour revenir à la page précédente de sous-catégorie, on met à jour le localStorage
        // pour que subcategories.html affiche le contenu de la classification parente
        return 'subcategories.html';
    }

    // --- UTILS : Gestion des classifications ---
    async function loadDataAndInitialize() {
        try {
            const response = await fetch('assets/js/data.json'); 
            if (!response.ok) throw new Error(`Statut: ${response.status}`);
            const rawData = await response.json();
            
            dataCache = rawData; 
            
            allClassifications = [
                ...(dataCache.category || []),
                ...(dataCache.subcategory || []),
                ...(dataCache.subsubcategory || [])
            ];
            
            renderDynamicContent();
        } catch (error) {
            if(categoryNameElement) {
                categoryNameElement.textContent = "Erreur de chargement des données.";
                pageHeadingElement.classList.add('ready'); 
            }
            console.error("Erreur lors du chargement de data.json :", error);
        }
    }

    function findItemByClassification(classification) {
        return allClassifications.find(item => item.classification === classification);
    }
    
    function findContentByLocation(classification) {
        return dataCache.content.find(content => content.location === classification);
    }
    
    function getFirstDigit(classification) {
        return classification.split('.')[0];
    }
    
    function getParentColorClass(classification) {
        const firstDigit = getFirstDigit(classification);
        return `cat${firstDigit}`; 
    }
    
    function getNextLevelItems(parentClassification) {
        const currentLevelDepth = parentClassification.split('.').length; 
        const nextLevelPrefix = parentClassification + '.';
        const targetLevelDepth = currentLevelDepth + 1;

        const nextItems = allClassifications.filter(item => {
            const parts = item.classification.split('.');
            return item.classification.startsWith(nextLevelPrefix) && parts.length === targetLevelDepth;
        }).sort((a, b) => a.classification.localeCompare(b.classification));
        
        return nextItems;
    }
    
    // --- RENDU DYNAMIQUE --- 
    function renderDynamicContent() {
        const currentClassification = localStorage.getItem('parentId');
        
        if (!currentClassification) {
            if(categoryNameElement) {
                categoryNameElement.textContent = "Veuillez sélectionner une catégorie sur la page d'accueil.";
                pageHeadingElement.classList.add('ready');
            }
            return;
        }

        const parentItem = findItemByClassification(currentClassification);
        if (!parentItem) {
            if(categoryNameElement) {
                categoryNameElement.textContent = `Erreur: Classification ${currentClassification} non trouvée.`;
                pageHeadingElement.classList.add('ready');
            }
            return;
        }

        // 1. Mise à jour du titre de la page (onglet du navigateur)
        pageTitleElement.textContent = parentItem.text;

        // 2. Mise à jour du fil d'Ariane
        const parentColorClass = getParentColorClass(currentClassification);
        
        // a. Mise à jour de la couleur
        pageHeadingElement.className = pageHeadingElement.className.replace(/\bcat\d\b/g, ''); 
        pageHeadingElement.classList.add(parentColorClass); 
        
        // b. Mise à jour du nom de la catégorie
        if (categoryNameElement) {
            categoryNameElement.textContent = parentItem.text;
        }

        // c. Mise à jour du lien de retour (CORRECTION CLÉ)
        const backUrl = getBackUrl(currentClassification);
        
        if (backUrl === 'home.html') {
            // Si c'est le niveau 1, on revient à home.html
            backLinkElement.setAttribute('href', backUrl);
            backLinkElement.removeAttribute('onclick');
        } else {
            // Si c'est un niveau > 1, on revient à subcategories.html en chargeant le parent
            const parts = currentClassification.split('.');
            const parentClassification = parts.slice(0, parts.length - 1).join('.');
            
            backLinkElement.setAttribute('href', backUrl);
            backLinkElement.onclick = function() {
                localStorage.setItem('parentId', parentClassification); // Définir la catégorie parente avant de naviguer
                window.location.href = backUrl;
                return false;
            };
        }
        

        // 3. Rendu des sous-catégories
        const nextLevelItems = getNextLevelItems(currentClassification);
        container.innerHTML = ''; 

        if (nextLevelItems.length === 0) {
            pageHeadingElement.classList.add('ready'); 
            return;
        }

        nextLevelItems.forEach(item => {
            const itemElement = document.createElement('button');
            const hasChildren = getNextLevelItems(item.classification).length > 0;
            const iconPath = getIconForItem(item);

            if (hasChildren) {
                // Style Dossier
                itemElement.classList.add('category-btn', 'one-tab', parentColorClass);
                
                itemElement.innerHTML = `
                    <div class="content-wrapper">
                        <img src="${iconPath}" alt="${item.text}" class="category-icon">
                        <p class="category-text">${item.text}</p>
                    </div>
                `;

                itemElement.addEventListener('click', function() {
                    // Clic sur un dossier : naviguer vers la sous-catégorie
                    localStorage.setItem('parentId', item.classification);
                    window.location.href = "subcategories.html";
                });

            } else {
                // Style Carte Finale
                itemElement.classList.add('final-action-btn', parentColorClass);
                
                itemElement.innerHTML = `
                    <img src="${iconPath}" alt="${item.text}" class="category-icon">
                    <p class="category-text">${item.text}</p>
                `;

                itemElement.addEventListener('click', function() {
                    showContentModal(item.classification, item.text);
                });
            }

            container.appendChild(itemElement);
        });
        
        // 4. Rendre le fil d'Ariane visible
        pageHeadingElement.classList.add('ready');
    }

    // --- LOGIQUE DE LA MODALE ---
    function showContentModal(classification, title) {
        const contentData = findContentByLocation(classification);

        modalTitle.textContent = title;
        modalContent.innerHTML = '';
        
        if (contentData) {
            modalContent.innerHTML = `
                <h2>Description :</h2>
                <p>${contentData.description || 'N/A'}</p>
                
                <h2>Aspects Légaux :</h2>
                <p>${contentData.legal || 'N/A'}</p>
                
                <h2>Solution :</h2>
                <p>${contentData.solution || 'N/A'}</p>
            `;
        } else {
            modalContent.innerHTML = `<p>Aucun contenu détaillé trouvé pour cette classification (${classification}).</p>`;
        }

        localStorage.setItem('lastContentClassification', classification);

        modal.style.display = 'flex';
        setTimeout(() => modal.classList.add('active'), 10); 
    }

    function hideContentModal() {
        modal.classList.remove('active');
        setTimeout(() => modal.style.display = 'none', 300); 
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', hideContentModal);
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideContentModal();
            }
        });
    }

    if (declareIncidentBtn) {
        declareIncidentBtn.addEventListener('click', () => {
            const finalCategoryText = modalTitle.textContent; 
            localStorage.setItem('finalCategoryText', finalCategoryText);
            window.location.href = "form.html"; 
        });
    }
    
    loadDataAndInitialize();
    
});