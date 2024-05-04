let limit = 20;
let offset = 0;

let pokemons = [];
let pokemonsUrl = [];
let allPokemons = [];

let currentPokemon;
let currentSpeciesInfo;

async function init() {
    await loadPokemons();
    renderPokemons();
    createAllPokemonsArray();
}


async function loadPokemons() {
    let url = 'https://pokeapi.co/api/v2/pokemon/?offset=' + offset + '&limit=' + limit;
    let response = await fetch(url);
    responseAsJson = await response.json();
    createPokemonsArray(responseAsJson['results']); 
    console.log(pokemonsUrl);
}

function loadMorePokemons() {
    show('loadScreen');
    if (offset < 360) {
        load20morePokemons(); // 20 weitere Pokemons laden
    } else if (offset == 360) { // verhindert, dass Pokemons nach 386 geladen werden
        load6morePokemons(); // 6 weitere Pokemons laden
    } else if (offset == 366) {
        alert('Limit erreicht');
    }
}

async function load20morePokemons() {
    offset += limit;
    await loadPokemons();
    hide('loadScreen');
}

async function load6morePokemons() {
    limit = 6;
    offset += limit;
    loadPokemons();
    hide('loadScreen');
}

function createPokemonsArray(pokemonsJson) { // Array mit den in die Preview zu ladenden Pokemons erstellen
    for (let i = 0; i < pokemonsJson.length; i++) {
        pokemons.push(pokemonsJson[i]['name']);
        pokemonsUrl.push(pokemonsJson[i]['url']);
    }
}

function renderPokemons() { // preview Cards laden
    document.getElementById('previewCardsContainer').innerHTML = '';
    for (let i = 0; i < pokemons.length; i++) {
        let pokemonId = i + 1; // i + 1 ist die ID des Pokemons, da ein Array immer bei 0 anfängt, aber die Pokemons bei 1
        let pokemonName = capitalizeWord(pokemons[i]);
        let imgUrl = getPreviewImgUrl(pokemonId);
        document.getElementById('previewCardsContainer').innerHTML += templateCardPreview(i, pokemonName, imgUrl);
        renderTypesToPreviewCard(pokemonId, i);
    }
}

function getPreviewImgUrl(pokemonId) {
    return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/' + pokemonId + '.png';
}

async function renderTypesToPreviewCard(pokemonId, i) {
    let types = await getTypes(pokemonId);
    let containerId = 'previewCardTypesContainer' + i;
    for (j = 0; j < types.length; j++) {
        document.getElementById(containerId).innerHTML += templatePreviewTypes(types[j]);
    }
}

async function getTypes(pokemonId) {
    let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
    let response = await fetch(url);
    let pokemon = await response.json(); // pokemon ist die "responseAsJson"
    let typesJson = pokemon['types']; // Array mit allen Types
    let types = [];
    for (let i = 0; i < typesJson.length; i++) { // durch Array 'types' iterieren um alle types in die Subheadline einzufügen
        let type = typesJson[i]['type']['name'];
        types.push(type);
    }
    return arrayToUpperCase(types);
}

// Suche -----------------------------------------------------------------------------------------------------------

async function searchPokemon() {
    if (searchInputContent().length > 1) {
        show('loadScreen');
        filterPokemonPreviewCards();
    }
    else if (searchInputContent().length = 1) {
        renderPokemons();
    }
}

async function createAllPokemonsArray() {
    let url = 'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=386'; // limit = 386 weil die späteren Pokemons bei habitat nichts mehr hinterlegt haben und dann der Steckbrief nicht funktioniert
    let response = await fetch(url);
    let responseAsJson = await response.json();
    allPokemons = allPokemonsArray(responseAsJson['results']); // Array mit allen Pokemon-Namen erstellen
}

function searchInputContent() {
    let search = document.getElementById('searchInput').value;
    return search.toLowerCase();
}

function allPokemonsArray(pokemonsJson) { // Array mit allen Pokemon-Namen erstellen
    let allPokemons = [];
    for (let i = 0; i < pokemonsJson.length; i++) {
        allPokemons.push(pokemonsJson[i]['name']);
    }
    return allPokemons;
}

