let currentPokemon;
let pokemonId;

let aboutPoints = ['species', 'height', 'weight', 'abilities', 'habitat', 'growth-rate']

function init() {
    loadPokemon();
}

async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/bulbasaur';
    let response = await fetch(url);
    currentPokemon = await response.json(); // currentPokemon ist die "responseAsJson"
    console.log('loaded Pokemon', currentPokemon);
    getPokemonId();
    renderPokemonInfo();
}

function renderPokemonInfo() {
    addCardHeader();
    getTypes();
    renderChart();
    renderAboutSection();
}

function getPokemonId() {
    pokemonId = currentPokemon['id'];
}

function addCardHeader() {
    document.getElementById('pokemonName').innerHTML = formattedPokemonName(); // Pokemon Namen als Überschrift einfügen
    document.getElementById('pokemonImg').src = getPokemonImg(); // Pokemon IMG einfügen
    document.getElementById('pokemonId').innerHTML = '#' + formattedPokemonId(); // Pokemon-ID in die Überschrift einfügen
}

function getPokemonImg() {
    let pokemonImg = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    return pokemonImg;
}

function getTypes() {
    let types = currentPokemon['types']

    for (let i = 0; i < types.length; i++) {
        let type = types[i]['type']['name'];
        document.getElementById('cardSubHeadline').innerHTML += `<span class="type">${type}</span>`;
    }
}

function formattedPokemonId() {
    let formattedPokemonId = pokemonId.toString().padStart(3, '0'); // ID-Nummer 3-stellig machen 
    return formattedPokemonId;
}

function formattedPokemonName() {
    let pokemonName = currentPokemon['name'];
    let pokemonNameCap = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1) // 1. Buchstaben groß schreiben
    return pokemonNameCap;
}

function getStatsList() {
    let statsList = [];
    for (let i = 0; i < currentPokemon['stats'].length; i++) {
        let stat = (currentPokemon['stats'][i]['stat']['name']);
        statsList.push(stat);
    }
    return statsList;
}

function getStatsData() {
    let statsData = [];
    for (let i = 0; i < currentPokemon['stats'].length; i++) {
        let data = (currentPokemon['stats'][i]['base_stat']);
        statsData.push(data);
    }
    return statsData;
}

function swichCardSection(selectedSection) {
    if (selectedSection == 'about') {
        show('aboutSection');
        hide('baseStatsChart');
    } else if (selectedSection == 'stats') {
        show('baseStatsChart');
        hide('aboutSection');
    }
}

function show(sectionId) {
    let selectedSection = document.getElementById(sectionId);
    selectedSection.classList.add('display-flex');
    selectedSection.classList.remove('display-none');
}

function hide(sectionId) {
    let selectedSection = document.getElementById(sectionId);
    selectedSection.classList.add('display-none');
    selectedSection.classList.remove('display-flex');
}



function renderAboutSection() {
    let aboutPointsContainer = document.getElementById('aboutPointsContainer');
    for (let i = 0; i < aboutPoints.length; i++) {

        aboutPointsContainer.innerHTML += `<div>${aboutPoints[i]}</div>`;
    }
}

function getWeight() {
    let weight = formattedNumber(currentPokemon['weight']);
    console.log(weight);
}

function getHeight() {
    let height = formattedNumber(currentPokemon['height']);
    console.log(height);
}

function formattedNumber(number) {
    let formattedNumber = number / 10;
    return formattedNumber;
}