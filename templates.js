function templateCardPreview(i, pokemonName) {
    return /*HTML*/ `
    <div onclick="showCard(${i})" id="" class="cardPreview">
        <h1 class="pokemonNamePreview">${pokemonName}</h1>
        <div>
            <span class="types"></span>
            <span class="pokemonImgContainer">
                <img class="pokemonImg" src="" alt="">
            </span>
        </div>
    </div>
    `
}

function templateStatsChart(statsLineLength) {
    return /*HTML*/ ` 
    <div class="statsLineContainer">
        <div class="emptyStatsLine">
            <div class="statsLine" style="width:${statsLineLength}px"></div>
        </div>
    </div>
`;
}

function templateSpecsList(specsList, i) {
    return /*HTML*/ `
        <div class="spec">${specsList[i]}</div>
        `;
}

function templateSpecsInfo(specsInfo, i) {
    return  /*HTML*/ `
        <div class="specInfo">${specsInfo[i]}</div>
        `;
}

function templateTypes(type) {
    return /*HTML*/ `
        <span class="type">${type}</span>
        `;
}

function templateCardNavigation(pokemonIdx) {
    return /*HTML*/ `
        <img onclick="loadPokemon(${pokemonIdx - 1})" class="icon" src="./icons/arrow_previous.svg" alt="">
        <img onclick="loadPokemon(${pokemonIdx + 1})" class="icon" src="./icons/arrow_next.svg" alt="">      
    `
}