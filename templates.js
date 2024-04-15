function templateStatsChart(statsLineLength) {
    return ` 
    <div class="statsLineContainer">
        <div class="emptyStatsLine">
            <div class="statsLine" style="width:${statsLineLength}px"></div>
        </div>
    </div>
`; 
}

function templateSpecsList(specsList, i) {
    return `<div class="spec">${specsList[i]}</div>`;
}

function templateSpecsInfo(specsInfo, i) {
return `<div class="specInfo">${specsInfo[i]}</div>`;
}

function templateTypes(type) {
    return `<span class="type">${type}</span>`;
}