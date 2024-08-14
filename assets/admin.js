//___________________AFFICHAGE DES ELEMENTS ADMIN SI UTILISATEUR CONNECTE ___________________________________ 

function handleAdminElement() {
    const token = localStorage.getItem("token");
    console.log("token :" + localStorage.getItem("token"));
    const LogOut = document.getElementById("adminLogoLogOut");
    const adminElement = document.querySelectorAll(".admin");

    if (token != null) {
        console.log("token OK");
        //Pour chaque élément masqué qui contient la classe "admin", on enlève la classe "hidden" :
        adminElement.forEach((element) => {
            if (element.classList.contains("hidden")) {
                element.classList.remove("hidden");
            }
            else {
                element.classList.add("hidden");
            }
        })
    }
    else {
        console.log("token KO");
    }
    //______________________Ajout d'un EVENTLISTENER sur le bouton SE DECONNECTER ____________________________________

    LogOut.addEventListener("click", function () {
        window.localStorage.removeItem("token");
        console.log("token : "+ localStorage.getItem("token"));
    })
};

handleAdminElement();
