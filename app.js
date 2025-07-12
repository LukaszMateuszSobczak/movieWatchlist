'use strict';

const apiKey = '64ea214';

const movieTitle = 'blade+runner';

async function getData() {
    try {
        const res = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&t=${movieTitle}`);
        const data = await res.json();
        console.log(data);
        createMovieBox(data);
    } catch (error) {
        console.log(error);
    }
}

const movieContainer = document.querySelector('#movieContainer');

const createMovieBox = (data) => {
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

    const spanMovieRating = document.querySelector('span');
    spanMovieRating.className = 'movie-rating';

    const iconFontStar = document.createElement('i');
    iconFontStar.classList.add('fa-solid', 'fa-star');

    spanMovieRating.textContent = data.imdbRating;
    h3MovieTitle.append(spanMovieRating);
    spanMovieRating.prepend(iconFontStar);

    divMovieInfo.append(h3MovieTitle);

    fragment.appendChild(divBox);

    movieContainer.append(fragment);
};

getData();

// createMovieBox();

const addElementToUi = (data) => {};
