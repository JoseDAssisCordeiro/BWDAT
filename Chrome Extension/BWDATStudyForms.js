chrome.storage.sync.get(['userID', 'pre_study_form', 'pos_study_form', 'pre_session_form', 'pos_session_form', 'next_episode_form'], function(items) {

	if(items.pre_study_form != null){
		if(items.pre_study_form.indexOf('?') > -1)
			document.getElementById('forms').innerHTML += "<h3>Pre Study Form:</h3> <a href=\"" + items.pre_study_form + "&p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
		else
			document.getElementById('forms').innerHTML += "<h3>Pre Study Form:</h3> <a href=\"" + items.pre_study_form + "?p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
	}
	
	if(items.pre_session_form != null){
		if(items.pre_session_form.indexOf('?') > -1)
			document.getElementById('forms').innerHTML += "<h3>Pre Session Form:</h3> <a href=\"" + items.pre_session_form + "&p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
		else
			document.getElementById('forms').innerHTML += "<h3>Pre Session Form:</h3> <a href=\"" + items.pre_session_form + "?p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
	}
	
	if(items.pos_session_form != null){
		if(items.pos_session_form.indexOf('?') > -1)
			document.getElementById('forms').innerHTML += "<h3>Post Session Form:</h3> <a href=\"" + items.pos_session_form + "&p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
		else
			document.getElementById('forms').innerHTML += "<h3>Post Session Form:</h3> <a href=\"" + items.pos_session_form + "?p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
	}

	if(items.pos_study_form != null){
		if(items.pos_study_form.indexOf('?') > -1)
			document.getElementById('forms').innerHTML += "<h3>Post Study Form:</h3> <a href=\"" + items.pos_study_form + "&p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
		else
			document.getElementById('forms').innerHTML += "<h3>Post Study Form:</h3> <a href=\"" + items.pos_study_form + "?p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
	}

	if(items.next_episode_form != null){
		if(items.next_episode_form.indexOf('?') > -1)
			document.getElementById('forms').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form + "&p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
		else
			document.getElementById('forms').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form + "?p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
	}

});

//BWDAT Chrome Extension background file
//Allow-Control-Allow-Origin: * add to chrome if not working

var user_code = "";
var sessionID = "";
var sessionStarted = false;
var tabNf = [];
var browser = "Google Chrome";
var server_url2 = <server_url>;
var has_content = false;

//If a userID was not define yet a new tab will ask for it
chrome.storage.sync.get(['userID'], function(login) {
	if(typeof login.userID == 'undefined')
		chrome.tabs.create({url: "options.html"});
});

