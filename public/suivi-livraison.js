document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("livraisonForm");
  const tableBody = document.querySelector("#tableSuivi tbody");
  const periodeInput = document.getElementById("periode");

  let ordre = 1;

  // 🔁 Charger les données sauvegardées
  const savedData = JSON.parse(localStorage.getItem("livraisons")) || [];

  savedData.forEach((data, index) => {
    ajouterLigne(data, index + 1);
  });

  ordre = savedData.length + 1;

  // 📝 Soumission formulaire
  form.addEventListener("submit", (e) => {
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
      quantiteEnlever: quantiteEnlever.value,
      dateLivraison: dateLivraison.value,
      bl: bl.value,
      quantiteLivree: quantiteLivree.value,
      reste: quantiteEnlever.value - quantiteLivree.value,
      heureChargement: heureChargement.value,
      slumpDepart: slumpDepart.value,
      transporteur: transporteur.value,
      camion: camion.value,
      conducteur: conducteur.value,
      heureDepart: heureDepart.value,
      heureArrivee: heureArrivee.value,
      slumpArrivee: slumpArrivee.value
    };

    // ➕ Ajouter dans tableau
    ajouterLigne(data, ordre++);

    // 💾 Sauvegarder dans localStorage
    savedData.push(data);
    localStorage.setItem("livraisons", JSON.stringify(savedData));

    form.reset();
  });

  function ajouterLigne(data, numero) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${numero}</td>
      <td>${data.periode}</td>
      <td>${data.client}</td>
      <td>${data.bc}</td>
      <td>${data.be}</td>
      <td>${data.dateCreation}</td>
      <td>${data.dateEmission}</td>
      <td>${data.datePrevision}</td>
      <td>${data.typeProduit}</td>
      <td>${data.designation}</td>
      <td>${data.quantiteEnlever}</td>
      <td>${data.dateLivraison}</td>
      <td>${data.bl}</td>
      <td>${data.quantiteLivree}</td>
      <td>${data.reste}</td>
      <td>${data.heureChargement}</td>
      <td>${data.slumpDepart}</td>
      <td>${data.transporteur}</td>
      <td>${data.camion}</td>
      <td>${data.conducteur}</td>
      <td>${data.heureDepart}</td>
      <td>${data.heureArrivee}</td>
      <td>${data.slumpArrivee}</td>
    `;

    tableBody.appendChild(row);
  }
});
