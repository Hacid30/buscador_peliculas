//seleccionamos elementos del DOM
const busqueda = document.getElementById("busqueda");
const btnBuscar = document.getElementById("btn-buscar");
const modelContent = document.getElementById("model-content");
const btnFavorito = document.getElementById("btn-favorito");
const btnAnt = document.getElementById("btn-ant");
const pageInfo = document.getElementById("page-info");
const btnSig = document.getElementById("btn-sig");

//API
const API_KEY = "77b3fa1deb3ae9a938d62c6ae7710757";
const BASE_URL = "https://api.themoviedb.org/3";

//variables
let paginaActual = 1;
let totalPaginas = 1;
let consulta = "";
let favoritos = JSON.parse(localStorage.getItem("favoritos")) || [];

// Evento para el boton buscar
btnBuscar.addEventListener("click", () => {
    consulta = busqueda.value.trim();
    if (consulta) {
        paginaActual = 1;
        buscarPelis(consulta, paginaActual);
    }
});

// boton atras
btnAnt.addEventListener("click", () => {
    if(paginaActual > 1){
        paginaActual--;
        buscarPelis(consulta, paginaActual);
    }
});

// boton siguiente
btnSig.addEventListener("click", () => {
    if (paginaActual < totalPaginas){
        paginaActual++;
        buscarPelis(consulta, paginaActual);
    }
});

// Boton favotiro
btnFavorito.addEventListener("click", mostrarFav);

// Buscar peliculas
async function buscarPelis(consul, pag){
    try {
        const respuesta = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${consul}&page=${pag}`
        );
        const data = await respuesta.json();
        console.log(data);
        totalPaginas = data.total_pages;
        peliculasActuales = data.results;
        mostrarPeliculas(peliculasActuales);
        actualizarPaginacion();
    } catch (error) {
        console.error("Error al encontrar la pelicula: ", error);
        modelContent.innerHTML = "<p>No se encuentran las peliculas, intentelo de nuevo</p>"
    }
}

// Mostrar peliculas
function mostrarPeliculas(peli){
    modelContent.innerHTML = "";
    if(peli.length === 0){
        modelContent.innerHTML = "<p> No se encontro ninguna pelicula </p>";
        return;
    }
    console.log(peli);
    peli.forEach(pelis => {
        const tartejaPeli = document.createElement("div");
        tartejaPeli.className = "movie-card";

        console.log(favoritos);
        const losFavoritos = favoritos.some(fav => fav.id === pelis.id);

        tartejaPeli.innerHTML = 
        `<img src="https://image.tmdb.org/t/p/w500${pelis.poster_path}" alt="${pelis.title}">
        <div class = "movie-info">
        <h3> ${pelis.title} <h3>
        <p> ${pelis.release_date ? pelis.release_date.split("-")[0] : "N/A"} </p>
        <button class= "favorite-btn" data-id="${pelis.id}">
        ${losFavoritos ? "❤️ Quitar de Favoritos" : "🤍 Añadir a Favoritos"}
        </button>
        </div>
        `
        ;

        modelContent.appendChild(tartejaPeli);
    });

    document.querySelectorAll(".favorite-btn").forEach(
        btn => { btn.addEventListener("click", () => alternarFavotiros(btn.dataset.id));}
    );
}


//funcion para alternar favoritos
function alternarFavotiros(peliId){
    const pelicula = peliculasActuales.find(m => m.id == peliId);
    const index = favoritos.findIndex(fav => fav.id == peliId);

    if(index === -1){
        favoritos.push(pelicula);
    } else {
        favoritos.splice(index, 1);
    }

    localStorage.setItem("favoritos", JSON.stringify(favoritos));
    if(consulta){
        buscarPelis(consulta, paginaActual);
    }else{
        mostrarFav();
    }
}

// Mostrar favoritos
function mostrarFav(){
    if(favoritos.length === 0){
        modelContent.textContent = "No tienes películas favoritas aún.";
    } else {
        mostrarPeliculas(favoritos);
    }
    consulta = "";
    pageInfo.textContent = "Favoritos";
}

// Actualizar paginacion 
function actualizarPaginacion(){
    pageInfo.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    btnAnt.disabled == 1;
    btnSig.disabled == totalPaginas;
}

//inicializaciamos la funcion 
actualizarPaginacion();
