
let limit = 20;
let offset = 0;

let pokemons = [];
let pokemonsUrl = [];

let currentPokemon;
let currentSpeciesInfo;


async function loadPokemons() {
    let url = 'https://pokeapi.co/api/v2/pokemon/?offset=' + offset + '&limit=' + limit;
    let response = await fetch(url);
    responseAsJson = await response.json(); // pokemons ist die "responseAsJson"
    createPokemonsArray(responseAsJson['results']);
    renderPokemons();

    console.log(responseAsJson);
}

function createPokemonsArray(pokemonsJson) {
    for (let i = 0; i < pokemonsJson.length; i ++){
        pokemons.push(pokemonsJson[i]['name']);
        pokemonsUrl.push(pokemonsJson[i]['url']);
    }
    console.log('Pokemons', pokemons);
}

function renderPokemons() {
    document.getElementById('previewCardsContainer').innerHTML = '';
    for (let i = 0; i < pokemons.length; i++) { 
        document.getElementById('previewCardsContainer').innerHTML += templateCardPreview(i, capitalizeWord(pokemons[i]));
    }
}

function loadMorePokemons() {
    limit += 20;
    offset += 20;
    loadPokemons();
    console.log(limit);
 }
// Card ------------------------------------------------------------------------------------------------------------

function showCard(i) {
    let pokemonId = i + 1;
    show('card');
    loadPokemon(pokemonId);
}

async function loadPokemon(pokemonId) {
    if (pokemonId < 1) {} // do nothing
    else {
        wipeCard();
        let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
        let response = await fetch(url);
        currentPokemon = await response.json(); // currentPokemon ist die "responseAsJson"
        console.log('loaded Pokemon', currentPokemon);
        await loadSpeciesInfo();
        renderPokemonInfo(pokemonId);
    }
    
}

async function loadSpeciesInfo() {
    let url = currentPokemon['species']['url'];
    let response = await fetch(url);
    currentSpeciesInfo = await response.json();
    console.log('species Info', currentSpeciesInfo);
}

function renderPokemonInfo(pokemonId) {
    addCardHeader(pokemonId);
    getTypes();
    renderChart();
    renderAboutSection();
}

function wipeCard() {
    document.getElementById('pokemonName').innerHTML = '';
    document.getElementById('pokemonImg').src = '';
    document.getElementById('pokemonId').innerHTML = '';
    document.getElementById('cardSubHeadline').innerHTML = '';
    document.getElementById('specsListContainer').innerHTML = '';
    document.getElementById('specsInfoContainer').innerHTML = '';
    document.getElementById('statsContainer').innerHTML = '';
    document.getElementById('statsDataContainer').innerHTML = '';
    document.getElementById('statsLinesContainer').innerHTML = '';
    show('aboutSection');
    hide('baseStatsChart');
}

// Card-Header ------------------------------------------------------------------------------------------------------

function addCardHeader(pokemonId) {
    document.getElementById('pokemonName').innerHTML = formattedPokemonName(); // Pokemon Namen als Überschrift einfügen
    document.getElementById('pokemonImg').src = getPokemonImgUrl(); // Pokemon IMG einfügen
    document.getElementById('pokemonId').innerHTML = '#' + formattedPokemonId(); // Pokemon-ID in die Überschrift einfügen
    document.getElementById('cardNavigation').innerHTML = templateCardNavigation(pokemonId);
}

function getPokemonImgUrl() { // Pokemon-Bild-URL laden
    return currentPokemon['sprites']['other']['official-artwork']['front_default'];
}

function getTypes() { // Types in die Card-Subheadline einfügen
    let types = currentPokemon['types']; // Array mit allen Types

    for (let i = 0; i < types.length; i++) { // durch Array 'types' iterieren um alle types in die Subheadline einzufügen
        let type = types[i]['type']['name'];
        document.getElementById('cardSubHeadline').innerHTML += templateTypes(type);
    }
}

function formattedPokemonId() {
    return currentPokemon['id'].toString().padStart(3, '0'); // ID-Nummer 3-stellig machen 
}

function formattedPokemonName() { // Pokemon Namen groß schreiben
    return capitalizeWord(currentPokemon['name']);
}

