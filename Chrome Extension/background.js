//BWDAT Chrome Extension background file
//Allow-Control-Allow-Origin: * add to chrome if not working

var sessionID = "";
var sessionStarted = false;
var tabNf = [];
var browser = "Google Chrome";
var server_url = <server_url>;

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
			if (request.type == "openedNetflix")
				//Loads project info
				updateProject(login.projectID);

			chrome.storage.sync.get(['sessionID', 'p_start_time', 'p_finish_time', 'pre_study_form', 'pos_study_form', 'pre_session_form', 'pos_session_form', 'next_episode_form' ],
			function(project) {
			
				//If the project is active TODO Verify User times
				if(project.p_start_time != null && new Date(project.p_start_time) < new Date()){
					//When a new tab is opened
					if (request.type == "openedNetflix") {
						//Opens the pinned tab with the forms if it is not opened
						if(project.pre_study_form != null || project.pos_study_form != null || project.pre_session_form != null || project.pos_session_form != null || project.next_episode_form != null)
							chrome.tabs.query({}, function(tabs) {
								for (var i = 0; i < tabs.length; i++) {
									if (tabs[i].title == "Back up forms")
										return;
								}
								chrome.tabs.create({url: chrome.runtime.getURL("BWDATStudyForms.html"), selected: false, pinned: true});
							});

						//If study is over, presents end form
						if(project.p_finish_time != null && new Date(project.p_finish_time) < new Date()){
							if(project.pos_study_form != null)
								if(project.pos_study_form.indexOf('?') > -1)
									chrome.tabs.create({url: project.pos_study_form + "&p=" + login.userID, selected: true, pinned: false});
								else
									chrome.tabs.create({url: project.pos_study_form + "?p=" + login.userID, selected: true, pinned: false});
					
							chrome.tabs.create({url: chrome.runtime.getURL("BWDATHowToRemove.html"), selected: false, pinned: false});
							
							//Closes the tab to prevent possible bugs
							chrome.tabs.remove(sender.tab.id);
						}
						else{
							//Updates the tabId of tabs open
							tabNf.push(sender.tab.id);
							
							// If there were previous tabs open registers the action
							if(tabNf.length > 1){
								
								var dateNow = date();
								SendRequest("request=Browse&time=" + dateNow + "&userID=" + login.userID + "&sessionID=" + project.sessionID + "&projectID=" + login.projectID + "&action=Opened Tab" + "&streamer=" + request.streamer + "&browser=" + browser);

								VerifyDevices(login.userID, login.projectID);
							}
							
							//If is the first tab of the session registers it in the database
							if(tabNf.length == 1){
								//Activates session
								sessionStarted = true;
								
								var dateNow = date();
								CreateSession("request=InitSession&userID=" + login.userID + "&time=" + dateNow + "&projectID=" + login.projectID + "&action=" + request.action + "&streamer=" + request.streamer);

								//Opens pre-session form
								if(project.pre_session_form != null){
									if(project.pre_session_form.indexOf('?') > -1)
										chrome.tabs.create({url: project.pre_session_form + "&p=" + login.userID + "&sid=" + (+project.sessionID+1), selected: true, pinned: false});
									else
										chrome.tabs.create({url: project.pre_session_form + "?p=" + login.userID + "&sid=" + (+project.sessionID+1), selected: true, pinned: false});
								}
								
								VerifyDevices(login.userID, login.projectID);
							}
						}
					}

					//If it leaves Netflix closes the tab to prevent coming back
					if(request.type == "URLChanged"){

						removeA(tabNf, sender.tab.id);
						if(tabNf.length != 0 && sessionStarted == true){
							var dateNow = date();
							SendRequest("request=Browse&time=" + dateNow + "&userID=" + login.userID + "&sessionID=" + project.sessionID + "&projectID=" + login.projectID + "&action=Closed Tab" + "&streamer=" + request.streamer + "&browser=" + browser);
						}
						//Updates sesstionStarted var indicating the end of the session
						if(tabNf.length == 0 && sessionStarted == true){
							sessionStarted = false;

							//Updates de database with the end of session
							var dateNow = date();
							SendRequest("request=EndSession&time=" + dateNow + "&userID=" + login.userID + "&sessionID=" + project.sessionID + "&projectID=" + login.projectID + "&streamer=" + request.streamer + "&browser=" + browser);

							//Opens after session forms
							if(project.pos_session_form != null){
								if(project.pos_session_form.indexOf('?') > -1)
									chrome.windows.create({url: project.pos_session_form + "&p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
								else
									chrome.windows.create({url: project.pos_session_form + "?p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
								chrome.tabs.create({url: chrome.runtime.getURL("BWDATStudyForms.html"), selected: false, pinned: true});
							}
						}
					}

					//Submits an event if the episode watched is being studied
					if(request.type == "eventDetected" && sessionStarted == true){
						var dateNow = date();
						SendRequest("request=InsertEvent&time=" + dateNow + "&userID=" + login.userID + "&sessionID=" + project.sessionID + "&eps_time=" + request.eps_time + "&eps_dur=" + request.eps_dur + "&action=" + request.action + "&projectID=" + login.projectID + "&streamer=" + request.streamer + "&eps_code=" + request.eps_code + "&action_dur=" + request.init_time + "&browser=" + browser);
					}

					//Login, Logut and Search
					if(request.type == "VerifyDevices"){
						VerifyDevices(login.userID, login.projectID);
					}
					
					//Login, Logut and Search
					if(request.type == "Browse" && sessionStarted == true){
						var dateNow = date();
						SendRequest("request=Browse&time=" + dateNow + "&userID=" + login.userID + "&sessionID=" + project.sessionID + "&projectID=" + login.projectID + "&action=" + request.action + "&streamer=" + request.streamer + "&browser=" + browser);
					}
	
					if(request.type == "nextEpisode" && sessionStarted == true) {
						if(project.next_episode_form != null){
							if(project.next_episode_form.indexOf('?') > -1)
								chrome.tabs.create({url: project.next_episode_form + "&p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
							else
								chrome.tabs.create({url: project.next_episode_form + "?p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
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

//Send a request to the DB with the params in str
function CreateSession (str) {
	
	var xhttp;
	xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			
			//returns the response from the server with the session ID
			sessionID = xhttp.responseText;	
			chrome.storage.sync.set({ sessionID: sessionID});
		}
	};
	
	xhttp.open("POST", server_url, true);
	xhttp.send(str);
}

//Send a request to the DB with the params in str
function SendRequest (str) {
	
	var xhttp;
	
	xhttp = new XMLHttpRequest();	
	xhttp.open("POST", server_url, true);
	xhttp.send(str);
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

function updateProject (projectID) {
	
	var xhttp;
	var txt;
	xhttp = new XMLHttpRequest();
	
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			
			txt = xhttp.responseText;
			var proj_forms = JSON.parse(txt);
			chrome.storage.sync.set({ pre_study_form: proj_forms[0].pre_study_form, pos_study_form: proj_forms[0].pos_study_form, pre_session_form:proj_forms[0].pre_session_form, pos_session_form: proj_forms[0].pos_session_form, next_episode_form: proj_forms[0].next_episode_form, p_start_time : proj_forms[0].p_start_time, p_finish_time: proj_forms[0].p_finish_time});
		}
	};
	
	xhttp.open("POST", server_url, true);
	xhttp.send("request=GetForms&project=" + projectID);

}


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

function date(){
	var date = new Date();
	return date.getFullYear() + "-" + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
}