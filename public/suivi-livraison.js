document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("livraisonForm");
  const tableBody = document.querySelector("#tableSuivi tbody");
  const periodeInput = document.getElementById("periode");

  // =========================
  // CHARGER LES DONNÉES
  // =========================
  async function chargerDonnees() {
    try {
      const res = await fetch("/api/livraisons");
      const data = await res.json();

      tableBody.innerHTML = ""; // anti doublons

      data.forEach((item, index) => {
        const numero = item.ordre || item.id || (index + 1);
        ajouterLigne(item, numero);
      });

      // ⚡ IMPORTANT : recréer filtres après chargement
      initFilters();

    } catch (err) {
      console.error("Erreur chargement:", err);
    }
  }

  chargerDonnees();

  // =========================
  // SOUMISSION FORMULAIRE
  // =========================
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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      if (!res.ok) throw new Error("Erreur serveur");

      // recharge depuis DB
      await chargerDonnees();
      form.reset();

    } catch (err) {
      console.error("Erreur enregistrement:", err);
      alert("Erreur lors de l'enregistrement");
    }
  });

  // =========================
  // AJOUT LIGNE TABLEAU
  // =========================
  function ajouterLigne(data, numero) {

    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${numero}</td>
      <td>${data.periode ?? ""}</td>
      <td>${data.client ?? ""}</td>
      <td>${data.bc ?? ""}</td>
      <td>${data.be ?? ""}</td>
      <td>${data.datecreation || data.dateCreation || ""}</td>
      <td>${data.dateemission || data.dateEmission || ""}</td>
      <td>${data.dateprevision || data.datePrevision || ""}</td>
      <td>${data.typeproduit || data.typeProduit || ""}</td>
      <td>${data.designation ?? ""}</td>
      <td>${data.quantiteenlever || data.quantiteEnlever || ""}</td>
      <td>${data.datelivraison || data.dateLivraison || ""}</td>
      <td>${data.bl ?? ""}</td>
      <td>${data.quantitelivree || data.quantiteLivree || ""}</td>
      <td>${data.reste ?? ""}</td>
      <td>${data.heurechargement || data.heureChargement || ""}</td>
      <td>${data.slumpdepart || data.slumpDepart || ""}</td>
      <td>${data.transporteur ?? ""}</td>
      <td>${data.camion ?? ""}</td>
      <td>${data.conducteur ?? ""}</td>
      <td>${data.heuredepart || data.heureDepart || ""}</td>
      <td>${data.heurearrivee || data.heureArrivee || ""}</td>
      <td>${data.slumparrivee || data.slumpArrivee || ""}</td>
    `;

    tableBody.appendChild(row);
  }

  // =========================
  // FILTRES MENU TYPE EXCEL
  // =========================
  function initFilters() {

    const table = document.getElementById("tableSuivi");
    const tbody = table.querySelector("tbody");
    const selects = document.querySelectorAll(".filter-row select");

    // reset options
    selects.forEach(select => {
      select.innerHTML = `<option value="">Tous</option>`;
    });

    // remplir menus automatiquement
    selects.forEach(select => {

      const col = Number(select.dataset.col);
      const values = new Set();

      tbody.querySelectorAll("tr").forEach(row => {
        if (row.children[col]) {
          values.add(row.children[col].textContent.trim());
        }
      });

      values.forEach(val => {
        if (val !== "") {
          const option = document.createElement("option");
          option.value = val;
          option.textContent = val;
          select.appendChild(option);
        }
      });
    });

    // filtre
    selects.forEach(select => {
      select.onchange = () => {

        const rows = tbody.querySelectorAll("tr");

        rows.forEach(row => {

          let visible = true;

          selects.forEach(s => {
            const col = Number(s.dataset.col);
            const val = s.value;

            if (val && row.children[col].textContent.trim() !== val) {
              visible = false;
            }
          });

          row.style.display = visible ? "" : "none";
        });

      };
    });
  }

});
