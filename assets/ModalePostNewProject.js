import { displayWorksModale } from "./ModaleDeleteProject.js";
import { displayWorks, getCategory } from "./script.js";

//Variable globale qui sert à savoir si une image a été sélectionnée par l'utilisateur
let pictureSelected=false

//______________________________NOUVEAU PROJET : FONCTION POUR PREVISUALISATION PHOTO_____________________________________________________

function previewPhoto(e) {
    //Récupération du bouton input files
    const input = e.target;
    console.log("Input "+input);
    console.log("imput.files "+input.files);
    console.log("input.files[0] "+input.files[0]);
    console.log("input.files[0].name "+input.files[0].name);

    //Récupération de la balise img :
    const photo = document.getElementById("previewPhoto");

    //Condition d'affichage de l'image sélectionnée :
    if (input.files && input.files[0]) {    //affiche uniquement l'élément sélectionné et validé par l'utilisateur
        //pictureSelected=true
        
        const reader = new FileReader();
        reader.onload = function (e) {
            controlForm();
            photo.src = e.target.result;    //chemin de l'image sélectionnée
        }
        reader.readAsDataURL(input.files[0]);
    };

    //Remplacement du contenu de la div choix photo par la prévisualisation de l'image sélectionnée :
    let previewImage = document.querySelector(".choosePhoto");
    let boxAddPhoto = document.querySelector(".box_add_photo");
    if (previewPhoto) {
        previewImage.classList.remove("hidden");
        boxAddPhoto.classList.add("hidden");
        controlForm("PICTURE")
    }
    
    //Au clic sur l'image prévisualisée, retour à la fenêtre de téléchargement pour changer l'image :
    photo.addEventListener("click", function () {
        //pictureSelected=false
        console.log("clic miniature photo");
        boxAddPhoto.classList.remove("hidden");
        previewImage.classList.add("hidden");
        photo.src = null;
        console.log("source miniature = " + photo.src);
        input.value = null;
        console.log("input value" + input.value);

        controlForm("PICTURE")
    
        //image.files.delete;
        //image.files.remove;
        //image.files[0].reset;
        //reader.readAsDataURL(input.files[0]).delete;
        //image.files= null;

        console.log("source photo = " + photo.src)
        //image.files.value = "";
        console.log("input file = " + input.files);
    });
}

//Récupération de l'élément input : cible de l'événement "change"
document.getElementById("add_photo_input").addEventListener("change", previewPhoto);

//__________________________AJOUT DES OPTIONS SELECT_________________________________________________

async function selectOptionCateg() {
    //constante pour stocker le tableau d'objets correspondant aux catégories récupérées dans l'API
    const category = await getCategory();
    console.log(category);
    //Création des options sur l'élément <select>:
    const select = document.getElementById("select_categ");
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
    const imageFile = document.getElementById("add_photo_input");
    const titleInput = document.getElementById("title");
    const categorySelect = document.getElementById("select_categ");
    let token = localStorage.getItem("token");

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
        //document.location.href = "index.html";    //Redirection vers la page d'accueil
        formData.innerHTML = "";
    } else {
        console.log("erreur dans l'ajout du projet");
    }
};

//_________________________Ajout d'un EVENTLISTENER sur bouton VALIDER__________________________________________________

const ButtonValidNewProject = document.getElementById("valid_add_photo");
console.log(ButtonValidNewProject);
ButtonValidNewProject.addEventListener("click", (event) => {
    // Désactivation du comportement par défaut du formulaire
    event.preventDefault();
    console.log("clic valider");

    //si tous les champs attendus sont renseignés alors on enregistre le projet et on vide le formulaire
    if (controlForm()) {
        event.preventDefault();
        console.log("Controles ok, appel de POST NEW PROJECT"); 
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
    console.log("Entrée dans control form")

    //Si le champ est vide, on retourne la variable "fieldsControl" à false
    
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
        console.log("fileControl : Photo ok")
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
    const validButton = document.getElementById("valid_add_photo");
    if (fieldsControl) {
        console.log("Control categ et Control Titre OK -- Affiche bouton valid");        
        validButton.classList.add("button");
        validButton.classList.remove("valid_add_photo");
    }
    else {
        console.log("Control categ KO ou Control titre KO -- Masque bouton valid");        
        validButton.classList.remove("button");
        validButton.classList.add("valid_add_photo");
    }
    console.log("Valeur retournée par controlForm : "+fieldsControl)
    return fieldsControl;
}

//________________________________________Reset du Formulaire_______________________________________________________

export function cleanForm () {
    const previewImage = document.querySelector(".choosePhoto");
    const boxAddPhoto = document.querySelector(".box_add_photo");
    const photo = document.getElementById("previewPhoto");
    const missImage = document.getElementById("missImage");
    const title = document.getElementById("title");
    const missTitle = document.getElementById("missTitle");
    const category = document.getElementById("select_categ");
    const missCategory = document.getElementById("missCategory");

    //reset de l'image
    missImage.classList.add("hidden");
   // pictureSelected=false
    boxAddPhoto.classList.remove("hidden");
    previewImage.classList.add("hidden");
    photo.src = "";
    //input.files[0].value = null;
    
    //reset du titre
    title.value = "";
    missTitle.classList.add("hidden");

    //reset de la catégorie
    category.value=-1;
    missCategory.classList.add("hidden");
}

//_____________________Fonction qui controle si le champ titre est renseigné (renvoie true) ou pas (renvoie false)________

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


function fileControl() {
    const file = document.getElementById("add_photo_input");
    console.log("file saisi" + !!file.value);
    return !!file.value;
}

//_______________________Fonction qui controle si le champ Catégorie est renseigné (renvoie true) ou pas (renvoie false)

function categControl() {
    const category = document.getElementById("select_categ");
    //Si le champ est vide
    if (category.value != -1) {
        return true;
    }
    else {
        return false;
    }
}

//_______________________________Contrôle des champs "titre" et "catégorie" du formulaire_______________________________________________

const title = document.getElementById("title");
title.addEventListener("change",()=>{
    controlForm("TITLE")
});

const categ = document.getElementById("select_categ");
categ.addEventListener("change",()=>{
    controlForm("CATEGORY")
});

//_____________________Fonction qui controle si l'image est renseignée (renvoie true) ou pas (renvoie false)___________

function pictureControl() {
    //console.log("pictureSelected "+pictureSelected)   
    //return pictureSelected;
    return fileControl();

    //controlForm("FILE");
}