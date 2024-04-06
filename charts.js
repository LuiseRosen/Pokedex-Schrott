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
        let statsLineLength = statsData[i] * 1.5;
        document.getElementById('statsLinesContainer').innerHTML += ` 
            <div class="statsLineContainer">
                <div class="emptyStatsLine">
                    <div class="statsLine" style="width:${statsLineLength}px"></div>
                </div>
            </div>
        `; // als Template auslagern
    }
}