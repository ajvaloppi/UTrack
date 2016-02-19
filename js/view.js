'use strict';

// Put your view code here (e.g., the graph renderering code)

var makeTable = function (activityTotals){
    var tableDiv = document.getElementById("analysisTableDiv");
    var html = "<table border='1' id='analysisTable'><th>Activity</th><th>Total Time Spent</th>";

    var activity;
    for (activity in activityTotals){
        html += "<tr><td>"+ activityTotals[activity].activityType +"</td><td>"+ activityTotals[activity].timeTotal +" minutes</td></tr>";
    }

    html += "</table>"
    tableDiv.innerHTML = html;
}

var makeList = function (activityDatas) {
    var listDiv = document.getElementById("analysisListDiv");
    var html = "<table border='1' id='analysisList'><th>Activity</th><th>Date Submitted</th>";

    var activity;
    for (activity in activityDatas){
        //going in reverse to get approx the opposite order of submission, as users generally want to see the most current data first
        var current = activityDatas[activityDatas.length - activity - 1];

        html += "<tr><td>"+ current.activityType +"</td><td>"+ current.dateSubmitted.toDateString() +" at " + current.dateSubmitted.toLocaleTimeString() +"</td></tr>";
    }

    html += "</table>";
    listDiv.innerHTML = html;
}

var makeGraph = function (activityTotals) {
    var graphCanvas = document.getElementById("graphCanvas");
    var graph = graphCanvas.getContext("2d");

    var yAxis = 150;
    var xAxis = 30;
    var legend = 150;

    var barHeight = 15;
    var barWidth = (graphCanvas.width - yAxis - legend) / 5;

    graphCanvas.height = Math.max((_.size(activityTotals)*3*barHeight) + xAxis, 100);

    var energyColour = "#FFCC00";
    var stressColour = "#0000FF";
    var happinessColour = "#FF0000";

    var position = 0;

    var activity;
    for (activity in activityTotals){
        var current = activityTotals[activity];

        //calculate averages
        var energyAverage = current.energyTotal / current.instances;
        var stressAverage = current.stressTotal / current.instances;
        var happinessAverage = current.happinessTotal / current.instances;

        //averages bars
        graph.fillStyle = energyColour;
        graph.fillRect(yAxis, position, barWidth * energyAverage, barHeight);

        graph.fillStyle = stressColour;
        graph.fillRect(yAxis, position + barHeight, barWidth * stressAverage, barHeight);

        graph.fillStyle = happinessColour;
        graph.fillRect(yAxis, position + 2* barHeight, barWidth * happinessAverage, barHeight);

        //bar end lines
        graph.fillStyle = "black";
        graph.moveTo(barWidth * energyAverage + yAxis, position)
        graph.lineTo(barWidth * energyAverage + yAxis, barHeight + position);
        graph.stroke();

        graph.moveTo(barWidth * stressAverage + yAxis, position+barHeight)
        graph.lineTo(barWidth * stressAverage + yAxis, 2*barHeight + position);
        graph.stroke();

        graph.moveTo(barWidth * happinessAverage + yAxis, position+ 2*barHeight)
        graph.lineTo(barWidth * happinessAverage + yAxis, 3*barHeight + position);
        graph.stroke();

        //horizontal graph lines
        graph.moveTo(0, position)
        graph.lineTo(graphCanvas.width - legend, position);
        graph.stroke();

        graph.moveTo(yAxis, position+barHeight)
        graph.lineTo(graphCanvas.width - legend, position+barHeight);
        graph.stroke();

        graph.moveTo(yAxis, position+ 2*barHeight)
        graph.lineTo(graphCanvas.width - legend, position+ 2*barHeight);
        graph.stroke();

        //y axis labels
        graph.font = "15px Arial";
        graph.fillText(current.activityType, 5, position + barHeight);

        position += 3*barHeight;
    }

    graph.fillStyle = "black";
    graph.moveTo(0, position)
    graph.lineTo(graphCanvas.width - legend, position);
    graph.stroke();

    //vertical graph lines
    graph.moveTo(yAxis, 0)
    graph.lineTo(yAxis, graphCanvas.height - xAxis);
    graph.stroke();

    if (graphCanvas.height === 100){
        var xAxisLabel = graphCanvas.height - xAxis - 10;
    }
    else {
        var xAxisLabel = graphCanvas.height - xAxis/2;
    }

    graph.moveTo(barWidth + yAxis, 0)
    graph.lineTo(barWidth + yAxis, xAxisLabel);
    graph.stroke();

    graph.moveTo(2*barWidth + yAxis, 0)
    graph.lineTo(2*barWidth + yAxis, xAxisLabel);
    graph.stroke();

    graph.moveTo(3*barWidth + yAxis, 0)
    graph.lineTo(3*barWidth + yAxis, xAxisLabel);
    graph.stroke();

    graph.moveTo(4*barWidth + yAxis, 0)
    graph.lineTo(4*barWidth + yAxis, xAxisLabel);
    graph.stroke();

    graph.moveTo(5*barWidth + yAxis, 0)
    graph.lineTo(5*barWidth + yAxis, xAxisLabel);
    graph.stroke();

    //x axis labels
    graph.font = "15px Arial";
    graph.fillText("1", yAxis + barWidth - 5, position + barHeight + xAxis/2 - 1);
    graph.fillText("2", yAxis + 2*barWidth - 5, position + barHeight + xAxis/2 - 1);
    graph.fillText("3", yAxis + 3*barWidth - 5, position + barHeight + xAxis/2 - 1);
    graph.fillText("4", yAxis + 4*barWidth - 5, position + barHeight + xAxis/2 - 1);
    graph.fillText("5", yAxis + 5*barWidth - 5, position + barHeight + xAxis/2 - 1);

    //legend
    var paddingLabels = 25;
    var leftPaddingSquares = 15;
    var topPaddingSquares = 10;
    var squareSize = 10;


    graph.fillText("Legend", graphCanvas.width - legend + 50, 20);
    graph.font = "12px Arial";
    graph.fillText(" = Energy Level", graphCanvas.width - legend + paddingLabels, paddingLabels + barHeight);
    graph.fillText(" = Stress Level", graphCanvas.width - legend + paddingLabels, paddingLabels + 2*barHeight);
    graph.fillText(" = Happiness Level", graphCanvas.width - legend + paddingLabels, paddingLabels + 3*barHeight);
    graph.font = "10px Arial";
    graph.fillText("(1 = low level, 5 = high level)", graphCanvas.width - legend + leftPaddingSquares, paddingLabels + 4* barHeight);

    graph.fillStyle = energyColour;
    graph.fillRect(graphCanvas.width - legend + topPaddingSquares, leftPaddingSquares + barHeight, squareSize, squareSize);
    graph.fillStyle = "black";
    graph.strokeRect(graphCanvas.width - legend + topPaddingSquares, leftPaddingSquares + barHeight, squareSize, squareSize);

    graph.fillStyle = stressColour;
    graph.fillRect(graphCanvas.width - legend + topPaddingSquares, leftPaddingSquares + 2*barHeight, squareSize, squareSize);
    graph.fillStyle = "black";
    graph.strokeRect(graphCanvas.width - legend + topPaddingSquares, leftPaddingSquares + 2*barHeight, squareSize, squareSize);

    graph.fillStyle = happinessColour;
    graph.fillRect(graphCanvas.width - legend + topPaddingSquares, leftPaddingSquares + 3*barHeight, squareSize, squareSize);
    graph.fillStyle = "black";
    graph.strokeRect(graphCanvas.width - legend + topPaddingSquares, leftPaddingSquares + 3*barHeight, squareSize, squareSize);
}

