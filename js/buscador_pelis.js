//Seleccionar los elementos del DOM
const searchInput = document.getElementById("busqueda");
const searchBtn = document.getElementById("btn-buscar");
const favoritesBtn = document.getElementById("btn-favorito");
const resultsContainer = document.getElementById("model-content");
const prevBtn = document.getElementById("btn-ant");
const pageInfo = document.getElementById("page-info");
const nextBtn = document.getElementById("btn-sig");

//API
const API_KEY = "77b3fa1deb3ae9a938d62c6ae7710757";
const BASE_URL = "https://api.themoviedb.org/3";

//variables 
let paginaActual = 1;
let totalPaginas = 1;
let consulta = "";
let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

//evento de del boton "buscar"
searchBtn.addEventListener("click", () => {
    consulta = searchInput.value.trim();
    if(consulta){
        paginaActual = 1;
        buscarPelis(consulta, paginaActual);
    }
});

//boton para retroceder
prevBtn.addEventListener("click", () =>{
    if(paginaActual > 1){
        paginaActual--;
        buscarPelis(consulta, paginaActual);
    }
});

//boton para avanzar
nextBtn.addEventListener("click", () => {
    if(paginaActual < totalPaginas){
        paginaActual++;
        buscarPelis(consulta, paginaActual);
    }
});

favoritesBtn.addEventListener("click", mostrarFav);

//Funcion para buscar peliculas
async function buscarPelis(consul, pagina){
    try{
        const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${consul}&page=${pagina}`
        );
        const data = await response.json();
        totalPaginas = data.total_pages;
        currentMovies = data.results;
        mostrarPeliculas(currentMovies);
        actualizarPaginacion();
    } catch (error) {
        console.error("Error al encontrar peliculas: ", error);
        resultsContainer.innerHTML = "<p>Error al cargar películas. Intenta de nuevo.</p>";
    }
}

//Mostrar las peliculas en el DOM
function mostrarPeliculas(movies){
    resultsContainer.innerHTML = "";
    if(movies.length === 0){
        resultsContainer.innerHTML = "<p>No se encontraron películas.</p>";
        return;
    }

    movies.forEach(movie => {
    const movieCard = document.createElement("div");
    movieCard.className = "movie-card";

    const isFavorite = favorites.some(fav => fav.id === movie.id);

    movieCard.innerHTML = `
    <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
            <div class="movie-info">
                <h3>${movie.title}</h3>
                <p>${movie.release_date ? movie.release_date.split("-")[0] : "N/A"}</p>
                <button class="favorite-btn" data-id="${movie.id}">
                    ${isFavorite ? "❤️ Quitar de Favoritos" : "🤍 Añadir a Favoritos"}
                </button>
            </div>
    `;
    resultsContainer.appendChild(movieCard);
    });

    // Añdimos los botones de favoritos
    document.querySelectorAll(".favorite-btn").forEach(
        btn => {btn.addEventListener("click", () => toggleFavorite(btn.dataset.id));}
    );
}

// Funcion para alternar favoritos
function toggleFavorite(movieId){
    const movie = currentMovies.find(m => m.id == movieId);
    const index = favorites.findIndex(fav => fav.id == movieId);

    if(index === -1) {
        favorites.push(movie);
    }else {{
        favorites.splice(index, 1);
    }}

    localStorage.setItem("favorites", JSON.stringify(favorites));
    if(consulta){
        buscarPelis(consulta, paginaActual);
    }else {
        mostrarFav();
    }
}

//Mostrar favotiros
function mostrarFav(){
    if (favorites.length === 0) {
        resultsContainer.innerHTML = "<p> No tienes películas favoritas aún.</p>"
    } else {
        mostrarPeliculas(favorites);
    }
    consulta = "";
    pageInfo.textContent = "Favoritos";
}
 //Actualizar paginacion
function actualizarPaginacion(){
    pageInfo.textContent = `Página ${paginaActual} de ${totalPaginas}`;
    prevBtn.disabled = paginaActual === 1;
    nextBtn.disabled = paginaActual === totalPaginas;
} 

// Inicializacion 
actualizarPaginacion();

