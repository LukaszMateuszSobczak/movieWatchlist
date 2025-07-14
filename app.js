'use strict';

//container for movies
const movieContainer = document.querySelector('#movieContainer');
//function for creating box with movies
const createMovieBox = (data, isWatchlist = false) => {
    const fragment = document.createDocumentFragment();

    //movie box
    const divBox = document.createElement('div');
    divBox.className = 'box';

    //movie poster
    const img = document.createElement('img');
    img.src = data.Poster;
    img.className = 'movie-image';
    divBox.appendChild(img);

    //movie info box
    const divMovieInfo = document.createElement('div');
    divMovieInfo.className = 'movie-info';
    divBox.append(divMovieInfo);

    //movie title
    const h3MovieTitle = document.createElement('h3');
    h3MovieTitle.className = 'movie-title';
    h3MovieTitle.textContent = data.Title;

    const spanMovieRating = document.createElement('span');
    spanMovieRating.className = 'movie-rating';

    const iconFontStar = document.createElement('i');
    iconFontStar.classList.add('fa-solid', 'fa-star');

    spanMovieRating.textContent = data.imdbRating;
    h3MovieTitle.append(spanMovieRating);
    spanMovieRating.prepend(iconFontStar);
    divMovieInfo.append(h3MovieTitle);

    // movie additional info
    const divAdditionalInfo = document.createElement('div');
    divAdditionalInfo.className = 'movie-additional-info';

    const pLength = document.createElement('p');
    pLength.className = 'movie-length';
    pLength.textContent = data.Runtime;
    divAdditionalInfo.append(pLength);

    const pType = document.createElement('p');
    pType.className = 'movie-type';
    pType.textContent = data.Genre;
    divAdditionalInfo.append(pType);

    const btnMovie = document.createElement('button');

    const iconFontPlus = document.createElement('i');

    btnMovie.className = 'movie-btn';
    if (isWatchlist) {
        btnMovie.textContent = 'Delete';
        btnMovie.dataset.title = data.Title;
        iconFontPlus.classList.add('fa-solid', 'fa-square-minus');
        divAdditionalInfo.append(btnMovie);
    } else {
        btnMovie.textContent = 'Watchlist';
        btnMovie.dataset.title = data.Title;
        iconFontPlus.classList.add('fa-solid', 'fa-square-plus');
        divAdditionalInfo.append(btnMovie);
    }

    btnMovie.prepend(iconFontPlus);

    divMovieInfo.append(divAdditionalInfo);

    //movie description
    const pDescription = document.createElement('p');
    pDescription.className = 'movie-description';
    pDescription.textContent = data.Plot;

    //movie separator
    const divSep = document.createElement('div');
    divSep.className = 'line';
    divBox.append(divSep);

    divMovieInfo.append(pDescription);

    fragment.appendChild(divBox);
    movieContainer.prepend(fragment);
};

// global var for user input
// reading user input from form
// listener for user input
let movieTitle = '';
const getUserInput = (e) => {
    e.preventDefault();
    const input = document.querySelector('#movieTitleInput');
    movieTitle = input.value;
    input.value = '';
    getData();
};
document.querySelector('#filmFinderForm').addEventListener('submit', getUserInput);

//saving data to local storage, pass object with info about movie
const saveData = (data) => {
    if (JSON.parse(localStorage.getItem('watchlist')) === null) {
        localStorage.setItem('watchlist', JSON.stringify([data]));
    } else {
        const savedMovies = JSON.parse(localStorage.getItem('watchlist'));
        const isIncludeFilm = savedMovies.some((ele) => ele.Title === data.Title);

        if (!isIncludeFilm) {
            savedMovies.push(data);
            localStorage.setItem('watchlist', JSON.stringify(savedMovies));
            popModal('Film added!', 'fa-check');
        } else {
            popModal('Already exist', 'fa-list');
        }
    }
};
// delete data from local storage, pass movie title to delete
const deleteData = (movieTitle) => {
    const movieArray = JSON.parse(localStorage.getItem('watchlist'));
    const newMovieArray = movieArray.filter((obj) => {
        if (obj.Title != movieTitle) {
            return obj;
        }
    });
    localStorage.setItem('watchlist', JSON.stringify(newMovieArray));
    popModal('Deleted!', 'fa-trash');
    refreshWatchList();
};

//listener for add or remove movie at local storage
document.addEventListener('click', (e) => {
    if (e.target.dataset.title && e.target.textContent.includes('Watchlist')) {
        getData(true);
    } else if (e.target.dataset.title && e.target.textContent.includes('Delete')) {
        deleteData(e.target.dataset.title);
    }
});

// modal window for letting user what happen , pass text for information and class name for icon from font awesome
const popModal = (textToShow, iconClass) => {
    document.querySelector('#modalBox').classList.remove('hide');
    document.querySelector('#modalText').textContent = textToShow;
    document.querySelector('#modalIcon').classList.add(iconClass);
    setTimeout(() => {
        document.querySelector('#modalBox').classList.add('hide');
        document.querySelector('#modalIcon').classList.remove(iconClass);
    }, 2000);
};

const refreshWatchList = () => {
    const currentPage = window.location.pathname;
    if (currentPage.includes('watchlist.html')) {
        const watchlistArray = JSON.parse(localStorage.getItem('watchlist'));
        const eleToRemove = movieContainer.querySelectorAll('.box');
        if (!(watchlistArray.length === 0)) {
            document.querySelector('#myWatchListInfo').classList.add('hide');
            eleToRemove.forEach((el) => el.remove());
            for (let movieObj of watchlistArray) {
                createMovieBox(movieObj, true);
            }
        } else {
            eleToRemove.forEach((el) => el.remove());
            document.querySelector('#myWatchListInfo').classList.remove('hide');
        }
    }
};

// connecting with API
const apiKey = '64ea214';
async function getData(onlySave = false) {
    try {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${movieTitle}`);
        const data = await res.json();
        if (data.Response === 'False') {
            throw new Error('no film');
        }
        const movieInfo = {
            Title: data.Title,
            Runtime: data.Runtime,
            Genre: data.Genre,
            imdbRating: data.imdbRating,
            Plot: data.Plot,
            Poster: data.Poster,
        };
        if (onlySave) {
            saveData(movieInfo);
        } else {
            document.querySelector('#startInfo').classList.add('hide');
            createMovieBox(movieInfo);
        }
    } catch (error) {
        console.log(error);
        popModal('Film not found', 'fa-xmark');
    }
}

refreshWatchList();
