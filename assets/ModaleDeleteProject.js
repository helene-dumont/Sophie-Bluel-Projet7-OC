import { getWorks, displayWorks } from "./script.js";
import { cleanForm } from "./ModalePostNewProject.js";

//__________________________________FONCTION pour FERMER LA MODALE _________________________________________

function close() {   
    
    //-----------------Fermeture au clic sur la croix modale :
    const modale_close1 = document.getElementById("close1");
    const modale_close2 = document.getElementById("close2");
    
    modale_close1.addEventListener("click", function () {
        console.log("clic close1");
        modale1.classList.add("hidden");
    })
    modale_close2.addEventListener("click", function () {
        console.log("clic close2");
        modale2.classList.add("hidden");
        cleanForm();
    })
    
    //-----------------Fermeture au clic en dehors de la modale :
    const modale1 = document.querySelector(".modale_delete_project");
    const modale2 = document.querySelector(".modale_add_project");
    
    modale1.addEventListener('click', function (event) {
        const inside = event.target.closest('.modale_content');
        if (!inside) {
            modale1.classList.add('hidden')
        }
    })
    modale2.addEventListener('click', function(event) {
        const inside = event.target.closest('.modale_content');
        if (!inside) {
            modale2.classList.add('hidden')
        }
    })
    
    //----------------Au clic sur la flèche modale 2 = retour sur la modale 1 :
    const backModale1 = document.querySelector(".fa-arrow-left");
    
    backModale1.addEventListener("click", function () {
        console.log("clic backModale1");
        modale1.classList.remove("hidden");
        modale2.classList.add("hidden");
        cleanForm();
    })
}
close();

//______________________________FONCTION QUI AFFICHE LES ELEMENTS WORKS DANS LA MODALE_________________________________________

export async function displayWorksModale() {
    //constante pour stocker le tableau d'objets correspondant aux projets récupérés dans l'API
    let works = await getWorks();
    console.log(works);

    document.querySelector(".gallery_modale").innerHTML = "";

    //boucle pour gérer l'affichage des projets dans la modale
    for (let i = 0; i < works.length; i++) {
        //Images :
        const galleryModaleElement = document.querySelector(".gallery_modale");
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
                deleteWork(trashElement);
            }
        })
        console.log(works[i].id);
        //liaison icone-projet :
        trashElement.id = (works[i].id);
        projectElement.appendChild(trashElement);
    }
}
displayWorksModale();

//____________________________Event Listener sur le bouton "Ajouter une photo" :

const add_photo_button = document.getElementById("add_photo");
let modale_delete_project = document.querySelector(".modale_delete_project");
let modale_add_project = document.querySelector(".modale_add_project");
add_photo_button.addEventListener("click", function () {
    console.log("clic bouton Ajouter une photo modale 1");
    modale_delete_project.classList.add("hidden");
    modale_add_project.classList.remove("hidden");
})


//______________________________FONCTION POUR SUPPRIMER PROJETS______________________________________________________

async function deleteWork(element) {
    let idWork = element.id;
    let token = localStorage.getItem("token");
    console.log("token modale avant supp projet:" + token);
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
            //Si token ine :
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
