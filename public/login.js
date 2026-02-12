document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("loginBtn");
  const message = document.getElementById("message");

  if (!btn) {
    console.error("Bouton loginBtn introuvable");
    return;
  }

  btn.addEventListener("click", () => {
    const identifiant = document.getElementById("identifiant").value.trim();
    const motdepasse = document.getElementById("motdepasse").value.trim();

    // Centrale 1
    if (identifiant === "djeregbe.centrale" && motdepasse === "CI-102") {
      message.style.color = "green";
      message.textContent = "Connexion Centrale 1 réussie";
      window.location.href = "centrale.html";
    }

    // Centrale 2
    else if (identifiant === "centre2" && motdepasse === "1234") {
      message.style.color = "green";
      message.textContent = "Connexion Centrale 2 réussie";
    }

    // Erreur
    else {
      message.style.color = "red";
      message.textContent = "Identifiant ou mot de passe incorrect";
    }
  });
});
