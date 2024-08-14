import { displayWorksModale } from "./ModaleDeleteProject.js";
import { displayWorks, getCategory } from "./script.js";

//Variable globale qui sert à savoir si une image a été sélectionnée par l'utilisateur
//let pictureSelected=false

//______________________________NOUVEAU PROJET : FONCTION POUR PREVISUALISATION PHOTO_____________________________________________________

function previewPhoto(e) {
    //Récupération du bouton input files
    const input = e.target;
    console.log(input.files[0]);

    //Récupération de la balise img :
    const photo = document.getElementById("previewPhoto");

    //Condition d'affichage de l'image sélectionnée :
    if (input.files && input.files[0]) {    //affiche uniquement l'élément sélectionné et validé par l'utilisateur
        
        const reader = new FileReader();
        reader.onload = function (e) {
            controlForm();
            photo.src = e.target.result;    //chemin de l'image sélectionnée
        }
        reader.readAsDataURL(input.files[0]);
    };

    //Remplacement du contenu de la div choix photo par la prévisualisation de l'image sélectionnée :
    let previewImage = document.querySelector(".smallPhoto");
    let boxAddPhoto = document.querySelector(".choosePhoto");
    if (previewPhoto) {
        previewImage.classList.remove("hidden");
        boxAddPhoto.classList.add("hidden");
        controlForm("PICTURE")
    }
    
    //Au clic sur l'image prévisualisée :  
    photo.addEventListener("click", function () {

        // retour à la fenêtre de téléchargement pour changer l'image 
        boxAddPhoto.classList.remove("hidden");
        previewImage.classList.add("hidden");

        // Reset de l'image précédemment sélectionnée
        photo.src = null;
        console.log("source miniature = " + photo.src);
        input.value = null;
        console.log(input.value);

        // Appel de la fonction de contrôle des champs du formulaire
        controlForm("PICTURE")
    });
}

//Récupération de l'élément input : cible de l'événement "change"
document.getElementById("addPhotoInput").addEventListener("change", previewPhoto);

//__________________________AJOUT DES OPTIONS SELECT_________________________________________________

async function selectOptionCateg() {
    //constante pour stocker le tableau d'objets correspondant aux catégories récupérées dans l'API
    const category = await getCategory();
    //Création des options sur l'élément <select>:
    const select = document.getElementById("selectCateg");
    const firstOption = new Option("", -1);
    select.add(firstOption);
    for (let i = 0; i < category.length; i++) {
        const option = new Option(category[i].name, category[i].id);
        select.add(option);
    }
}
selectOptionCateg();

//__________________________FONCTION pour poster un nouveau projet vers l'API __________________________

async function postNewProject() {
    const imageFile = document.getElementById("addPhotoInput");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("selectCateg");
    let token = localStorage.getItem("token");
    const modaleAdd = document.querySelector(".modaleAdd");

    //----construction objet qui reprend les valeurs des balises du formulaire :
    const formData = new FormData();
    formData.append("image", imageFile.files[0]);
    formData.append("title", titleInput.value);
    formData.append("category", categorySelect.value);

    //------Envoi des informations à l'API----------------

    const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: "Bearer " + token
        },
        body: formData
    });
    if (response.ok) {
        console.log("projet ajouté");
        displayWorks(-1);        //Rafraichissement des travaux dans index.html
        displayWorksModale()     //Rafraichissement des travaux dans la modale
        formData.innerHTML = ""; //Reset du formulaire
        modaleAdd.classList.add("hidden"); //retour sur la page d'accueil
    } else {
        console.log("erreur dans l'ajout du projet");
    }
};

//_________________________Ajout d'un EVENTLISTENER sur bouton VALIDER__________________________________________________

const ButtonValidNewProject = document.getElementById("validAddPhoto");
ButtonValidNewProject.addEventListener("click", (event) => {
    // Désactivation du comportement par défaut du formulaire
    event.preventDefault();

    //si tous les champs attendus sont renseignés alors on appelle la fonction PostNewProject et on vide le formulaire
    if (controlForm()) {
        event.preventDefault();
        postNewProject();
        cleanForm();
    }
    else {
        console.log("Controles KO, pas d'appel de POST NEW PROJECT")
    }
});

