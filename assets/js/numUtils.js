// data.js ou en haut de votre script.
const SERVICES_UTILITES = [
  {
    id: "hopitaux",
    title: "Hôpitaux",
    iconClass: "icon-hopitaux",
    contacts: [
      {
        number: "03 44 11 21 21",
        description:
          "Centre Hospitalier Simone Veil de Beauvais, 40 avenue Léon Blum 60021 Beauvais",
      },
      {
        number: "03 44 11 21 13",
        description:
          "Équipe de Liaison et de Soins en Addictologie (ELSA) - Centre Hospitalier Simone Veil de Beauvais",
      },
      {
        number: "03 44 11 20 74",
        description:
          "Service social - Centre Hospitalier Simone Veil de Beauvais",
      },
      {
        number: "03 44 21 71 00",
        description:
          "Groupe Hospitalier Public du Sud de l'Oise GHPSO (site de Senlis), Avenue du Docteur Paul Rougé 60309 Senlis",
      },
      {
        number: "03 44 49 54 54",
        description:
          "Centre Hospitalier Bertinot-Juel, 34 B rue Pierre Budin 60240 Chaumont-en-Vexin",
      },
      {
        number: "03 44 77 33 00",
        description:
          "Centre Hospitalier Général de Clermont, Rue Frédéric Raboisson 60600 Clermont",
      },
      {
        number: "03 44 31 77 00",
        description:
          "Centre Hospitalier Georges-Decroze, Rue Ambroise Croizat 60721 Pont-Sainte-Maxence",
      },
      {
        number: "03 44 23 60 00",
        description:
          "Centre Hospitalier Intercommunal Compiègne–Noyon, 8 avenue Henri Adnot 60200 Compiègne",
      },
      {
        number: "03 44 61 60 00",
        description:
          "Groupe Hospitalier Public du Sud de l'Oise - GHPSO (site de Creil), Boulevard Laennec 60109 Creil",
      },
      {
        number: "03 44 02 53 85",
        description:
          "Centre Médico-Psychologique (CMP) de Beauvais, 26 rue du Pont d’Arcole 60000 Beauvais",
      },
      {
        number: "03 44 78 24 87",
        description:
          "Centre Médico-Psychologique (CMP) de Clermont-de-l’Oise, 5 place Camille Sellier 60600 Clermont-de-l’Oise",
      },
      {
        number: "03 44 22 41 30",
        description:
          "Centre Médico-Psychologique (CMP) de Méru, 1 rue Henri Barbusse 60110 Méru",
      },
      {
        number: "03 44 12 15 15",
        description:
          "Clinique du Parc Saint-Lazare, 1 avenue Jean Rostand 60000 Beauvais",
      },
      {
        number: "03 44 62 66 66",
        description:
          "Hôpital de Chantilly Les Jockeys, 12 avenue du Général Leclerc 60500 Chantilly",
      },
      {
        number: "03 44 59 11 19",
        description:
          "Hôpital Local Saint-Lazare de Crépy-en-Valois, 16 rue Saint-Lazare 60800 Crépy-en-Valoi",
      },
    ],
  },
  {
    id: "justice",
    title: "Maisons de justice",
    iconClass: "icon-justice",
    contacts: [
      {
        number: "03 44 52 33 90",
        description:
          "MJD de Méru: Rue Dr Graillon, 60110 Meru mjd-meru@justice.fr",
      },
      {
        number: "03 44 52 33 99",
        description:
          "MJD du Vexin-Thelle-Sablons : Rue Louis Bloquet, 60110 Meru mjd-meru@orange.fr",
      },
      {
        number: "03 65 35 04 30",
        description:
          "Espace Jaurès, 11 Rue Albert de Mun, 60400 Noyon, mjd-noyon@justice.fr",
      },
      {
        number: "03 44 64 46 70",
        description:
          "Creil : 26 Rue Voltaire, 60100 Creil, MJD@creilsudoise.fr",
      },
      {
        number: "03 44 64 46 78",
        description:
          "Creil : 26 Rue Voltaire, 60100 Creil, MJD@creilsudoise.fr",
      },
    ],
  },

  {
    id: "conciliateurs",
    title: "Conciliateurs de justice",
    iconClass: "icon-conciliateurs",
    contacts: [
      {
        number: "06 62 71 47 20",
        description:
          "Patrick Chevalier (Beauvais), patrick.chevalier@conciliateurdejustice.fr",
      },
      {
        number: "03 44 64 46 70",
        description:
          "Raymond Domptail  (Creil), raymond.domptail@conciliateurdejustice.fr",
      },
      {
        number: "03 44 66 30 30",
        description:
          "Raymond Domptail (Nogent-sur-Oise), raymond.domptail@conciliateurdejustice.fr",
      },
      {
        number: "03 44 64 44 33",
        description:
          "Raymond Domptail (Montataire), raymond.domptail@conciliateurdejustice.fr",
      },
      {
        number: "03 44 47 70 23",
        description:
          "Marie-Claude Mabille (Auneuil), marie-claude.mabille@conciliateurdejustice.fr",
      },
      {
        number: "03 44 19 29 29",
        description:
          "Françoise Salome (Saint-Just-en-Chaussée), francoise.salome@conciliateurdejustice.fr",
      },
      {
        number: "03 44 52 33 90",
        description:
          "Christian Villain (Méru), christian.villain@conciliateurdejustice.fr",
      },
      {
        number: "03 44 03 30 61",
        description:
          "Christian Villain (Noailles), christian.villain@conciliateurdejustice.fr",
      },
      {
        number: "03 44 88 38 06",
        description:
          "Gérard Laruelle  (Crépy en Valois, Nanteuil-le-Haudoin) gerard.laruelle@conciliateurdejustice.fr",
      },
      {
        number: "03 44 26 86 66",
        description:
          "Gilles Martaud (Neuilly-en-Thelle), gilles.martaud@conciliateurdejustice.fr",
      },
      {
        number: "03 44 29 48 80",
        description:
          "André Meyer (Pont-Sainte-Maxence), andre.meyer@conciliateurdejustice.fr",
      },
      {
        number: "03 44 50 84 84",
        description:
          "Xavier Gillet (Clermont), xavier.gillet@conciliateurdejustice.fr",
      },
      {
        number: "03 44 38 35 24",
        description:
          "Françoise Angotti (Compiègne), françoise.angotti@conciliateurdejustice.fr",
      },
      {
        number: "03 44 40 72 00",
        description:
          "Alain Bonat (Compiègne), alain.bonat@conciliateurdejustice.fr",
      },
      {
        number: "03 44 44 28 67",
        description:
          "Bernard Lataix (Noyon), alain.bonat@conciliateurdejustice.fr",
      },
      {
        number: "03 44 44 28 67",
        description:
          "Bernard Lataix (Noyon), alain.bonat@conciliateurdejustice.fr",
      },
      {
        number: "03 44 90 73 00",
        description:
          "Géraldine Joinct-Deboves (Lassigny), geraldine.joinct-deboves@conciliateurdejustice.fr",
      },
      {
        number: "03 44 43 60 36",
        description:
          "Géraldine Joinct-Deboves (Margny les Compiègne), geraldine.joinct-deboves@conciliateurdejustice.fr",
      },
      {
        number: "03 44 83 29 11",
        description:
          "Géraldine Joinct-Deboves (Clairoix), geraldine.joinct-deboves@conciliateurdejustice.fr",
      },
    ],
  },

  {
    id: "refuge",
    title: "SPA / Refuge",
    iconClass: "icon-refuge",
    contacts: [
      {
        number: "03 44 48 02 50",
        description:
          "SPA d'Essuilet et de l'Oise : Ferme d'Essuilet, 60510 Essuiles",
      },
      {
        number: "03 44 40 21 20",
        description:
          "SPA de Compiègne : 2 avenue de l'Armistice, 60200 Compiègne",
      },
      {
        number: "03 44 08 42 85",
        description:
          "Fondation Clara Beauvais : 55 Chemin de la Cavée aux Pierres, 60000 Beauvais",
      },
      {
        number: "06 66 46 38 95",
        description:
          "Les Toutous & Matous de la 2è Chance : 26 Rue de l'Éventail, 60730 Sainte-Geneviève",
      },
      {
        number: "06 71 74 02 25",
        description:
          "Association Les Pa'Chats : 23 Rue du Grand Raveau, 60126 Longueil-Sainte-Marie",
      },
      {
        number: "06 51 73 74 18",
        description: "Association Au bonheur des Rongeurs : 60960 Feuquières",
      },
    ],
  },

  {
    id: "soutien",
    title: "Soutien",
    iconClass: "icon-soutien",
    contacts: [
      {
        number: "3114",
        description: "Numéro national de prévention du suicide (24h/24, 7j/7)",
      },
      {
        number: "09 72 39 40 50",
        description: "SOS Amitié (24h/24, 7j/7) ou via un chat.",
      },
      {
        number: "0 980 980 930 ",
        description: "Alcool Info Service (8h-2h, 7j/7) ou via un chat.",
      },
      {
        number: "0 800 23 13 13 ",
        description: "Drogue Info Service (8h-2h, 7j/7) ou via un chat.",
      },
      {
        number: "0 800 235 236 ",
        description: "Fil santé jeunes (9h-23h, 7j/7) ou via un chat.",
      },
      {
        number: "119",
        description: "Allô enfance en danger (24h/24, 7j/7) ou via un chat.",
      },
      {
        number: "01 42 63 03 03",
        description:
          "Écoute Famille Unafam du lundi au vendredi, 9h-13h et 14h-18h).",
      },
    ],
  },
];

