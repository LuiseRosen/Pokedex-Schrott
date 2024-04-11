let currentPokemon;
let pokemonId;

let currentSpeciesInfo;

let specsList = ['species', 'height', 'weight', 'abilities', 'habitat', 'growth-rate'];
let specsInfo = [];

async function init() {
    await loadPokemon();
    loadSpeciesInfo();
}

async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/bulbasaur';
    let response = await fetch(url);
    currentPokemon = await response.json(); // currentPokemon ist die "responseAsJson"
    console.log('loaded Pokemon', currentPokemon);
    getPokemonId();
    renderPokemonInfo();
}

async function loadSpeciesInfo() {
    let url = currentPokemon['species']['url'];
    let response = await fetch(url);
    currentSpeciesInfo = await response.json();
    console.log('species Info', currentSpeciesInfo);
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
    let specsListContainer = document.getElementById('specsListContainer');
    let specsInfoContainer = document.getElementById('specsInfoContainer');

    for (let i = 0; i < specsList.length; i++) {
        specsListContainer.innerHTML += `<div class="spec">${specsList[i]}</div>`;
        // specsInfoContainer.innerHTML += `<div class="specInfo">${specsInfo[i]}</div>`;
    }
}

function formattedNumber(number) {
    let formattedNumber = number / 10;
    return formattedNumber;
}

function getSpecsInfo() {
    let species = currentSpeciesInfo['genera'][7]['genus'];
    let height = formattedNumber(currentPokemon['height']);
    let weight = formattedNumber(currentPokemon['weight']);
    let abilities = getAbilities();
    let habitat = currentSpeciesInfo['habitat']['name'];
    let growthRate = currentSpeciesInfo['growth_rate']['name'];
}

function getAbilities() {
    let abilities = [];

    for (let i = 0; i < currentPokemon['abilities'].length; i++) {
        let ability = currentPokemon['abilities'][i]['ability']['name'];
        abilities.push(ability);
    }
    return abilities;
}