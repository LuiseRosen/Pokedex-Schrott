let currentPokemon;
let pokemonId; // muss das global sein ?
let currentSpeciesInfo; // muss das global sein ?

function init() {
    loadPokemon();
}

async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/bulbasaur';
    let response = await fetch(url);
    currentPokemon = await response.json(); // currentPokemon ist die "responseAsJson"
    console.log('loaded Pokemon', currentPokemon);
    getPokemonId();
    await loadSpeciesInfo();
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

function getTypes() { // Subheadline
    let types = currentPokemon['types']

    for (let i = 0; i < types.length; i++) {
        let type = types[i]['type']['name'];
        document.getElementById('cardSubHeadline').innerHTML += templateTypes(type);
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
        show('aboutSection'); // div einblenden
        hide('baseStatsChart'); // div ausblenden
    } else if (selectedSection == 'stats') {
        show('baseStatsChart'); // div einblenden
        hide('aboutSection'); // div ausblenden
    }
}

function show(sectionId) { // div einblenden
    let selectedSection = document.getElementById(sectionId);
    selectedSection.classList.add('display-flex');
    selectedSection.classList.remove('display-none');
}

function hide(sectionId) { // div ausblenden
    let selectedSection = document.getElementById(sectionId);
    selectedSection.classList.add('display-none');
    selectedSection.classList.remove('display-flex');
}

function renderAboutSection() {
    let specsList = ['Species', 'Height', 'Weight', 'Abilities', 'Habitat', 'Growth-Rate'];
    let specsInfo = getSpecsInfo(); // Array mit Spezifikationen laden

    for (let i = 0; i < specsList.length; i++) {
        specsListContainer.innerHTML += templateSpecsList(specsList, i); 
        specsInfoContainer.innerHTML += templateSpecsInfo(specsInfo, i);
    }
}

function getSpecsInfo() {
    let species = currentSpeciesInfo['genera'][7]['genus'];
    let height = formattedNumber(currentPokemon['height']) + ' m';
    let weight = formattedNumber(currentPokemon['weight']) + ' kg';
    let abilities = getAbilities();
    let habitat = currentSpeciesInfo['habitat']['name'];
    let growthRate = currentSpeciesInfo['growth_rate']['name'];
    let specsInfo = [species, height, weight, abilities, habitat, growthRate];
    return specsInfo;
}

function formattedNumber(number) { // Umrechnung der Werte in Meter / Kilogramm 
    let formattedNumber = number / 10;
    return formattedNumber;
}

function getAbilities() {
    let abilities = [];
    for (let i = 0; i < currentPokemon['abilities'].length; i++) {
        let ability = currentPokemon['abilities'][i]['ability']['name'];
        abilities.push(ability);
    }
    return formattedAbilities(abilities);
}

function formattedAbilities(abilities) {
    let abilitiesToUpperCase = firstLetterToUpperCase(abilities); // den 1. Buchstaben jedes Wortes im Array zum Großbuchstaben machen
    let abilitiesAsString = abilitiesToUpperCase.join(', '); // Inhalt in String mit Komma und Leerstelle umwandeln
    return abilitiesAsString;
}

function firstLetterToUpperCase(array) {
    let arrayToUpperCase = [];
    for (let i = 0; i < array.length; i++) { 
        let wordToUpperCase = array[i][0].toUpperCase() + array[i].substr(1);// den 1. Buchstaben jedes Wortes im Array zum Großbuchstaben machen
        arrayToUpperCase.push(wordToUpperCase);
    }
    return arrayToUpperCase;
}