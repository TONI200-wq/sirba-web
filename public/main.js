document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("mainLoginForm");
  const message = document.getElementById("mainMessage");

  const industryChoice = document.getElementById("industryChoice");
  const djeregbeBtn = document.getElementById("djeregbeBtn");
  const gdizBtn = document.getElementById("gdizBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const id = document.getElementById("mainId").value.trim();
    const pwd = document.getElementById("mainPassword").value.trim();

    if (id === "chef" && pwd === "1234") {
      message.style.color = "green";
      message.textContent = "Accès administrateur autorisé";

      // Cacher le formulaire
      form.style.display = "none";

      // Afficher les boutons d'industrie
      industryChoice.style.display = "flex";
      industryChoice.style.flexDirection = "column";
      industryChoice.style.gap = "15px";

    } else {
      message.style.color = "red";
      message.textContent = "Accès refusé";
      form.reset();
    }
  });

  // 👉 INDUSTRIE DJEREGBE
  djeregbeBtn.addEventListener("click", () => {
    window.location.href = "centrale.html";
  });

  // 👉 INDUSTRIE ZONE GDIZ
  gdizBtn.addEventListener("click", () => {
    alert("INDUSTRIE ZONE GDIZ : Pas encore disponible");
  });
});
