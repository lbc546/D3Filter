"use strict";
(function(){
    let data = ""
    let svgContainer = ""
    const measurements = {
        width: 500,
        height: 500,
        marginAll: 50
    }

    window.onload = function() {
        svgContainer = d3.select('body').append("svg")
            .attr('width', measurements.width)
            .attr('height', measurements.height);
        d3.csv("Admission_Predict.csv")
            .then((csvData) => data = csvData)
            .then(() => makeScatterPlot())
    }

    function makeScatterPlot() {
        
        let greScores = data.map((row) => parseInt(row["GRE Score"]))
        let admitChances = data.map((row) =>  parseFloat(row["Admit"]))
        
        const limits = findMinMax(greScores, admitChances)

        let scaleX = d3.scaleLinear()
            .domain([limits.greMin - 5, limits.greMax])
            .range([0 + measurements.marginAll, measurements.width - measurements.marginAll])

        let scaleY = d3.scaleLinear()
            .domain([limits.admitMax, limits.admitMin - 0.05])
            .range([0 + measurements.marginAll, measurements.height - measurements.marginAll])

        drawAxes(scaleX, scaleY)

        plotData(scaleX, scaleY)
    }

    function findMinMax(greScores, admitChances) {
        return {
            greMin: d3.min(greScores),
            greMax: d3.max(greScores),
            admitMin: d3.min(admitChances),
            admitMax: d3.max(admitChances)
        }
    }

    function drawAxes(scaleX, scaleY) {
        // these are not HTML elements. They're functions!
        let xAxis = d3.axisBottom()
            .scale(scaleX)

        let yAxis = d3.axisLeft()
            .scale(scaleY)
            
        svgContainer.append('g')
            .attr('transform', 'translate(0,450)')
            .call(xAxis)

        svgContainer.append('g')
            .attr('transform', 'translate(50, 0)')
            .call(yAxis)
    }

    function plotData(scaleX, scaleY) {
        const xMap = function(d) { return scaleX(+d["GRE Score"]) }
        const yMap = function(d) { return scaleY(+d["Admit"]) }   
        
        const circles = svgContainer.selectAll(".circle")
            .data(data)
            .enter()
            .append('circle')
                .attr('cx', xMap)
                .attr('cy', yMap)
                .attr('r', 3)
                .attr('fill', "#4286f4")
    }

})()