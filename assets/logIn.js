//__________________________FONCTION LOG IN pour SE CONNECTER______________________________

async function logIn() {
    const formLogIn = document.querySelector("form");
    //----construction objet qui reprend les valeurs des balises du formulaire :
    const champsForm = {
        email: formLogIn.querySelector("[name=email]").value,
        password: formLogIn.querySelector("[name=password]").value,
    };
    console.log("champs du formulaire : " + champsForm);

    //----Valeur de la charge Utile : conversion en JSON -------
    const champsFormJson = JSON.stringify(champsForm);

    //------Envoi des informations à l'API----------------
    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: champsFormJson,
    })
    const connexionAPI = await response.json();

    //--------Stockage du token dans le LocalStorage--------------------
    const token = connexionAPI.token;
    window.localStorage.setItem("token", token);
    localStorage.getItem("token");
    console.log("token :" + localStorage.getItem("token"));
    
    if (
        response.status === 200 ||
        response.status === 201 ||
        response.status === 204
    ) {
        document.location.href = "index.html";    //Redirection vers la page d'accueil
    } else {
        let error = document.getElementById("error");
        error.textContent = "Erreur dans l'identifiant ou le mot de passe";
    }
}

//_________________________Ajout d'un EVENTLISTENER sur bouton SE CONNECTER_________________________________

const formLogIn = document.querySelector("form");
formLogIn.addEventListener("submit", async function (event) {
    // Désactivation du comportement par défaut du navigateur
    event.preventDefault();
    console.log("pas de rechargement de la page");
    logIn();
});

