'use strict';

/*
Put any interaction code here
 */

 window.addEventListener('load', function() {
  	// You should wire up all of your event handling code here, as well as any
  	// code that initiates calls to manipulate the DOM (as opposed to responding
  	// to events)
    var activityModel = new ActivityCollectionModel();

  	// Instantiate a TabView and a TabModel, then bind them together.
  	var tabView = new TabView(new TabModel()); 
    var graphView = new GraphView(new GraphModel());

  	updateActivityList(activityModel);


  	activityModel.addListener(function(eventType, eventTime, eventData) {
  		if (eventType === ACTIVITY_DATA_ADDED_EVENT)   {
  			//update date
  			var lastSubmittedDiv = document.getElementById("lastSubmitted");

  			lastSubmittedDiv.innerHTML = "Last submitted on " + eventData.dateSubmitted.toDateString() + " at " + eventData.dateSubmitted.toLocaleTimeString();

  			// reset input
  			document.querySelector('input[value="' + activityModel.activityList[0] +'"]').checked = true;
  			document.getElementById("newActivityType").value = "";
  			document.getElementById("energyLevel").value = "";
  			document.getElementById("stressLevel").value = "";
  			document.getElementById("happinessLevel").value = "";
  			document.getElementById("timeSpent").value = "";

  			activityModel.updateActivityTotals(eventData.activityType, eventData.activityDataDict.energyLevel, eventData.activityDataDict.stressLevel, eventData.activityDataDict.happinessLevel, eventData.activityDurationInMinutes);

        makeTable(activityModel.activityTotals);
        makeList(activityModel.activityDatas);
        makeGraph(activityModel.activityTotals);
        var noData = document.getElementById('noData');
        noData.classList.add("hidden");

        var analysisWithData = document.getElementById('analysisWithData');
        analysisWithData.classList.remove("hidden");

  		}

  	});

  	var submitBtn = document.getElementById('submitButton');

  	submitBtn.addEventListener('click', function() {
  		
  		//gather all the information
  		var type = document.querySelector('input[name="activityType"]:checked').value;
  		var energy = Number(document.getElementById("energyLevel").value);
  		var stress = Number(document.getElementById("stressLevel").value);
  		var happiness = Number(document.getElementById("happinessLevel").value);
  		var time = Number(document.getElementById("timeSpent").value);

  		//verification
  		var warning = false;
  		var newType = false;

  		if (energy === 0){
  			warning = true;
  			document.getElementById("energyWarning").classList.remove("hidden");
  		}
  		else {
  			document.getElementById("energyWarning").classList.add("hidden");
  		}

  		if (stress === 0) {
  			warning = true;
  			document.getElementById("stressWarning").classList.remove("hidden");
  		}
  		else {
  			document.getElementById("stressWarning").classList.add("hidden");
  		}

  		if (happiness === 0){
  			warning = true;
  			document.getElementById("happinessWarning").classList.remove("hidden");
  		}
  		else {
  			document.getElementById("happinessWarning").classList.add("hidden");
  		}

  		if (time <= 0){
  			warning = true;
  			document.getElementById("timeWarning").classList.remove("hidden");
  		}
  		else {
  			document.getElementById("timeWarning").classList.add("hidden");
  		}

  		if (type === "new"){
  			//see if text field is filled
  			type = document.getElementById("newActivityType").value;
  			if (type === ""){
  				warning = true;
  				document.getElementById("typeWarning").classList.remove("hidden");
  			}
  			else {

  				var activityType;
  				var exists = false;
  				//check if activity type already exists
  				for (activityType in activityModel.activityList){
  					if (activityModel.activityList[activityType] === type){
  						warning = true;
  						exists = true;
  						document.getElementById("typeWarning").classList.remove("hidden");
  						break;
  					}
  				}
  				if (!exists){
  					document.getElementById("typeWarning").classList.add("hidden");
  					newType = true;
  				}
  			}
  		}
  		else {
  			document.getElementById("typeWarning").classList.add("hidden");
  		}

  		if (!warning) {
  			//package up the DataPoint
  			var now = new Date();
  			var levels = {
  				energyLevel: energy,
  				stressLevel: stress,
  				happinessLevel: happiness
  			}
  			if (newType){
  				activityModel.addNewActivityType(type);
  				updateActivityList(activityModel);
  			}
        var id = activityModel.currentID ++;
  			var newActivity = new ActivityData(type, levels, time, now, id);
  			activityModel.addActivityDataPoint(newActivity);
  		}
  	});

	//generateFakeData(activityModel, 5);
});



var updateActivityList = function (activityModel){
	var activityListDiv = document.getElementById("activityList");

	var activity;

	var html = "<div>Please choose a type of activity</div><form id='activityType'>"

	for (activity in activityModel.activityList){
		var type = activityModel.activityList[activity];

		if (activity == 0){
			html += "<input type='radio' name='activityType' value='" +type+ "' checked> " +type+"</br>"
		}
		else {
			html += "<input type='radio' name='activityType' value='" +type+ "'> " +type+"</br>"
		}
	}  

	html += "<input type='radio' name='activityType' value='new'><strong> OR</strong><span> add a new activity<input type='text' id='newActivityType'> </br> <span class='warning hidden' id='typeWarning'><span class='glyphicon glyphicon-exclamation-sign'></span> Please enter a new activity!</span>"		

	activityListDiv.innerHTML = html;
}













