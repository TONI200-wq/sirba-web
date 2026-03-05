//console.log("✅ JS suivi-livraison chargé");
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("livraisonForm");
  const tableBody = document.querySelector("#tableSuivi tbody") || null;
  const periodeInput = document.getElementById("periode");
  // =========================
// FORMATAGE DATE & HEURE
// =========================

function formatDateFR(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
}

function formatHeureFR(timeString) {
  if (!timeString) return "";

  // Si format HH:MM ou HH:MM:SS
  if (timeString.includes(":") && timeString.length <= 8) {
    const parts = timeString.split(":");
    const hours = parts[0];
    const minutes = parts[1];

    return `${hours}h${minutes}`;
  }

  // Si format ISO complet
  const date = new Date(timeString);

  if (!isNaN(date)) {
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}h${minutes}`;
  }

  return timeString;
}

  /* =========================
     CHARGEMENT DONNÉES
  ========================= */
  async function chargerDonnees() {
    try {
      const res = await fetch("/api/livraisons");
      const data = await res.json();

      tableBody.innerHTML = "";

      data.forEach((item, index) => {
        const numero = item.ordre || item.id || (index + 1);
        ajouterLigne(item, numero);
      });

      activerFiltres(); // IMPORTANT → réactive les filtres après reload
      
      initialiserToggleColonnes();

    } catch (err) {
      console.error("Erreur chargement:", err);
    }
  }

  if (tableBody) {
    chargerDonnees();
  }


  // =========================
// TOGGLE COLONNES
// =========================

function initialiserToggleColonnes() {

  const headers = document.querySelectorAll("#tableSuivi thead th");
  const container = document.getElementById("columnToggles");

  container.innerHTML = "";

  headers.forEach((th, index) => {

    const label = document.createElement("label");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;

    checkbox.addEventListener("change", () => {
      toggleColonne(index, checkbox.checked);
    });

    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(th.innerText));

    container.appendChild(label);
  });
}

function toggleColonne(index, visible) {

  const rows = document.querySelectorAll("#tableSuivi tr");

  rows.forEach(row => {
    if (row.children[index]) {
      row.children[index].style.display = visible ? "" : "none";
    }
  });
}


  /* =========================
     FORMULAIRE
  ========================= */
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
  
      const data = {
        periode: periodeInput.value,
        client: client.value,
        bc: bc.value,
        be: be.value,
        dateCreation: dateCreation.value,
        dateEmission: dateEmission.value,
        datePrevision: datePrevision.value,
        typeProduit: typeProduit.value,
        designation: designation.value,
        quantiteEnlever: Number(quantiteEnlever.value),
        dateLivraison: dateLivraison.value,
        bl: bl.value,
        quantiteLivree: Number(quantiteLivree.value),
        reste: Number(quantiteEnlever.value) - Number(quantiteLivree.value),
        heureChargement: heureChargement.value,
        slumpDepart: slumpDepart.value,
        transporteur: transporteur.value,
        camion: camion.value,
        conducteur: conducteur.value,
        heureDepart: heureDepart.value,
        heureArrivee: heureArrivee.value,
        slumpArrivee: slumpArrivee.value
      };
  
      try {
        const res = await fetch("/api/livraisons", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
        });
  
        if (!res.ok) throw new Error("Erreur serveur");
  
        if (tableBody) {
          await chargerDonnees();
        }
  
        form.reset();
  
      } catch (err) {
        console.error("Erreur enregistrement:", err);
        alert("Erreur lors de l'enregistrement");
      }
    });
  }

  /* =========================
     AJOUT LIGNE
  ========================= */
  function ajouterLigne(data, numero) {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${numero}</td>
      <td>${data.periode ?? ""}</td>
      <td>${data.client ?? ""}</td>
      <td>${data.bc ?? ""}</td>
      <td>${data.be ?? ""}</td>
      <td>${formatDateFR(data.datecreation || data.dateCreation)}</td>
      <td>${formatDateFR(data.dateemission || data.dateEmission)}</td>
      <td>${formatDateFR(data.dateprevision || data.datePrevision)}</td>
      <td>${data.typeproduit || data.typeProduit || ""}</td>
      <td>${data.designation ?? ""}</td>
      <td>${data.quantiteenlever || data.quantiteEnlever || ""}</td>
      <td>${formatDateFR(data.datelivraison || data.dateLivraison)}</td>
      <td>${data.bl ?? ""}</td>
      <td>${data.quantitelivree || data.quantiteLivree || ""}</td>
      <td>${data.reste ?? ""}</td>
      <td>${formatHeureFR(data.heurechargement || data.heureChargement)}</td>
      <td>${data.slumpdepart || data.slumpDepart || ""}</td>
      <td>${data.transporteur ?? ""}</td>
      <td>${data.camion ?? ""}</td>
      <td>${data.conducteur ?? ""}</td>
      <td>${formatHeureFR(data.heuredepart || data.heureDepart)}</td>
      <td>${formatHeureFR(data.heurearrivee || data.heureArrivee)}</td>
      <td>${data.slumparrivee || data.slumpArrivee || ""}</td>
    `;

    tableBody.appendChild(row);
  }

  /* =========================
     FILTRES STYLE EXCEL
  ========================= */
  function activerFiltres() {

    document.querySelectorAll("#tableSuivi thead th").forEach((th, colIndex) => {

      th.onclick = function (e) {

        document.querySelectorAll(".filter-menu").forEach(m => m.remove());

        const menu = document.createElement("div");
        menu.className = "filter-menu";

        const values = new Set();

        document.querySelectorAll("#tableSuivi tbody tr").forEach(row => {
          values.add(row.children[colIndex].innerText);
        });

        // Tout afficher
        const showAll = document.createElement("div");
        showAll.textContent = "Tout afficher";
        showAll.onclick = () => {
          document.querySelectorAll("#tableSuivi tbody tr")
            .forEach(r => r.style.display = "");
          th.classList.remove("filtered");
          menu.remove();
        };
        menu.appendChild(showAll);

        // Options uniques
        values.forEach(value => {

          const option = document.createElement("div");
          option.textContent = value || "(Vide)";

          option.onclick = () => {

            document.querySelectorAll("#tableSuivi tbody tr")
              .forEach(row => {
                if (row.children[colIndex].innerText === value) {
                  row.style.display = "";
                } else {
                  row.style.display = "none";
                }
              });

            th.classList.add("filtered");
            menu.remove();
          };

          menu.appendChild(option);
        });

        document.body.appendChild(menu);

        const rect = th.getBoundingClientRect();
        menu.style.top = (rect.bottom + window.scrollY) + "px";
        menu.style.left = (rect.left + window.scrollX) + "px";

        e.stopPropagation();
      };
    });

    document.addEventListener("click", () => {
      document.querySelectorAll(".filter-menu")
        .forEach(m => m.remove());
    });
  }

  // =========================