//In case of event detected by myscript.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	//Uploads userID number
	chrome.storage.sync.get(['userID', 'projectID'], function(login) {
		
		//uploads the userID number
		if(typeof login.userID !== 'undefined'){
			
			//When a new tab is opened
			if (request.type == "openedNetflix" || request.type == "openedNetflix_aux")
				//Loads project info
				updateProject(login.projectID, login.userID);

			chrome.storage.sync.get(['sessionID', 'p_start_time', 'p_finish_time', 'pre_study_form', 'pos_study_form', 'pre_session_form', 'pos_session_form', 'next_episode_form', 'has_forms', 'eps_forms', 'u_finish_time'],
			function(project) {

				//If the project is active TODO Verify User times
				if(project.p_start_time != null && new Date(project.p_start_time) < new Date()){
					//When a new tab is opened
					if (request.type == "openedNetflix" || request.type == "openedNetflix_aux") {

						//If study is over, presents end form
						if((project.p_finish_time != null && new Date(project.p_finish_time) < new Date()) || (project.u_finish_time != null && new Date(project.u_finish_time) < new Date())){
							if(project.pos_study_form != null)
								if(project.pos_study_form.indexOf('?') > -1)
									chrome.tabs.create({url: project.pos_study_form + "&p=" + login.userID, selected: true, pinned: false});
								else
									chrome.tabs.create({url: project.pos_study_form + "?p=" + login.userID, selected: true, pinned: false});
					
							chrome.tabs.create({url: chrome.runtime.getURL("BWDATHowToRemove.html"), selected: false, pinned: false});
							
							//Closes the tab to prevent possible bugs
							if(request.type == "openedNetflix_aux")
								chrome.tabs.remove(request.sender);
							else
								chrome.tabs.remove(sender.tab.id);
								
						}
						else{
							//Updates the tabId of tabs open
							if(request.type == "openedNetflix_aux")
								tabNf.push(request.sender);
							else
								tabNf.push(sender.tab.id);
							
							// If there were previous tabs open registers the action
							if(tabNf.length > 1){
								
								var dateNow = date();
								if(request.type == "openedNetflix_aux")
									Browse(dateNow, login.userID, project.sessionID, login.projectID, "Opened Tab", request.streamer, browser, request.sender);
								else
									Browse(dateNow, login.userID, project.sessionID, login.projectID, "Opened Tab", request.streamer, browser, sender.tab.id);

								//VerifyDevices(login.userID, login.projectID);
							}
							
							//If is the first tab of the session registers it in the database
							if(tabNf.length == 1){
								//Activates session
								sessionStarted = true;
								has_content = false;

								var dateNow = date();
								if(request.type == "openedNetflix_aux")
									CreateSession(login.userID, login.projectID, dateNow, request.action, request.streamer, request.sender);
								else
									CreateSession(login.userID, login.projectID, dateNow, request.action, request.streamer, sender.tab.id);

								//Opens pre-session form
								if(project.pre_session_form != null && request.action != "Login" && request.action != "Logout"){
									if(project.pre_session_form.indexOf('?') > -1)
										chrome.tabs.create({url: project.pre_session_form + "&p=" + login.userID + "&sid=" + (+project.sessionID+1), selected: true, pinned: false});
									else
										chrome.tabs.create({url: project.pre_session_form + "?p=" + login.userID + "&sid=" + (+project.sessionID+1), selected: true, pinned: false});
								}
								
								//VerifyDevices(login.userID, login.projectID);
							}
						}
					}

					//If it leaves Netflix closes the tab to prevent coming back
					if(request.type == "URLChanged"){

						removeA(tabNf, sender.tab.id);
						if(tabNf.length != 0 && sessionStarted == true){
							var dateNow = date();
							Browse(dateNow, login.userID, project.sessionID, login.projectID, "Closed Tab", request.streamer, browser, sender.tab.id);
						}
						//Updates sesstionStarted var indicating the end of the session
						if(tabNf.length == 0 && sessionStarted == true){
							sessionStarted = false;

							//Updates de database with the end of session
							var dateNow = date();
							EndSession(dateNow, login.userID, project.sessionID, login.projectID, request.streamer, browser, sender.tab.id);

							//Opens after session forms
							if(project.pos_session_form != null && has_content){
								if(project.pos_session_form.indexOf('?') > -1)
									chrome.windows.create({url: project.pos_session_form + "&p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
								else
									chrome.windows.create({url: project.pos_session_form + "?p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
								chrome.tabs.query({}, function(tabs) {
									for (var i = 0; i < tabs.length; i++) {
										if (tabs[i].title == "Back up forms")
											return;
									}
									chrome.tabs.create({url: chrome.runtime.getURL("BWDATStudyForms.html"), selected: false, pinned: true});
								});
							}
						}
					}

					//Submits an event if the episode watched is being studied
					if(request.type == "eventDetected" && sessionStarted == true){
						has_content = true;
						var dateNow = date();
						Watch(dateNow, login.userID, project.sessionID, request.eps_time, request.eps_dur, request.action, login.projectID, request.streamer, request.eps_code, request.init_time, browser, sender.tab.id);
					}

					//Login, Logut and Search
					if(request.type == "VerifyDevices"){
						//VerifyDevices(login.userID, login.projectID);
					}

					//Login, Logut and Search
					if(request.type == "Browse" && sessionStarted == true){
						var dateNow = date();
						Browse(dateNow, login.userID, project.sessionID, login.projectID, request.action, request.streamer, browser, sender.tab.id);
					}
	
					if(request.type == "nextEpisode" && sessionStarted == true) {
						if(project.next_episode_form != null){
							if(project.next_episode_form.indexOf('?') > -1)
								chrome.tabs.create({url: project.next_episode_form + "&p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
							else
								chrome.tabs.create({url: project.next_episode_form + "?p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
						}
					}

					//If viewer presses space bar key
					if(request.type == "SpaceBar" && project.has_forms == "Yes"){
						for (var i = 0; i < project.eps_forms.length; i++) {
							if(project.eps_forms[i].eps_code == request.eps_code){
								if(project.eps_forms[i].form.indexOf('?') > -1)
									chrome.tabs.create({url: project.eps_forms[i].form + "&p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
								else
									chrome.tabs.create({url: project.eps_forms[i].form + "?p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
							}
						}
					}
				}
			});
		}
		else{
			//If it was not attribued a userID it is required to give a valid one to use the Extension
			chrome.tabs.query({}, function(tabs) {
				
				//Blocks from opening a repeated BWDAT userID request tab if already opened
				for (var i = 0; i < tabs.length; i++) {
					if (tabs[i].title == "BWDAT Extension Options")
						return;
				}
				chrome.tabs.create({url: "options.html"});
			});
			
			//Closes the tab to prevent possible bugs
			chrome.tabs.remove(sender.tab.id);
		}
	});
});

async function CreateSession(userID, project_ID, time, action, streamer, tabID){
	let response = await fetch(server_url2 + "/CreateSession?userID=" + userID + "&projectID=" + project_ID + "&time=" + time + "&action=" + action + "&streamer=" + streamer + "&tabID=" + tabID, {
	  method: 'POST'
	}).catch(e => console.log(e));

	var txt = await response.text();
	if(txt != ""){
		sessionID = txt;
		chrome.storage.sync.set({ sessionID: sessionID});
	}
}

//Send /Browser data

async function Browse(time, userID, sessionID, projectID, action, streamer, browser, tabID){
	let response = await fetch(server_url2 + "/Browse" + "?time=" + time + "&userID=" + userID + "&sessionID=" + sessionID + "&projectID=" + projectID + "&action=" + action + "&streamer=" + streamer + "&browser=" + browser + "&tabID=" + tabID, {
	  method: 'POST'
	}).catch(e => console.log(e));
}

//Send /watch data

async function Watch(time, userID, sessionID, eps_time, eps_dur, action, projectID, streamer, eps_code, action_dur, browser, tabID){
	let response = await fetch(server_url2 + "/Watch" + "?time=" + time + "&userID=" + userID + "&sessionID=" + sessionID + "&eps_time=" + eps_time + "&eps_dur=" + eps_dur + "&projectID=" + projectID + "&eps_code=" + eps_code + "&action_dur= " + action_dur +"&action=" + action + "&streamer=" + streamer + "&browser=" + browser + "&tabID=" + tabID, {
	  method: 'POST'
	}).catch(e => console.log(e));
}

//End session when all streaming tabs are closed

async function EndSession(time, userID, sessionID, projectID, streamer, browser, tabID){
	let response = await fetch(server_url2 + "/EndSession" + "?time=" + time + "&userID=" + userID + "&sessionID=" + sessionID + "&projectID=" + projectID + "&streamer=" + streamer + "&browser=" + browser + "&tabID=" + tabID, {
	  method: 'POST'
	}).catch(e => console.log(e));
}

//Remove elements from array
function removeA(arr) {
    var what, a = arguments, L = a.length, ax;
    while (L > 1 && arr.length) {
        what = a[--L];
        while ((ax= arr.indexOf(what)) !== -1) {
            arr.splice(ax, 1);
        }
    }
    return arr;
}

async function updateProject(projectID, userID){
	let response = await fetch(server_url2 + "/GetForms/" + projectID + "/" + userID, {
	  method: 'POST'
	}).catch(e => console.log(e));

	var txt = await response.text();
	if(txt != ""){
		var proj_forms = JSON.parse(txt);
		console.log("hi" + proj_forms[0].u_finish_time)
		chrome.storage.sync.set({pre_study_form: proj_forms[0].pre_study_form, pos_study_form: proj_forms[0].pos_study_form, pre_session_form:proj_forms[0].pre_session_form, pos_session_form: proj_forms[0].pos_session_form, next_episode_form: proj_forms[0].next_episode_form, p_start_time : proj_forms[0].p_start_time, p_finish_time: proj_forms[0].p_finish_time, has_devices : proj_forms[0].has_devices, has_forms : proj_forms[0].forms, u_finish_time: proj_forms[0].u_finish_time});

		if(proj_forms[0].forms == "Yes")
			getEpisodesForms(projectID);
	}
}

async function getEpisodesForms(projectID){
	let response = await fetch(server_url2 + "/GetFormsEpisodes/" + projectID, {
	  method: 'POST'
	}).catch(e => console.log(e));

	var txt = await response.text();
	if(txt != ""){
		var proj_forms = JSON.parse(txt);
		chrome.storage.sync.set({eps_forms: proj_forms});
	}
}

/*

//Send a request to the DB with the params in str
function VerifyDevices (userID, projectID) {
	
	var xhttp;
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			
			txt = xhttp.responseText;
			if(txt != "[]"){
				var devices = JSON.parse(txt);
				for (var i = 0; i < devices.length; i++) {
					if(devices[i].maximo != null){
						var device = new Date(devices[i].maximo);
						device.setSeconds(device.getSeconds() + 8);
						device.setHours(device.getHours() + (new Date().getTimezoneOffset() / 60));
						var atual = new Date();
						if(device < atual){
							alert("No heart rate data is collected from device #" + devices[i].device_id + ", press start in the BWDAT app or check your internet connection.");
							break;
						}
						else
							if(devices[i].battery < 10){
								alert("Warning! Low battery of your smartwatch.");
								break;
							}
							else
								break;
					}
					else{
						alert("No heart rate data is collected from device #" + devices[i].device_id + ", press start in the BWDAT app or check your internet connection.");
					}
				}
			}
		}
	};
	
	var dateNow = date();
	xhttp.open("POST", server_url);
	xhttp.send("request=ReadDevicesLastData&projectID=" + projectID + "&userID=" + userID + "&time=" + dateNow);
}
*/
function date(){
	var date = new Date();
	return date.getFullYear() + "-" + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}
var aux_id;
var another_pin = false;

chrome.tabs.query({pinned: true}, function(tabs) {
	for (var i = 0; i < tabs.length; i++) {
		if (tabs[i].title == "Back up forms"){
			if(another_pin){
				chrome.tabs.remove(aux_id);
			}
			another_pin = true;
			aux_id = tabs[i].id;
		}
	}
	another_pin = false;
});