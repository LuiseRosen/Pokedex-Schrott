function renderChart() {
    renderStatsList();
    renderStatsData();
    renderStatsLines();
}

function renderStatsList() {
    let statsList = getStatsList();
    for (i = 0; i < statsList.length; i++) {
        document.getElementById('statsContainer').innerHTML += `<div class="stat">${statsList[i]}</div>`;
    }
}

function renderStatsData() {
    let statsData = getStatsData();
    for (i = 0; i < statsData.length; i++) {
        document.getElementById('statsDataContainer').innerHTML += `<div class="statsData">${statsData[i]}</div>`;
    }
}

function renderStatsLines() {
    let statsData = getStatsData();
    for (i = 0; i < statsData.length; i++) {
        let statsLineLength = (statsData[i] / 150) * 100; // statsData[i] in % (150 ist der maximal erreichbare Wert)
        document.getElementById('statsLinesContainer').innerHTML += templateStatsChart(statsLineLength);
    }
}