function templateStatsChart(statsLineLength) {
    return ` 
    <div class="statsLineContainer">
        <div class="emptyStatsLine">
            <div class="statsLine" style="width:${statsLineLength}px"></div>
        </div>
    </div>
`; 
}