function filterPokemonPreviewCards() {
    document.getElementById('previewCardsContainer').innerHTML = '';
    for (i = 0; i < allPokemons.length; i++) {
        let pokemonId = i + 1;
        let pokemonName = capitalizeWord(allPokemons[i]);
        let imgSrc = getPreviewImgUrl(pokemonId);
        if (pokemonName.toLowerCase().includes(searchInputContent())) {
            document.getElementById('previewCardsContainer').innerHTML += templateCardPreview(i, pokemonName, imgSrc);
            renderTypesToPreviewCard(pokemonId, i);
            hide('loadScreen');
        }
    }
}

// Card ------------------------------------------------------------------------------------------------------------

function showCard(i) {
    let pokemonId = i + 1;
    show('popupBackground');
    show('card');
    loadPokemon(pokemonId);
    document.body.style.overflow = "hidden"; // srollen unterbinden
}

function hideCard(sectionId) {
    hide(sectionId);
    hide('popupBackground');
    document.body.style.overflow = "scroll"; // scrollen wieder aktivieren
}

async function loadPokemon(pokemonId) {
    if (pokemonId < 1) { } // do nothing
    else {
        wipeCard();
        let url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`;
        let response = await fetch(url);
        currentPokemon = await response.json(); // currentPokemon ist die "responseAsJson"
        await loadSpeciesInfo();
        renderPokemonInfo(pokemonId);
    }
}

async function loadSpeciesInfo() {
    let url = currentPokemon['species']['url'];
    let response = await fetch(url);
    currentSpeciesInfo = await response.json();
}

async function renderPokemonInfo(pokemonId) {
    addCardHeader(pokemonId);
    renderTypesToCard(await getTypes(pokemonId)); // Types in die Card-Subheadline einfügen
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

function renderTypesToCard(types) { // Types in die Card-Subheadline einfügen
    for (let i = 0; i < types.length; i++) { // durch Array 'types' iterieren um alle types in die Subheadline einzufügen
        document.getElementById('cardSubHeadline').innerHTML += templateTypes(types[i]);
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
    return arrayToUpperCase(statsList); // alle Wörter im Array groß schreiben (1.Buchstabe)
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
    let height = formattedHeightAndWeight(currentPokemon['height']) + ' m';
    let weight = formattedHeightAndWeight(currentPokemon['weight']) + ' kg';
    let abilities = getAbilities();
    let habitat = currentSpeciesInfo['habitat']['name'];
    let growthRate = currentSpeciesInfo['growth_rate']['name'];
    let specsInfo = [species, height, weight, abilities, habitat, growthRate];
    return arrayToUpperCase(specsInfo); // alle Wörter im Array am Anfang groß schreiben
}

function formattedHeightAndWeight(number) { // Umrechnung der Werte height und weight in Meter / Kilogramm 
    let formattedNumber = number / 10;
    return formattedNumber.toFixed(1); // standardmäßig eine Nachkommastelle hinzufügen
}

function getAbilities() { // Array mit Abilities erstellen
    let abilities = [];
    for (let i = 0; i < currentPokemon['abilities'].length; i++) {
        let ability = currentPokemon['abilities'][i]['ability']['name'];
        abilities.push(ability);
    }
    return arrayToUpperCase(abilities).join(', '); // den 1. Buchstaben jedes Wortes im Array zum Großbuchstaben machen, Inhalt in String mit Komma und Leerstelle umwandeln
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

function arrayToUpperCase(array) { // den 1. Buchstaben jedes Wortes im Array zum Großbuchstaben machen
    let arrayToUpperCase = [];
    for (let i = 0; i < array.length; i++) {
        arrayToUpperCase.push(capitalizeWord(array[i])); // jedes einzelne Wort im eingegebenen Array durch die function 'capitalizeWord(word)' jagen und dann dem Array 'arrayToUpperCase' hinzufügen
    }
    return arrayToUpperCase;
}
// 
function doNotClose(event) {
    event.stopPropagation();
}

// -------------------------------------------------------------------------------------------------------------------