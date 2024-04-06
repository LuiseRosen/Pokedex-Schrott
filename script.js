let currentPokemon;
let pokemonId;

function init() {
    loadPokemon();
}

async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/pidgey';
    let response = await fetch(url);
    currentPokemon = await response.json(); // sonst haben wir die Variable immer responseAsJson genannt.
    console.log('loaded Pokemon', currentPokemon);
    getPokemonId();
    
    renderPokemonInfo();
}

function renderPokemonInfo() {
    let pokemonName = currentPokemon['name'];
    let pokemonNameCap = pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1) // 1. Buchstaben groß schreiben
    let formattedPokemonId = pokemonId.toString().padStart(3, '0'); // ID-Nummer 3-stellig machen 


    document.getElementById('pokemonName').innerHTML = pokemonNameCap;
    document.getElementById('pokemonImg').src = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    document.getElementById('pokemonId').innerHTML = '#' + formattedPokemonId;
    getTypes();
    renderChart();
}

function getPokemonId() {
    pokemonId = currentPokemon['id'];
}

function getTypes() {
    let types = currentPokemon['types']

    for (let i = 0; i < types.length; i++) {
        let type = types[i]['type']['name'];
        document.getElementById('cardSubHeadline').innerHTML += `<span class="type">${type}</span>`;
    }
}

function getStatsList() {
    let statsList = [];
    for(let i = 0; i < currentPokemon['stats'].length; i++) {
         let stat = (currentPokemon['stats'][i]['stat']['name']);
         statsList.push(stat);
    }
    return statsList;
}

function getStatsData() {
    let statsData = [];
    for(let i = 0; i < currentPokemon['stats'].length; i++) {
         let data = (currentPokemon['stats'][i]['base_stat']);
         statsData.push(data);
    }
    return statsData;
}