function swichCardSection(selectedSection) { // Kartensektion wechseln zwischen About und Stats
    if (selectedSection == 'about') {
        show('aboutSection'); // div einblenden
        hide('baseStatsChart'); // div ausblenden
    } else if (selectedSection == 'stats') {
        show('baseStatsChart'); // div einblenden
        hide('aboutSection'); // div ausblenden
    }
}

// Card Stats-Section ------------------------------------------------------------------------------------------------------------------

function getStatsList() { // Array mit allen Stats 'Überschriften' erstellen
    let statsList = [];
    for (let i = 0; i < currentPokemon['stats'].length; i++) {
        let stat = (currentPokemon['stats'][i]['stat']['name']);
        statsList.push(stat);
    }
    return firstLetterToUpperCase(statsList); // alle Wörter im Array groß schreiben (1.Buchstabe)
}

function getStatsData() { // Array mit allen Stats-Werten erstellen
    let statsData = [];
    for (let i = 0; i < currentPokemon['stats'].length; i++) {
        let data = (currentPokemon['stats'][i]['base_stat']);
        statsData.push(data);
    }
    return statsData;
}

// Card About-Section ----------------------------------------------------------------------------------------------------

function renderAboutSection() {
    let specsList = ['Species', 'Height', 'Weight', 'Abilities', 'Habitat', 'Growth-Rate'];
    let specsInfo = getSpecsInfo(); // Array mit Spezifikationen laden

    for (let i = 0; i < specsList.length; i++) {
        document.getElementById('specsListContainer').innerHTML += templateSpecsList(specsList, i);
        document.getElementById('specsInfoContainer').innerHTML += templateSpecsInfo(specsInfo, i);
    }
}

function getSpecsInfo() { // Array erstellen in dem die Werte für die About-Section geladen sind
    let species = currentSpeciesInfo['genera'][7]['genus'];
    let height = formattedNumber(currentPokemon['height']) + ' m';
    let weight = formattedNumber(currentPokemon['weight']) + ' kg';
    let abilities = getAbilities();
    let habitat = currentSpeciesInfo['habitat']['name'];
    let growthRate = currentSpeciesInfo['growth_rate']['name'];
    let specsInfo = [species, height, weight, abilities, habitat, growthRate];
    return firstLetterToUpperCase(specsInfo); // alle Wörter im Array am Anfang groß schreiben
}

function formattedNumber(number) { // Umrechnung der Werte height und weight in Meter / Kilogramm 
    let formattedNumber = number / 10;
    return formattedNumber;
}

function getAbilities() { // Array mit Abilities erstellen
    let abilities = [];
    for (let i = 0; i < currentPokemon['abilities'].length; i++) {
        let ability = currentPokemon['abilities'][i]['ability']['name'];
        abilities.push(ability);
    }
    return firstLetterToUpperCase(abilities).join(', '); // den 1. Buchstaben jedes Wortes im Array zum Großbuchstaben machen, Inhalt in String mit Komma und Leerstelle umwandeln
}

// Allgemeine Funktionen --------------------------------------------------------------------------------------------------------------------

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

function capitalizeWord(word) { // Wort groß schreiben, auch 1. Buchstabe nach Bindestrich
    let words = word.split('-'); // 'word' in ein Array ohne '-' aufspalten
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1); // 1. Buchstaben jedes Wortes groß schreiben: charAt(0) gibt den Buchstaben an der Position 0 zurück, .toUpperCase() wird auf diesen angewendet. Mit + words[i].slice(1) wird - beginnend mit dem Zeichen an Position 1 und bis zum Ende des Strings - der Rest des Wortes angefügt
    }
    return words.join('-');  // Bindestrich wieder einfügen und fertigen Wert zurückgeben
}

function firstLetterToUpperCase(array) { // den 1. Buchstaben jedes Wortes im Array zum Großbuchstaben machen
    let arrayToUpperCase = [];
    for (let i = 0; i < array.length; i++) {
        arrayToUpperCase.push(capitalizeWord(array[i])); // jedes einzelne Wort im eingegebenen Array durch die function 'capitalizeWord(word)' jagen und dann dem Array 'arrayToUpperCase' hinzufügen
    }
    return arrayToUpperCase;
}

// -------------------------------------------------------------------------------------------------------------------