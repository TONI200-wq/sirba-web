document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("livraisonForm");
  const tableBody = document.querySelector("#tableSuivi tbody");
  const periodeInput = document.getElementById("periode");

  let ordre = 1;

  // =========================
  // CHARGER LES DONNÉES DEPUIS POSTGRESQL
  // =========================
  fetch("/api/livraisons")
    .then(res => res.json())
    .then(data => {
      data.forEach((item, index) => {
        ajouterLigne(item, index + 1);
      });
      ordre = data.length + 1;
    })
    .catch(err => console.error("Erreur chargement:", err));


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
      // 📤 ENVOYER AU SERVEUR
      await fetch("/api/livraisons", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      // ➕ Ajouter dans tableau immédiatement
      ajouterLigne(data, ordre++);
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
      <td>${data.periode}</td>
      <td>${data.client}</td>
      <td>${data.bc}</td>
      <td>${data.be}</td>
      <td>${data.datecreation || data.dateCreation}</td>
      <td>${data.dateemission || data.dateEmission}</td>
      <td>${data.dateprevision || data.datePrevision}</td>
      <td>${data.typeproduit || data.typeProduit}</td>
      <td>${data.designation}</td>
      <td>${data.quantiteenlever || data.quantiteEnlever}</td>
      <td>${data.datelivraison || data.dateLivraison}</td>
      <td>${data.bl}</td>
      <td>${data.quantitelivree || data.quantiteLivree}</td>
      <td>${data.reste}</td>
      <td>${data.heurechargement || data.heureChargement}</td>
      <td>${data.slumpdepart || data.slumpDepart}</td>
      <td>${data.transporteur}</td>
      <td>${data.camion}</td>
      <td>${data.conducteur}</td>
      <td>${data.heuredepart || data.heureDepart}</td>
      <td>${data.heurearrivee || data.heureArrivee}</td>
      <td>${data.slumparrivee || data.slumpArrivee}</td>
    `;

    tableBody.appendChild(row);
  }
});