//_____________________________Controle Formulaire _____________________________________________________________________

function controlForm (controlType="ALL") {
    const missImage = document.getElementById("missImage");
    const missTitle = document.getElementById("missTitle");
    const missCategory = document.getElementById("missCategory");
    
    let fieldsControl = true;
    console.log("Entrée dans la fonction controlForm")

    //Si le champ est vide, on retourne la variable "fieldsControl" à false :
    
    if (!fileControl()) {
        console.log("fileControle : Photo manquante")
        fieldsControl = false
        if (controlType=="ALL" || controlType=="PICTURE") {
            missImage.textContent = 'Photo manquante';
            missImage.style.color = 'red';
            missImage.classList.remove("hidden");
        }
    }
    else {
        missImage.classList.add("hidden");
    }

    if (!titleControl()) {
        fieldsControl = false
        if (controlType=="ALL" || controlType=="TITLE") {
            missTitle.textContent = "Titre manquant";
            missTitle.style.color = "red";
            missTitle.classList.remove("hidden");
        }
    }
    else {
        missTitle.classList.add("hidden");
    }

    if (!categControl()) {
        fieldsControl = false
        if (controlType=="ALL" || controlType=="CATEGORY") {
            missCategory.textContent = "Catégorie manquante";
            missCategory.style.color = "red";
            missCategory.classList.remove("hidden");
        }
    }
    else {
        missCategory.classList.add("hidden");
    }

    //Si tous les champs sont renseignés alors on affiche le bouton de validation
    
    const validButton = document.getElementById("validAddPhoto");
    if (fieldsControl) {       
        validButton.classList.add("button");
        validButton.classList.remove("validAddPhoto");
    }
    else {      
        validButton.classList.remove("button");
        validButton.classList.add("validAddPhoto");
    }
    console.log("Valeur retournée par controlForm : "+fieldsControl)
    return fieldsControl;
}

//_____________________Fonctions de contrôle de saisie des champs (renvoie "true" ou "false")______________________________

// Contrôle champs INPUT FILE :
function fileControl() {
    const file = document.getElementById("addPhotoInput");
    console.log("Valeur FileControl = " + !!file.value);
    return !!file.value;
}

// Contrôle champs TITRE :
function titleControl() {
    const title = document.getElementById("title");
    if (!title.validity.valueMissing) {
        console.log("Titre saisi")
        return true;
    }
    else {
        return false;
    }
}

// Contrôle champs CATEGORIE :
function categControl() {
    const category = document.getElementById("selectCateg");
    //Si le champ est vide
    if (category.value != -1) {
        return true;
    }
    else {
        return false;
    }
}

//________________AddEventListeners sur les champs "titre" et "catégorie" pour appeler la fonction de contrôle du formulaire_______________________________________________

const title = document.getElementById("title");
title.addEventListener("change",()=>{
    controlForm("TITLE")
});

const categ = document.getElementById("selectCateg");
categ.addEventListener("change",()=>{
    controlForm("CATEGORY")
});

//________________________________________Reset du Formulaire_______________________________________________________

export function cleanForm () {
    const previewImage = document.querySelector(".smallPhoto");
    const boxAddPhoto = document.querySelector(".choosePhoto");
    const photo = document.getElementById("previewPhoto");
    const missImage = document.getElementById("missImage");
    const title = document.getElementById("title");
    const missTitle = document.getElementById("missTitle");
    const category = document.getElementById("selectCateg");
    const missCategory = document.getElementById("missCategory");

    //reset de l'image
    missImage.classList.add("hidden");
    boxAddPhoto.classList.remove("hidden");
    previewImage.classList.add("hidden");
    photo.src = "";
    
    //reset du titre
    title.value = "";
    missTitle.classList.add("hidden");

    //reset de la catégorie
    category.value=-1;
    missCategory.classList.add("hidden");
}