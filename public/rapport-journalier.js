document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("rapportForm");
    const tableBody = document.querySelector("#tableRapport tbody");
    const sheetsContainer = document.getElementById("sheets");
    
    let feuilles = {};
    let feuilleActive = null;
    
    
    /* =========================
    CHARGER DONNEES
    ========================= */
    
    async function chargerDonnees(){
    
    try{
    
    const res = await fetch("/api/rapport");
    const data = await res.json();
    
    feuilles = {};
    
    data.forEach(row => {
    
    const date = row.date_production;
    
    if(!feuilles[date]){
    feuilles[date] = [];
    }
    
    feuilles[date].push(row);
    
    });
    
    creerFeuilles();
    
    }catch(err){
    
    console.error("Erreur chargement",err);
    
    }
    
    }
    
    
    /* =========================
    CREER FEUILLES
    ========================= */
    
    function creerFeuilles(){
    
    sheetsContainer.innerHTML = "";
    
    Object.keys(feuilles).forEach(date => {
    
    const btn = document.createElement("button");
    
    btn.textContent = date;
    btn.className = "sheet-btn";
    
    btn.onclick = () => afficherFeuille(date);
    
    sheetsContainer.appendChild(btn);
    
    });
    
    }
    
    
    /* =========================
    AFFICHER FEUILLE
    ========================= */
    
    function afficherFeuille(date){
    
    feuilleActive = date;
    
    tableBody.innerHTML = "";
    
    const rows = feuilles[date];
    
    rows.forEach((item,index)=>{
    
    ajouterLigne(item,index+1);
    
    });
    
    }
    
    
    /* =========================
    AJOUTER LIGNE
    ========================= */
    
    function ajouterLigne(data,numero){
    
    const row = document.createElement("tr");
    
    row.innerHTML = `
    
    <td>${numero}</td>
    <td>${data.date_production}</td>
    <td>${data.type_beton}</td>
    <td>${data.volume}</td>
    <td>${data.client}</td>
    
    <td>${data.ciment_lafarge}</td>
    <td>${data.ciment_cimbenin}</td>
    <td>${data.ciment_chf}</td>
    
    <td>${data.agre01}</td>
    <td>${data.agre02}</td>
    <td>${data.agre03}</td>
    <td>${data.agre04}</td>
    
    <td>${data.eau}</td>
    
    <td>${data.adit1}</td>
    <td>${data.adit2}</td>
    <td>${data.adit3}</td>
    <td>${data.adit4}</td>
    <td>${data.adit5}</td>
    <td>${data.adit6}</td>
    <td>${data.adit7}</td>
    
    <td>${data.observations}</td>
    
    <td>${data.gra1}</td>
    <td>${data.gra2}</td>
    <td>${data.gra3}</td>
    <td>${data.gra4}</td>
    
    <td>
    <button class="deleteBtn" data-id="${data.id}">❌</button>
    </td>
    
    `;
    
    tableBody.appendChild(row);
    
    }
    
    
    /* =========================
    FORMULAIRE
    ========================= */
    
    form.addEventListener("submit", async (e)=>{
    
    e.preventDefault();
    
    const date = dateProduction.value;
    
    const gra1 = Number(gra1Input.value || 0);
    const gra2 = Number(gra2Input.value || 0);
    const gra3 = Number(gra3Input.value || 0);
    const gra4 = Number(gra4Input.value || 0);
    
    
    /* CALCUL GRANULATS */
    
    const agre01 = gra3 - gra2;
    const agre02 = gra1;
    const agre03 = gra2 - gra1;
    const agre04 = gra4;
    
    
    const data = {
    
    date_production: date,
    type_beton: typeBeton.value,
    volume: volume.value,
    client: client.value,
    
    ciment_lafarge: cimentLafarge.value,
    ciment_cimbenin: cimentCimbenin.value,
    ciment_chf: cimentCHF.value,
    
    gra1,
    gra2,
    gra3,
    gra4,
    
    agre01,
    agre02,
    agre03,
    agre04,
    
    eau: eau.value,
    
    adit1: adit1.value,
    adit2: adit2.value,
    adit3: adit3.value,
    adit4: adit4.value,
    adit5: adit5.value,
    adit6: adit6.value,
    adit7: adit7.value,
    
    observations: observations.value
    
    };
    
    try{
    
    const res = await fetch("/api/rapport",{
    
    method:"POST",
    headers:{
    "Content-Type":"application/json"
    },
    body:JSON.stringify(data)
    
    });
    
    if(!res.ok) throw new Error("Erreur serveur");
    
    await chargerDonnees();
    
    if(feuilles[date]){
    afficherFeuille(date);
    }
    
    form.reset();
    
    }catch(err){
    
    console.error(err);
    alert("Erreur enregistrement");
    
    }
    
    });
    
    
    /* =========================
    SUPPRESSION
    ========================= */
    
    document.addEventListener("click", async (e)=>{
    
    if(e.target.classList.contains("deleteBtn")){
    
    const id = e.target.dataset.id;
    
    const confirmation = confirm("Supprimer cette ligne ?");
    
    if(!confirmation) return;
    
    await fetch("/api/rapport?id="+id,{
    method:"DELETE"
    });
    
    chargerDonnees();
    
    }
    
    });
    
    
    chargerDonnees();

    document
    .getElementById("visualiserBtn")
    .addEventListener("click", () => {

        document
        .getElementById("visualiserBtn")
        .addEventListener("click", () => {
        
        document
        .querySelector(".excel-layout")
        .scrollIntoView({
        behavior: "smooth"
        });
        
        });
    });
    
    });