// BOUTON VISUALISER
// =========================

const visualiserBtn = document.getElementById("visualiserBtn");

if (visualiserBtn) {
  visualiserBtn.addEventListener("click", () => {
    console.log("Le bouton a été cliqué !");
    window.location.href = "Excel_suivi_livraison.html";
  });
}

// =========================
// ASSISTANT BOITES DE DIALOGUE
// =========================

function calculerPeriode(dateLivraison) {

  const date = new Date(dateLivraison);
  const jour = date.getDate();
  let mois = date.getMonth();

  if (jour >= 21) {
    mois += 1;
  }

  if (mois > 11) {
    mois = 0;
  }

  const nomsMois = [
    "Janvier","Février","Mars","Avril","Mai","Juin",
    "Juillet","Août","Septembre","Octobre","Novembre","Décembre"
  ];

  return nomsMois[mois];
}

async function lancerAssistant() {

  const data = {};

  data.client = prompt("Client :");
  if (!data.client) return;

  data.bc = prompt("N° BC :");
  data.be = prompt("N° BE :");

  data.dateCreation = prompt("Date de création (YYYY-MM-DD) :");
  data.dateEmission = prompt("Date d'émission (YYYY-MM-DD) :");
  data.datePrevision = prompt("Date de prévision (YYYY-MM-DD) :");

  data.typeProduit = prompt("Type produit :");
  data.designation = prompt("Désignation :");
  data.quantiteEnlever = Number(prompt("Quantité à enlever :"));

  data.dateLivraison = prompt("Date de livraison (YYYY-MM-DD) :");

  data.periode = calculerPeriode(data.dateLivraison);

  data.bl = prompt("N° BL :");
  data.quantiteLivree = Number(prompt("Quantité livrée :"));

  data.reste = data.quantiteEnlever - data.quantiteLivree;

  data.heureChargement = prompt("Heure de chargement (HH:MM) :");
  data.slumpDepart = prompt("Slump test départ :");
  data.transporteur = prompt("Transporteur :");
  data.camion = prompt("N° Camion :");
  data.conducteur = prompt("Nom conducteur :");
  data.heureDepart = prompt("Heure de départ (HH:MM) :");
  data.heureArrivee = prompt("Heure d'arrivée (HH:MM) :");
  data.slumpArrivee = prompt("Slump test arrivée :");

  const resume = `
CLIENT : ${data.client}
PERIODE : ${data.periode}
DATE LIVRAISON : ${data.dateLivraison}
BC : ${data.bc}
BE : ${data.be}
PRODUIT : ${data.typeProduit}
DESIGNATION : ${data.designation}
QTE ENLEVER : ${data.quantiteEnlever}
QTE LIVREE : ${data.quantiteLivree}
RESTE : ${data.reste}
`;

  const confirmation = confirm("Vérifiez les informations :\n" + resume);

  if (!confirmation) {
    alert("Saisie annulée.");
    return;
  }

  // =========================
// REMPLIR LE FORMULAIRE
// =========================
document.getElementById("periode").value = "";
document.getElementById("client").value = data.client;
document.getElementById("bc").value = data.bc;
document.getElementById("be").value = data.be;

document.getElementById("dateCreation").value = data.dateCreation;
document.getElementById("dateEmission").value = data.dateEmission;
document.getElementById("datePrevision").value = data.datePrevision;

document.getElementById("typeProduit").value = data.typeProduit;
document.getElementById("designation").value = data.designation;

document.getElementById("quantiteEnlever").value = data.quantiteEnlever;

document.getElementById("dateLivraison").value = data.dateLivraison;

document.getElementById("bl").value = data.bl;
document.getElementById("quantiteLivree").value = data.quantiteLivree;

document.getElementById("heureChargement").value = data.heureChargement;
document.getElementById("slumpDepart").value = data.slumpDepart;

document.getElementById("transporteur").value = data.transporteur;
document.getElementById("camion").value = data.camion;
document.getElementById("conducteur").value = data.conducteur;

document.getElementById("heureDepart").value = data.heureDepart;
document.getElementById("heureArrivee").value = data.heureArrivee;

document.getElementById("slumpArrivee").value = data.slumpArrivee;

alert("Les données ont été transférées dans le formulaire. Vérifiez puis cliquez sur VALIDER.");
}
window.lancerAssistant = lancerAssistant;

// =========================
// LANCEMENT AUTO SI VIENT DE CENTRALE
// =========================

const params = new URLSearchParams(window.location.search);

if (params.get("auto") === "1") {
  setTimeout(() => {
    lancerAssistant();
    window.history.replaceState({}, document.title, "suivi-livraison.html");
  }, 300);
}

});
