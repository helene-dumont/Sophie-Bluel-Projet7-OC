import { getWorks, displayWorks } from "./script.js";
import { cleanForm } from "./ModalePostNewProject.js";

//__________________________________FONCTION pour FERMER LA MODALE _________________________________________

function close() {   

    const closeModaleMain = document.getElementById("closeModaleMain");
    const closeModaleAdd = document.getElementById("closeModaleAdd");
    const modaleMain = document.querySelector(".modaleMain");
    const modaleAdd = document.querySelector(".modaleAdd");

    //-----------------Fermeture au clic sur la croix modale :
    
    closeModaleMain.addEventListener("click", function () {
        modaleMain.classList.add("hidden");
    })
    closeModaleAdd.addEventListener("click", function () {
        modaleAdd.classList.add("hidden");
        cleanForm(); //Reset du formulaire
    })
    
    //-----------------Fermeture au clic en dehors des modales :
    
    modaleMain.addEventListener('click', function (event) {
        const inside = event.target.closest('.modaleContent');
        if (!inside) {
            modaleMain.classList.add('hidden')
        }
    })
    modaleAdd.addEventListener('click', function(event) {
        const inside = event.target.closest('.modaleContent');
        if (!inside) {
            modaleAdd.classList.add('hidden');
            cleanForm(); // Reset du formulaire
        }
    })
    
    //----------------Au clic sur la flèche modale 2 = retour sur la modale 1 :
    const arrowBackModaleMain = document.querySelector(".fa-arrow-left");
    
    arrowBackModaleMain.addEventListener("click", function () {
        modaleMain.classList.remove("hidden");
        modaleAdd.classList.add("hidden");
        cleanForm(); // Reset du formulaire
    })
}
close();

//______________________________FONCTION QUI AFFICHE LES ELEMENTS WORKS DANS LA MODALE_________________________________________

export async function displayWorksModale() {
    //constante pour stocker le tableau d'objets correspondant aux projets récupérés dans l'API
    let works = await getWorks();
    document.querySelector(".galleryModale").innerHTML = "";

    //boucle pour gérer l'affichage des projets dans la modale
    for (let i = 0; i < works.length; i++) {
        
        //Images :
        const galleryModaleElement = document.querySelector(".galleryModale");
        const projectElement = document.createElement("figure");
        galleryModaleElement.appendChild(projectElement);
        const imageElement = document.createElement("img");
        imageElement.src = works[i].imageUrl;
        imageElement.alt = (works[i].title);
        projectElement.appendChild(imageElement);
        
        //Icones poubelle :
        const trashElement = document.createElement("i");
        trashElement.classList.add("fa-solid");
        trashElement.classList.add("fa-trash-can");
        trashElement.addEventListener("click", function () {
            console.log("clic trash" + trashElement.id);
            const confirmation = confirm("Etes-vous sûr de vouloir supprimer ce projet?");
            //Si confirmation utilisateur : appel à la fonction de suppression de projets :
            if (confirmation) {
                deleteWork(trashElement); // Appel de la fonction de suppression d'un projet
            }
        })
        console.log("works[i].id = " + works[i].id);
        //liaison id_icone - id_projet :
        trashElement.id = (works[i].id);
        projectElement.appendChild(trashElement);
    }
}
displayWorksModale();

//____________________________Event Listener sur le bouton "Ajouter une photo" :

const addPhotoButton = document.getElementById("addPhoto");
addPhotoButton.addEventListener("click", function () {
const modaleMain = document.querySelector(".modaleMain");
const modaleAdd = document.querySelector(".modaleAdd");

    modaleMain.classList.add("hidden");
    modaleAdd.classList.remove("hidden");
})


//______________________________FONCTION POUR SUPPRIMER PROJETS______________________________________________________

async function deleteWork(element) {
    let idWork = element.id;
    let token = localStorage.getItem("token");

    //Appel à l'API pour supprimer un projet :
    await fetch("http://localhost:5678/api/works/" + idWork, {
        method: "DELETE",
        headers: {
            Accept: "*/*",
            Authorization: "Bearer " + token,
        },
    }).then((response) => {
        //Si token OK : 
        if (
            response.status === 200 ||
            response.status === 201 ||
            response.status === 204
        ) {
            console.log("suppression ok");
            element.parentElement.remove();
            displayWorks(-1);        //Rafraichissement des travaux dans index.html
            displayWorksModale()     //Rafraichissement des travaux dans la modale
            alert("Le projet a bien été supprimé.")
        } else {
            //Si token nul :
            if (response.status === 401) {
                console.error("Unauthorized. Check the validity of your token.");
            } else {
                //Autre cas d'erreur :
                console.error("Failed to delete work with ID ${id}. Status : ${response.status}");
            }
            alert("Erreur lors de la suppression du projet.")
        }
    });
}
