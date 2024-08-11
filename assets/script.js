//_____________________________FONCTION QUI RECUPERE LES PROJETS DEPUIS L'API__________________________________________

export async function getWorks() {
    const response = await fetch("http://localhost:5678/api/works");
    const projects = await response.json();
    return projects;
}

//_______________________________FONCTION QUI AFFICHE LES ELEMENTS WORKS___________________________________________

export async function displayWorks(idCategory) {
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

//__________________________________FILTRAGE PAR CATEGORIES______________________________________________________

//-------------------FONCTION "display_buttons" QUI GERE L'AFFICHAGE DES 4 BOUTONS----------------------------

function display_buttons(ind_button) {
    let buttons = document.querySelectorAll(".filter");
    console.log("exec function" + ind_button);
    let i = 0;
    for (i = 0; i < buttons.length; i++) {
        if (i == ind_button) {
            buttons[i].classList.add("filter_selected");
        } else {
            buttons[i].classList.remove("filter_selected");
        }
    }
}

//--------------------FONCTION "getCategory" pour RECUPERER LES CATEGORIES depuis l'API--------------------------------------
export async function getCategory() {
    const response = await fetch("http://localhost:5678/api/categories");
    const worksCategory = await response.json();
    return worksCategory;
}

//----------------------FONCTION "displayCategory" QUI GERE L'AFFICHAGE DES PROJETS PAR CATEGORIE------------------------------------
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

//_____________________Ajout d'un EVENTLISTENER sur le bouton "modifier" (ouverture de la modale)______________________________

function modifProject() {
    const modifPortfolio = document.querySelector(".modifPortfolio");
    let modale_delete_project = document.querySelector(".modale_delete_project");
    modifPortfolio.addEventListener("click", function () {
        console.log("clic modifier");
        modale_delete_project.classList.remove("hidden");
    })
}
modifProject();



