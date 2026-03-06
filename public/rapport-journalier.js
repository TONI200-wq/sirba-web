document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("rapportForm");
    
    form.addEventListener("submit", async (e)=>{
    
    e.preventDefault();
    
    const gra1 = Number(document.getElementById("gra1").value || 0);
    const gra2 = Number(document.getElementById("gra2").value || 0);
    const gra3 = Number(document.getElementById("gra3").value || 0);
    const gra4 = Number(document.getElementById("gra4").value || 0);
    
    /* CALCUL GRANULATS */
    
    const agre01 = gra3 - gra2;
    const agre02 = gra1;
    const agre03 = gra2 - gra1;
    const agre04 = gra4;
    
    const data = {
    
    date_production: document.getElementById("dateProduction").value,
    type_beton: document.getElementById("typeBeton").value,
    volume: document.getElementById("volume").value,
    client: document.getElementById("client").value,
    
    ciment_lafarge: document.getElementById("cimentLafarge").value,
    ciment_cimbenin: document.getElementById("cimentCimbenin").value,
    ciment_chf: document.getElementById("cimentCHF").value,
    
    gra1,
    gra2,
    gra3,
    gra4,
    
    agre01,
    agre02,
    agre03,
    agre04,
    
    eau: document.getElementById("eau").value,
    
    adit1: document.getElementById("adit1").value,
    adit2: document.getElementById("adit2").value,
    adit3: document.getElementById("adit3").value,
    adit4: document.getElementById("adit4").value,
    adit5: document.getElementById("adit5").value,
    adit6: document.getElementById("adit6").value,
    adit7: document.getElementById("adit7").value,
    
    observations: document.getElementById("observations").value
    
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
    
    alert("Production enregistrée avec succès");
    
    form.reset();
    
    }catch(err){
    
    console.error(err);
    alert("Erreur enregistrement");
    
    }
    
    });
    
    
    /* =========================
    BOUTON VISUALISER
    ========================= */
    
    document
    .getElementById("visualiserBtn")
    .addEventListener("click", () => {
    
    window.location.href = "Excel_rapport_journalier.html";
    
    });
    
    });