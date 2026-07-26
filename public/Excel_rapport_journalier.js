document.addEventListener("DOMContentLoaded", async () => {

  const table = document.getElementById("tableRapport");
  const tableBody = document.querySelector("#tableRapport tbody");
  const toggles = document.getElementById("columnToggles");

  let filtresActifs = {};


  // ================================
  // FORMAT DATE
  // ================================

  function formatDateFR(dateString){

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2,"0");
    const month = String(date.getMonth()+1).padStart(2,"0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;

  }



  // ================================
  // GESTION AFFICHAGE DES COLONNES
  // ================================

  function creerGestionColonnes(){

    toggles.innerHTML = "";

    const headers = document.querySelectorAll("#tableRapport thead th");


    headers.forEach((th,index)=>{


      const label = document.createElement("label");


      const checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.checked = true;



      checkbox.addEventListener("change",()=>{


        const display = checkbox.checked ? "" : "none";


        // cacher titre colonne
        th.style.display = display;



        // cacher cellules
        document.querySelectorAll("#tableRapport tbody tr")
        .forEach(row=>{

          if(row.children[index]){
            row.children[index].style.display = display;
          }

        });



        // cacher total
        const totalCell =
        document.querySelector("#ligneTotal")
        ?.children[index];


        if(totalCell){
          totalCell.style.display = display;
        }


      });



      label.appendChild(checkbox);

      label.append(
        " " + th.innerText
      );


      toggles.appendChild(label);

      toggles.appendChild(
        document.createElement("br")
      );


    });


  }




  // ================================
  // CHARGEMENT DES DONNEES
  // ================================


  try{


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
        <button onclick="supprimer(${row.id})">
        ❌
        </button>
      </td>

      `;



      tableBody.appendChild(tr);


    });



    // Création menu colonnes
    creerGestionColonnes();



    console.log(
      "Colonnes chargées :",
      document.querySelectorAll("#tableRapport thead th").length
    );



    calculerTotaux();



    activerFiltres();



  }
  catch(err){

    console.error(
      "Erreur chargement :",
      err
    );

  }



    // ================================
  // MISE A JOUR DES FILTRES
  // ================================


  function mettreAJourFiltres(colIndex,value,checked){


    if(!filtresActifs[colIndex]){
      filtresActifs[colIndex] = [];
    }



    if(checked){


      if(!filtresActifs[colIndex].includes(value)){

        filtresActifs[colIndex].push(value);

      }


    }
    else{


      filtresActifs[colIndex] =
      filtresActifs[colIndex]
      .filter(v=>v!==value);



      if(filtresActifs[colIndex].length===0){

        delete filtresActifs[colIndex];

      }


    }


  }





  // ================================
  // ACTIVATION DES FILTRES
  // ================================


  function activerFiltres(){


    const headers =
    document.querySelectorAll("#tableRapport thead th");



    headers.forEach((th,colIndex)=>{


      th.addEventListener("click",(e)=>{


        document
        .querySelectorAll(".filter-menu")
        .forEach(m=>m.remove());



        const menu =
        document.createElement("div");


        let filtresTemp =
        JSON.parse(JSON.stringify(filtresActifs));



        menu.className="filter-menu";



        menu.addEventListener("click",(e)=>{

          e.stopPropagation();

        });



        // ============================
        // RECHERCHE
        // ============================


        const searchInput =
        document.createElement("input");


        searchInput.type="text";

        searchInput.placeholder="Rechercher...";


        searchInput.style.width="100%";

        searchInput.style.marginBottom="5px";


        menu.appendChild(searchInput);





        // ============================
        // VALEURS DISPONIBLES
        // ============================


        const values = new Set();



        document
        .querySelectorAll("#tableRapport tbody tr")
        .forEach(row=>{


          const value =
          row.children[colIndex]
          .innerText.trim();



          values.add(value);



        });





        // ============================
        // AFFICHER TOUT
        // ============================


        const selectAllDiv =
        document.createElement("div");



        const selectAllCheckbox =
        document.createElement("input");



        selectAllCheckbox.type="checkbox";



        selectAllDiv.appendChild(
          selectAllCheckbox
        );


        selectAllDiv.append(
          " Afficher tout"
        );


        menu.appendChild(selectAllDiv);






        selectAllCheckbox.addEventListener("change",()=>{


          const checkboxes =
          menu.querySelectorAll(
            ".filter-option input"
          );



          checkboxes.forEach(cb=>{


            cb.checked =
            selectAllCheckbox.checked;



          });



          if(selectAllCheckbox.checked){


            delete filtresTemp[colIndex];


          }
          else{


            filtresTemp[colIndex]=
            [...checkboxes]
            .filter(cb=>cb.checked)
            .map(cb=>cb.value);


          }


        });






        // ============================
        // CREATION CHECKBOX
        // ============================



        values.forEach(value=>{


          const option =
          document.createElement("div");


          option.classList.add(
            "filter-option"
          );



          const checkbox =
          document.createElement("input");



          checkbox.type="checkbox";

          checkbox.value=value;



          checkbox.checked =
          !filtresTemp[colIndex] ||
          filtresTemp[colIndex]
          .includes(value);






          checkbox.addEventListener("change",()=>{


            if(!filtresTemp[colIndex]){

              filtresTemp[colIndex]=[];

            }





            if(checkbox.checked){


              if(!filtresTemp[colIndex]
              .includes(value)){


                filtresTemp[colIndex]
                .push(value);


              }


            }
            else{


              filtresTemp[colIndex]=
              filtresTemp[colIndex]
              .filter(v=>v!==value);



              if(filtresTemp[colIndex].length===0){

                delete filtresTemp[colIndex];

              }


            }




            const allChecked =
            [...menu.querySelectorAll(
              ".filter-option input"
            )]
            .every(cb=>cb.checked);



            selectAllCheckbox.checked =
            allChecked;



          });





          option.appendChild(
            checkbox
          );


          option.append(
            " "+(value || "(vide)")
          );



          menu.appendChild(option);



        });





        // Etat initial afficher tout


        const allCheckboxes =
        [...menu.querySelectorAll(
          ".filter-option input"
        )];



        const allChecked =
        allCheckboxes.every(
          cb=>cb.checked
        );



        const noneChecked =
        allCheckboxes.every(
          cb=>!cb.checked
        );



        selectAllCheckbox.checked =
        allChecked;



        selectAllCheckbox.indeterminate =
        !allChecked && !noneChecked;



                // ============================
        // RECHERCHE DANS LE MENU
        // ============================


        searchInput.addEventListener("input",()=>{


          const search =
          searchInput.value.toLowerCase();



          const options =
          menu.querySelectorAll(
            ".filter-option"
          );



          options.forEach(opt=>{


            const text =
            opt.textContent.toLowerCase();



            opt.style.display =
            text.includes(search)
            ? ""
            : "none";


          });


        });





        // ============================
        // BOUTONS OK / ANNULER
        // ============================


        const actions =
        document.createElement("div");


        actions.style.marginTop="10px";




        // OK

        const btnOk =
        document.createElement("button");


        btnOk.textContent="OK";



        btnOk.onclick=()=>{


          // supprimer filtre si tout est sélectionné

          Object.keys(filtresTemp)
          .forEach(col=>{


            const allValues =
            new Set();



            document
            .querySelectorAll(
              "#tableRapport tbody tr"
            )
            .forEach(row=>{


              allValues.add(
                row.children[col]
                .innerText.trim()
              );


            });



            if(
              filtresTemp[col].length
              === allValues.size
            ){

              delete filtresTemp[col];

            }


          });



          filtresActifs =
          filtresTemp;



          appliquerFiltres();



          menu.remove();


        };






        // ANNULER

        const btnCancel =
        document.createElement("button");



        btnCancel.textContent="Annuler";



        btnCancel.style.marginLeft="5px";



        btnCancel.onclick=()=>{


          menu.remove();


        };




        actions.appendChild(btnOk);

        actions.appendChild(btnCancel);



        menu.appendChild(actions);




        // insertion dans la page

        document.body.appendChild(menu);




        const rect =
        th.getBoundingClientRect();



        menu.style.top =
        rect.bottom + window.scrollY + "px";



        menu.style.left =
        rect.left + window.scrollX + "px";



        e.stopPropagation();


      });


    });





    // fermeture du menu

    document.addEventListener("click",()=>{


      document
      .querySelectorAll(".filter-menu")
      .forEach(m=>m.remove());


    });


  }






  // ================================
  // APPLICATION DES FILTRES
  // ================================


  function appliquerFiltres(){


    const rows =
    document.querySelectorAll(
      "#tableRapport tbody tr"
    );



    rows.forEach(row=>{


      let visible=true;



      for(const colIndex in filtresActifs){


        const filtres =
        filtresActifs[colIndex];



        if(
          !filtres ||
          filtres.length===0
        )
        continue;



        const cellValue =
        row.children[colIndex]
        .innerText.trim();




        const match =
        filtres.some(v=>

          String(v).trim().toLowerCase()
          ===
          String(cellValue)
          .trim()
          .toLowerCase()

        );



        if(!match){

          visible=false;
          break;

        }


      }



      row.style.display =
      visible ? "" : "none";


    });




    calculerTotaux();





    // ============================
    // INDICATEUR FILTRE ACTIF
    // ============================


    const headers =
    document.querySelectorAll(
      "#tableRapport thead th"
    );



    headers.forEach((th,index)=>{


      const allValues =
      new Set();



      document
      .querySelectorAll(
        "#tableRapport tbody tr"
      )
      .forEach(row=>{


        allValues.add(
          row.children[index]
          .innerText.trim()
        );


      });



      const filtres =
      filtresActifs[index];



      const isFiltered =
      filtres &&
      filtres.length>0 &&
      filtres.length<allValues.size;




      if(isFiltered){

        th.style.backgroundColor =
        "#d1e7ff";

        th.style.fontWeight =
        "bold";


      }
      else{


        th.style.backgroundColor =
        "";

        th.style.fontWeight =
        "";


      }


    });


  }






  // ================================
  // CALCUL DES TOTAUX
  // ================================


  function calculerTotaux(){


    const rows =
    document.querySelectorAll(
      "#tableRapport tbody tr"
    );



    let totalVolume=0;

    let totalLafarge=0;

    let totalCimbenin=0;

    let totalCHF=0;

    let totalEau=0;



    let totalAgre1=0;

    let totalAgre2=0;

    let totalAgre3=0;

    let totalAgre4=0;



    let totalAdit1=0;

    let totalAdit2=0;

    let totalAdit3=0;

    let totalAdit4=0;

    let totalAdit5=0;

    let totalAdit6=0;

    let totalAdit7=0;




    rows.forEach(row=>{


      if(row.style.display==="none")
      return;



      const cells=row.children;



      totalVolume += Number(cells[3].innerText || 0);


      totalLafarge += Number(cells[5].innerText || 0);

      totalCimbenin += Number(cells[6].innerText || 0);

      totalCHF += Number(cells[7].innerText || 0);



      totalAgre1 += Number(cells[8].innerText || 0);

      totalAgre2 += Number(cells[9].innerText || 0);

      totalAgre3 += Number(cells[10].innerText || 0);

      totalAgre4 += Number(cells[11].innerText || 0);



      totalEau += Number(cells[12].innerText || 0);



      totalAdit1 += Number(cells[13].innerText || 0);

      totalAdit2 += Number(cells[14].innerText || 0);

      totalAdit3 += Number(cells[15].innerText || 0);

      totalAdit4 += Number(cells[16].innerText || 0);

      totalAdit5 += Number(cells[17].innerText || 0);

      totalAdit6 += Number(cells[18].innerText || 0);

      totalAdit7 += Number(cells[19].innerText || 0);


    });





    document.getElementById("totalVolume").textContent=totalVolume;

    document.getElementById("totalLafarge").textContent=totalLafarge;

    document.getElementById("totalCimbenin").textContent=totalCimbenin;

    document.getElementById("totalCHF").textContent=totalCHF;


    document.getElementById("totalAgre1").textContent=totalAgre1;

    document.getElementById("totalAgre2").textContent=totalAgre2;

    document.getElementById("totalAgre3").textContent=totalAgre3;

    document.getElementById("totalAgre4").textContent=totalAgre4;


    document.getElementById("totalEau").textContent=totalEau;


    document.getElementById("totalAdit1").textContent=totalAdit1;

    document.getElementById("totalAdit2").textContent=totalAdit2;

    document.getElementById("totalAdit3").textContent=totalAdit3;

    document.getElementById("totalAdit4").textContent=totalAdit4;

    document.getElementById("totalAdit5").textContent=totalAdit5;

    document.getElementById("totalAdit6").textContent=totalAdit6;

    document.getElementById("totalAdit7").textContent=totalAdit7;


  }



});





// ================================
// SUPPRESSION
// ================================


async function supprimer(id){


  const confirmation =
  confirm("Supprimer cette ligne ?");



  if(!confirmation)
  return;



  await fetch(
    "/api/rapport?id="+id,
    {
      method:"DELETE"
    }
  );



  location.reload();


}