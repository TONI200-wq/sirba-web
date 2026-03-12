function formatDateFR(dateString){

    const date = new Date(dateString);
    
    const day = String(date.getDate()).padStart(2,"0");
    const month = String(date.getMonth()+1).padStart(2,"0");
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
    
    }

document.addEventListener("DOMContentLoaded", async () => {

    const table = document.getElementById("tableRapport");
    const tableBody = document.querySelector("#tableRapport tbody");
    const toggles = document.getElementById("columnToggles");
    
    try {
    
    const res = await fetch("/api/rapport");
    const data = await res.json();
    
    data.forEach((row,index)=>{
    
    const tr = document.createElement("tr");
    
    tr.innerHTML = `
    
    <td>${index + 1}</td>
    <td>${formatDateFR(row.date_production)}</td>
    <td>${row.type_beton}</td>
    <td>${row.volume}</td>
    <td>${row.client}</td>
    
    <td>${row.ciment_lafarge}</td>
    <td>${row.ciment_cimbenin}</td>
    <td>${row.ciment_chf}</td>
    
    <td>${row.agre01}</td>
    <td>${row.agre02}</td>
    <td>${row.agre03}</td>
    <td>${row.agre04}</td>
    
    <td>${row.eau}</td>
    
    <td>${row.adit1}</td>
    <td>${row.adit2}</td>
    <td>${row.adit3}</td>
    <td>${row.adit4}</td>
    <td>${row.adit5}</td>
    <td>${row.adit6}</td>
    <td>${row.adit7}</td>
    
    <td>${row.observations}</td>
    
    <td>${row.gra1}</td>
    <td>${row.gra2}</td>
    <td>${row.gra3}</td>
    <td>${row.gra4}</td>
    
    <td>
    <button onclick="supprimer(${row.id})">❌</button>
    </td>
    
    `;
    
    tableBody.appendChild(tr);
    
    });
    
    } catch(err){
    
    console.error("Erreur chargement :", err);
    
    }
    
    
     /* =========================
        CREER LES TOGGLES COLONNES
     ========================= */
    
    const headers = table.querySelectorAll("th");
    
    headers.forEach((header,index)=>{
    
    const label = document.createElement("label");
    
    const checkbox = document.createElement("input");
    
    checkbox.type = "checkbox";
    checkbox.checked = true;
    
    checkbox.addEventListener("change",()=>{
    
    const cells = table.querySelectorAll(
    `tr > *:nth-child(${index+1})`
    );
    
    cells.forEach(cell=>{
    cell.style.display = checkbox.checked ? "" : "none";
    });
    
    });
    
    label.appendChild(checkbox);
    label.append(" " + header.textContent);
    
    toggles.appendChild(label);
    toggles.appendChild(document.createElement("br"));
    
    });
    
    });
    
    
    
    async function supprimer(id){
    
    const confirmation = confirm("Supprimer cette ligne ?");
    
    if(!confirmation) return;
    
    await fetch("/api/rapport?id="+id,{
    method:"DELETE"
    });
    
    location.reload();
    
    }