const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const yearFilter = document.getElementById('yearFilter');
const sortMovies = document.getElementById('sortMovies');
const movieGrid = document.getElementById('movieGrid');

let allMoviesData = []; 
let displayedMovies = [];

const API_KEY = '443147e8';
const BASE_URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=`;

async function fetchMovies(searchTerm) {
    try {
        const response = await fetch(`${BASE_URL}${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        if (data.Response === "True") {
            allMoviesData = data.Search; 
            displayedMovies = [...allMoviesData];
                        renderMovies(displayedMovies);
        } else {
            movieGrid.innerHTML = `<div class="placeholder-text">${data.Error} (Try being more specific)</div>`;
        }
    } catch (error) {
        console.error("Failed to fetch data", error);
        movieGrid.innerHTML = `<div class="placeholder-text">Network Error. Please try again later.</div>`;
    }
}


function renderMovies(moviesArray) {
    movieGrid.innerHTML = ''; 

    if (moviesArray.length === 0) {
        movieGrid.innerHTML = `<div class="placeholder-text">No active results.</div>`;
        return;
    }

    const cardsMarkup = moviesArray.map(movie => `
        <div class="movie-card">
            <img class="poster" src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${movie.Title}">
            <div class="info">
                <h3>${movie.Title}</h3>
                <p>Release Year: <strong>${movie.Year}</strong></p>
                <p>Type: <span style="text-transform: capitalize;">${movie.Type}</span></p>
            </div>
        </div>
    `).join(''); 

    movieGrid.innerHTML = cardsMarkup;
}

yearFilter.addEventListener('change', () => {
   
});

sortMovies.addEventListener('change', () => {

});

searchBtn.addEventListener('click', () => {
    const term = searchInput.value.trim();
    if (term) {
        movieGrid.innerHTML = `<div class="placeholder-text">Searching the database... 🍿</div>`;
        fetchMovies(term);
    }
});

searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});