// --- Fonctions de génération HTML ---

function createContactCard(contact) {
  // Supprime les espaces pour un appel téléphonique propre, y compris les espaces insécables comme dans "0 980 980 930 "
  const cleanNumber = contact.number.replace(/\s/g, "");

  return `
        <li class="contact-card">
            <a href="tel:${cleanNumber}" class="contact-number">${contact.number}</a>
            <p class="contact-description">${contact.description}</p>
        </li>
    `;
}

function createAccordeon(category) {
  const contactsHTML = category.contacts.map(createContactCard).join("");

  return `
        <div class="accordeon-item" data-id="${category.id}">
            <button class="accordeon-header" aria-expanded="false" aria-controls="content-${category.id}">
                
                <span class="icon ${category.iconClass}"></span> 
                
                <span class="title">${category.title}</span>
                <span class="arrow-icon"></span>
            </button>
            
            <ul id="content-${category.id}" class="accordeon-content" hidden>
                ${contactsHTML}
            </ul>
        </div>
    `;
}

// --- Fonction d'initialisation principale et Interactivité ---

function initializeApp() {
  const container = document.getElementById("accordeon-container");

  if (!container || !SERVICES_UTILITES) {
    console.error(
      "Conteneur ou données manquantes. Vérifiez que data.js est chargé."
    );
    return;
  }

  // 1. Générer et injecter tout le HTML
  const allAccordeonsHTML = SERVICES_UTILITES.map(createAccordeon).join("");
  container.innerHTML = allAccordeonsHTML;

  // 2. Attacher les écouteurs d'événements pour l'interactivité
  // FIX: Correction du sélecteur de .accordion-header à .accordeon-header
  document.querySelectorAll(".accordeon-header").forEach((header) => {
    header.addEventListener("click", () => {
      const content = header.nextElementSibling;
      const isExpanded = header.getAttribute("aria-expanded") === "true";

      // Fermer tous les autres accordéons
      document
        .querySelectorAll('.accordeon-header[aria-expanded="true"]')
        .forEach((openHeader) => {
          if (openHeader !== header) {
            openHeader.setAttribute("aria-expanded", "false");
            openHeader.nextElementSibling.setAttribute("hidden", "");
          }
        });

      // Basculer l'état de l'accordéon cliqué
      if (isExpanded) {
            header.setAttribute('aria-expanded', 'false');
            content.setAttribute('hidden', '');
        } else {
            header.setAttribute('aria-expanded', 'true');
            content.removeAttribute('hidden');
        }
    })
  });
}

document.addEventListener("DOMContentLoaded", initializeApp);
