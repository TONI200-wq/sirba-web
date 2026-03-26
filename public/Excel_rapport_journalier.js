const filtresActifs = {};
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
      
        let filtresActifs = {};

      // Mise à jour des filtres actifs pour chaque colonne
      function mettreAJourFiltres(colIndex, value, checked) {
        // Initialiser le tableau si inexistant
        if (!filtresActifs[colIndex]) {
          filtresActifs[colIndex] = [];
        }
      
        if (checked) {
          // Ajouter la valeur sans doublon
          if (!filtresActifs[colIndex].includes(value)) {
            filtresActifs[colIndex].push(value);
          }
        } else {
          // Retirer la valeur
          filtresActifs[colIndex] = filtresActifs[colIndex].filter(val => val !== value);
      
          // 🔥 Supprimer la colonne si elle n’a plus de filtre
          if (filtresActifs[colIndex].length === 0) {
            delete filtresActifs[colIndex];
          }
        }
      }
      
        try {
          const res = await fetch("/api/rapport");
          const data = await res.json();
      
          // Insertion des données dans le tableau
          data.forEach((row, index) => {
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
      
          // Calcul des totaux et mise à jour de la ligne du bas
          calculerTotaux();
      
          // Appeler les filtres
          activerFiltres();
      
        } catch (err) {
          console.error("Erreur chargement :", err);
        }
      
        // Fonction de filtrage des colonnes
        function activerFiltres() {
          const headers = document.querySelectorAll("#tableRapport thead th");
        
          headers.forEach((th, colIndex) => {
            th.addEventListener("click", (e) => {
              document.querySelectorAll(".filter-menu").forEach(m => m.remove());
        
              const menu = document.createElement("div");
              menu.className = "filter-menu";
        
              // Empêche fermeture du menu
              menu.addEventListener("click", (e) => {
                e.stopPropagation();
              });
        
              // 🔥 Barre de recherche
              const searchInput = document.createElement("input");
              searchInput.type = "text";
              searchInput.placeholder = "Rechercher...";
              searchInput.style.width = "100%";
              searchInput.style.marginBottom = "5px";
              menu.appendChild(searchInput);
        
              // 🔥 Set des valeurs
              const values = new Set();
        
              document.querySelectorAll("#tableRapport tbody tr").forEach(row => {
                if (row.style.display === "none") return;
        
                const cellText = row.children[colIndex].innerText.trim();
                values.add(cellText);
              });
        
              // 🔥 "Afficher tout"
              const selectAllDiv = document.createElement("div");
        
              const selectAllCheckbox = document.createElement("input");
              selectAllCheckbox.type = "checkbox";
              selectAllCheckbox.checked = true;
        
              selectAllCheckbox.addEventListener("change", () => {
                const checkboxes = menu.querySelectorAll(".filter-option input");
        
                checkboxes.forEach(cb => {
                  cb.checked = selectAllCheckbox.checked;
                  mettreAJourFiltres(colIndex, cb.value, cb.checked);
                });
        
                appliquerFiltres();
              });
        
              selectAllDiv.appendChild(selectAllCheckbox);
              selectAllDiv.append(" Afficher tout");
              menu.appendChild(selectAllDiv);
        
              // 🔥 Options
              values.forEach(value => {
                const option = document.createElement("div");
                option.classList.add("filter-option");
        
                const checkbox = document.createElement("input");
                checkbox.type = "checkbox";
                checkbox.value = value;
                checkbox.checked = (filtresActifs[colIndex] || []).includes(value);
        
                checkbox.addEventListener("change", () => {
                  mettreAJourFiltres(colIndex, value, checkbox.checked);
                  appliquerFiltres();
        
                  // sync select all
                  const allChecked = [...menu.querySelectorAll(".filter-option input")]
                    .every(cb => cb.checked);
        
                  selectAllCheckbox.checked = allChecked;
                });
        
                option.appendChild(checkbox);
                option.append(" " + (value || "(vide)"));
        
                menu.appendChild(option);
              });
        
              // 🔥 Recherche
              searchInput.addEventListener("input", () => {
                const search = searchInput.value.toLowerCase();
        
                const options = menu.querySelectorAll(".filter-option");
        
                options.forEach(opt => {
                  const text = opt.textContent.toLowerCase();
                  opt.style.display = text.includes(search) ? "" : "none";
                });
              });
        
              document.body.appendChild(menu);
        
              const rect = th.getBoundingClientRect();
              menu.style.top = rect.bottom + window.scrollY + "px";
              menu.style.left = rect.left + window.scrollX + "px";
        
              e.stopPropagation();
            });
          });
        
          // fermeture menu
          document.addEventListener("click", () => {
            document.querySelectorAll(".filter-menu").forEach(m => m.remove());
          });
        }

        function appliquerFiltres() {
          const rows = document.querySelectorAll("#tableRapport tbody tr");
        
          rows.forEach(row => {
            let visible = true;
        
            for (const colIndex in filtresActifs) {
              const filtres = filtresActifs[colIndex];
        
              if (!filtres || filtres.length === 0) continue;
        
              const cellValue = row.children[colIndex].innerText.trim();
        
              const match = filtres.some(v =>
                String(v).trim().toLowerCase() === String(cellValue).trim().toLowerCase()
              );
        
              if (!match) {
                visible = false;
                break;
              }
            }
        
            row.style.display = visible ? "" : "none";
          });
        
          // 🔥 recalcul des totaux
          calculerTotaux();
        
          // 🔥 INDICATEUR VISUEL (ICI EXACTEMENT)
          const headers = document.querySelectorAll("#tableRapport thead th");
        
          headers.forEach((th, index) => {
            if (filtresActifs[index] && filtresActifs[index].length > 0) {
              th.style.backgroundColor = "#d1e7ff";
              th.style.fontWeight = "bold";
            } else {
              th.style.backgroundColor = "";
              th.style.fontWeight = "";
            }
          });
        }

        // Fonction de calcul des totaux
        function calculerTotaux(){

            const rows = document.querySelectorAll("#tableRapport tbody tr");
            
            let totalVolume = 0;
            let totalLafarge = 0;
            let totalCimbenin = 0;
            let totalCHF = 0;
            let totalEau = 0;
            
            let totalAdit1 = 0;
            let totalAdit2 = 0;
            let totalAdit3 = 0;
            let totalAdit4 = 0;
            let totalAdit5 = 0;
            let totalAdit6 = 0;
            let totalAdit7 = 0;
            
            let totalAgre1 = 0;
            let totalAgre2 = 0;
            let totalAgre3 = 0;
            let totalAgre4 = 0;
            
            rows.forEach(row=>{
            
            if(row.style.display === "none") return;
            
            const cells = row.children;
            
            totalVolume += Number(cells[3].innerText || 0);
            
            totalLafarge += Number(cells[5].innerText || 0);
            totalCimbenin += Number(cells[6].innerText || 0);
            totalCHF += Number(cells[7].innerText || 0);
            
            const agre1 = Number(cells[8].innerText || 0);
            const agre2 = Number(cells[9].innerText || 0);
            const agre3 = Number(cells[10].innerText || 0);
            const agre4 = Number(cells[11].innerText || 0);
            
            totalAgre1 += agre1;
            totalAgre2 += agre2;
            totalAgre3 += agre3;
            totalAgre4 += agre4;
            
            totalEau += Number(cells[12].innerText || 0);
            
            totalAdit1 += Number(cells[13].innerText || 0);
            totalAdit2 += Number(cells[14].innerText || 0);
            totalAdit3 += Number(cells[15].innerText || 0);
            totalAdit4 += Number(cells[16].innerText || 0);
            totalAdit5 += Number(cells[17].innerText || 0);
            totalAdit6 += Number(cells[18].innerText || 0);
            totalAdit7 += Number(cells[19].innerText || 0);
            
            });
            
            document.getElementById("totalVolume").textContent = totalVolume;
            
            document.getElementById("totalLafarge").textContent = totalLafarge;
            document.getElementById("totalCimbenin").textContent = totalCimbenin;
            document.getElementById("totalCHF").textContent = totalCHF;

            document.getElementById("totalAgre1").textContent = totalAgre1;
            document.getElementById("totalAgre2").textContent = totalAgre2;
            document.getElementById("totalAgre3").textContent = totalAgre3;
            document.getElementById("totalAgre4").textContent = totalAgre4;
            
            document.getElementById("totalEau").textContent = totalEau;
            
            document.getElementById("totalAdit1").textContent = totalAdit1;
            document.getElementById("totalAdit2").textContent = totalAdit2;
            document.getElementById("totalAdit3").textContent = totalAdit3;
            document.getElementById("totalAdit4").textContent = totalAdit4;
            document.getElementById("totalAdit5").textContent = totalAdit5;
            document.getElementById("totalAdit6").textContent = totalAdit6;
            document.getElementById("totalAdit7").textContent = totalAdit7;
            
            }
});

// Fonction de suppression d'une ligne
async function supprimer(id) {
    const confirmation = confirm("Supprimer cette ligne ?");
    if (!confirmation) return;

    await fetch("/api/rapport?id=" + id, {
      method: "DELETE"
    });

    location.reload();
  }


