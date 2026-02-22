document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("livraisonForm");
  const tableBody = document.querySelector("#tableSuivi tbody");
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

    } catch (err) {
      console.error("Erreur chargement:", err);
    }
  }

  chargerDonnees();

  /* =========================
     FORMULAIRE
  ========================= */
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

      await chargerDonnees();
      form.reset();

    } catch (err) {
      console.error("Erreur enregistrement:", err);
      alert("Erreur lors de l'enregistrement");
    }
  });

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

});
