import {logIn} from "./logIn.js";

//---------------------Création d'une fonction qui récupère les projets depuis l'API-----------------------------------
async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const projects = await response.json();
    return projects;
}

//---------------------Création d'une fonction qui affiche les éléments works---------------------------------------------
async function displayWorks(idCategory) {
    //constante pour stocker le tableau d'objets correspondant aux projets récupérés dans l'API
    let works = await getWorks();
    //condition pour la mise en oeuvre du filtrage des catégories à partir de l'idCategory
    if (idCategory != -1) {
        works = works.filter((work) => work.categoryId == idCategory);
    }
    console.log(works);
    document.querySelector(".gallery").innerHTML = "";

    //boucle pour créer les éléments liés à l'affichage de tous les projets au chargement de la page
    for (let i = 0; i < works.length; i++) {
        const galleryElement = document.querySelector(".gallery");
        const projectElement = document.createElement("figure");
        galleryElement.appendChild(projectElement);
        const imageElement = document.createElement("img");
        imageElement.src = works[i].imageUrl;
        imageElement.alt = (works[i].title);
        projectElement.appendChild(imageElement);
        const titleElement = document.createElement("figcaption");
        titleElement.innerHTML = works[i].title;
        projectElement.appendChild(titleElement);
        //console.log("Catég:" + works[i].categoryId)
    }
}

displayWorks(-1);


//__________________________________AJOUT DES BOUTONS FILTRES ET DES EVENT LISTENERS______________________________________________________

//-------------------CREATION DE LA FONCTION "display_buttons" QUI GERE L'AFFICHAGE DES 4 BOUTONS----------------------------

function display_buttons(ind_button) {
    let buttons = document.querySelectorAll(".filter");
    console.log("exec function" + ind_button);
    for (i = 0; i < buttons.length; i++) {
        if (i == ind_button) {
            buttons[i].classList.add("filter_selected");
        } else {
            buttons[i].classList.remove("filter_selected");
        }
    }
}

//--------------------CREATION DE LA FONCTION "getCategory" pour récupérer les catégories depuis l'API--------------------------------------
async function getCategory() {
    const response = await fetch("http://localhost:5678/api/categories");
    const worksCategory = await response.json();
    return worksCategory;
}

//----------------------CREATION DE LA FONCTION "displayCategory" qui affiche les projets par catégorie------------------------------------
async function displayCategory() {
    //constante pour stocker le tableau d'objets correspondant aux catégories récupérées dans l'API
    const category = await getCategory();
    console.log(category);
    //Ajout de l'objet "tous" en première ligne du tableau des catégories
    const o = { id: -1, name: "Tous" };
    category.unshift(o);
    console.log(category);
    //Création des boutons filtres avec leur eventListener dans la div "filters"
    const filters = document.querySelector(".filters");
    for (let i = 0; i < category.length; i++) {
        const button = document.createElement("button");
        button.classList.add("filter");
        button.id = "filter-" + i;
        button.innerHTML = category[i].name;
        filters.appendChild(button);
        button.addEventListener("click", function () {
            displayWorks(category[i].id);  //Filtrage des travaux par catégories
            display_buttons(i);  //apparence boutons
        })
    }
}
displayCategory();

//--------------Ajout d'un EVENTLISTENER sur bouton SE CONNECTER :
const formulaireIdent = document.querySelector("form");
formulaireIdent.addEventListener("submit", async function (event) {
    // Désactivation du comportement par défaut du navigateur
    event.preventDefault();
    console.log("pas de rechargement de la page");
    logIn();
});
