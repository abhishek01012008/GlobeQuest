const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const yearFilter = document.getElementById('yearFilter');
const sortMovies = document.getElementById('sortMovies');
const movieGrid = document.getElementById('movieGrid');

let allMoviesData = []; 
let displayedMovies = [];

const API_KEY = '4a31ab20';
const URL = `https://www.omdbapi.com/?apikey=${API_KEY}&s=`;

async function fetchMovies(searchTerm) {
    try {
        const response = await fetch(`${URL}${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        if(data.Response === "True"){
            allMoviesData = data.Search; 
            displayedMovies = [...allMoviesData];
            renderMovies(displayedMovies);
        } 
        else{
            movieGrid.innerHTML = `<div class="placeholder-text">${data.Error} (Try being more specific)</div>`;
        }
    } catch(error){
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
    
    const cardsMarkup = moviesArray.map(movie =>
        `<div class="movie-card">
            <img class="poster" src="${movie.Poster !== "N/A" ? movie.Poster : 'https://via.placeholder.com/300x450?text=No+Poster'}" alt="${movie.Title}">
            <div class="info">
                <h3>${movie.Title}</h3>
                <p>Release Year: <strong>${movie.Year}</strong></p>
                <p>Type: <span style="text-transform: capitalize;">${movie.Type}</span></p>
            </div>
        </div>`).join(''); 
    movieGrid.innerHTML = cardsMarkup;
}


yearFilter.addEventListener('change', () => {
    const value = yearFilter.value;

    let filtered = [...allMoviesData];

    if (value === "2020s") {
        filtered = filtered.filter(movie => parseInt(movie.Year) >= 2020);
    } 
    else if (value === "2010s") {
        filtered = filtered.filter(movie => {
            const year = parseInt(movie.Year);
            return year >= 2010 && year < 2020;
        });
    } 
    else if (value === "older") {
        filtered = filtered.filter(movie => parseInt(movie.Year) < 2010);
    }

    displayedMovies = filtered;
    renderMovies(displayedMovies);
});

sortMovies.addEventListener('change', () => {
    const value = sortMovies.value;

    let sorted = [...displayedMovies];

    if (value === "year-desc") {
        sorted.sort((a, b) => parseInt(b.Year) - parseInt(a.Year));
    } 
    else if (value === "year-asc") {
        sorted.sort((a, b) => parseInt(a.Year) - parseInt(b.Year));
    } 
    else if (value === "title-asc") {
        sorted.sort((a, b) => a.Title.localeCompare(b.Title));
    } 
    else if (value === "title-desc") {
        sorted.sort((a, b) => b.Title.localeCompare(a.Title));
    }

    displayedMovies = sorted;
    renderMovies(displayedMovies);
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
