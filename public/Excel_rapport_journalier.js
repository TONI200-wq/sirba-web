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
          calculerTotaux(data);
      
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
      
              const values = new Set();
      
              document.querySelectorAll("#tableRapport tbody tr").forEach(row => {
                values.add(row.children[colIndex].innerText);
              });
      
              // Afficher toutes les options
              const showAll = document.createElement("div");
              showAll.textContent = "Tout afficher";
              showAll.onclick = () => {
                document.querySelectorAll("#tableRapport tbody tr").forEach(r => r.style.display = "");
                menu.remove();
              };
              menu.appendChild(showAll);
      
              // Afficher les valeurs uniques
              values.forEach(value => {
                const option = document.createElement("div");
                option.textContent = value || "(vide)";
                option.onclick = () => {
                  document.querySelectorAll("#tableRapport tbody tr").forEach(row => {
                    if (row.children[colIndex].innerText === value) {
                      row.style.display = "";
                    } else {
                      row.style.display = "none";
                    }
                  });
                  menu.remove();
                };
                menu.appendChild(option);
              });
      
              document.body.appendChild(menu);
      
              const rect = th.getBoundingClientRect();
              menu.style.top = rect.bottom + window.scrollY + "px";
              menu.style.left = rect.left + window.scrollX + "px";
              e.stopPropagation();
            });
          });
      
          document.addEventListener("click", () => {
            document.querySelectorAll(".filter-menu").forEach(m => m.remove());
          });
        }
      
        // Fonction de suppression d'une ligne
        async function supprimer(id) {
          const confirmation = confirm("Supprimer cette ligne ?");
          if (!confirmation) return;
      
          await fetch("/api/rapport?id=" + id, {
            method: "DELETE"
          });
      
          location.reload();
        }
      
        // Fonction de calcul des totaux
        function calculerTotaux(data) {
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
      
          data.forEach(row => {
            totalVolume += Number(row.volume || 0);
            totalLafarge += Number(row.ciment_lafarge || 0);
            totalCimbenin += Number(row.ciment_cimbenin || 0);
            totalCHF += Number(row.ciment_chf || 0);
            totalEau += Number(row.eau || 0);
      
            totalAdit1 += Number(row.adit1 || 0);
            totalAdit2 += Number(row.adit2 || 0);
            totalAdit3 += Number(row.adit3 || 0);
            totalAdit4 += Number(row.adit4 || 0);
            totalAdit5 += Number(row.adit5 || 0);
            totalAdit6 += Number(row.adit6 || 0);
            totalAdit7 += Number(row.adit7 || 0);
          });
      
          // Affichage des totaux dans la ligne du bas
          document.getElementById("totalVolume").textContent = totalVolume;
          document.getElementById("totalLafarge").textContent = totalLafarge;
          document.getElementById("totalCimbenin").textContent = totalCimbenin;
          document.getElementById("totalCHF").textContent = totalCHF;
      
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