/**
 *  TabView  
 */
var TabView = function(model) {
    // Obtains itself   
    var self = this;

    // Stores the model
    this.model = model;

    // Available tabs and divs
    this.nav_input_tab = document.getElementById('nav-input-tab');
    this.input_div = document.getElementById('input-div');

    this.nav_analysis_tab = document.getElementById('nav-analysis-tab');
    this.analysis_div = document.getElementById('analysis-div');

    this.linkToAll = document.getElementById('linkToAll');
    this.linkToInput = document.getElementById('linktoInput');

    // Binds tab view with model  
    this.nav_input_tab.addEventListener('click', function() {
        model.selectTab('InputTab');
    });

    this.nav_analysis_tab.addEventListener('click', function() {
        model.selectTab('AnalysisTab');
    });

    this.linkToAll.addEventListener('click', function() {
        model.selectTab('AnalysisTab');
    });

    this.linkToInput.addEventListener('click', function () {
        model.selectTab('InputTab');
    });

    // Binds model change with view
    this.model.addListener(function(eventType, eventTime, eventData) {
        if (eventType === TAB_SELECTED_EVENT)   {
            switch (eventData) {
                case 'InputTab':
                    self.nav_input_tab.className = "active";
                    self.nav_analysis_tab.className = "";
                    self.input_div.className = '';
                    self.analysis_div.className = 'hidden';
                    break;
                case 'AnalysisTab':
                    self.nav_analysis_tab.className = "active";
                    self.nav_input_tab.className = "";
                    self.input_div.className = 'hidden';
                    self.analysis_div.className = '';
                    break;
            }
        }
    });
}

/**
 *  GraphView  
 */
var GraphView = function(model) {
    var self = this;

    this.model = model;

    this.tableRadio = document.getElementById('tableRadio');
    this.tableDiv = document.getElementById('analysisTableDiv');

    this.graphRadio = document.getElementById('graphRadio');
    this.graphDiv = document.getElementById('analysisGraphDiv');

    this.listRadio = document.getElementById('listRadio');
    this.listDiv = document.getElementById('analysisListDiv');

    this.linkToAll = document.getElementById('linkToAll');

    this.tableRadio.addEventListener('click', function() {
        model.selectGraph('Table');
    });

    this.graphRadio.addEventListener('click', function() {
        model.selectGraph('Graph');
    });

    this.listRadio.addEventListener('click', function() {
        model.selectGraph('List');
    });

    this.linkToAll.addEventListener('click', function() {
        model.selectGraph('List');
    });

    this.model.addListener(function(eventType, eventTime, eventData) {
        if (eventType === GRAPH_SELECTED_EVENT)   {
            switch (eventData) {
                case 'Table':
                    self.tableDiv.classList.remove("hidden");
                    self.graphDiv.classList.add("hidden");
                    self.listDiv.classList.add("hidden");

                    self.tableRadio.checked = true;
                    break;
                case 'Graph':
                    self.graphDiv.classList.remove("hidden");
                    self.tableDiv.classList.add("hidden");
                    self.listDiv.classList.add("hidden");

                    self.graphRadio.checked = true;
                    break;
                case 'List':
                    self.listDiv.classList.remove("hidden");
                    self.graphDiv.classList.add("hidden");
                    self.tableDiv.classList.add("hidden");

                    self.listRadio.checked = true;
                    break;    
            }
        }
    });
}