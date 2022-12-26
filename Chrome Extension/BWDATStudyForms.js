chrome.storage.sync.get(['userID', 'pre_study_form', 'pos_study_form', 'pre_session_form', 'pos_session_form', 'next_episode_form', 'pre_session_form_netflix', 'pos_session_form_netflix', 'next_episode_form_netflix', 'pre_session_form_youtube', 'pos_session_form_youtube', 'next_episode_form_youtube', 'pre_session_form_amazonprime', 'pos_session_form_amazonprime', 'next_episode_form_amazonprime', 'pre_session_form_disneyplus', 'pos_session_form_disneyplus', 'next_episode_form_disneyplus', 'pre_session_form_hbomax', 'pos_session_form_hbomax', 'next_episode_form_hbomax'], function(items) {

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

	if(items.next_episode_form != null){
		if(items.next_episode_form.indexOf('?') > -1)
			document.getElementById('forms').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form + "&p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
		else
			document.getElementById('forms').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form + "?p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
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

	//Netflix
	if(items.pre_session_form_netflix != null || items.pos_session_form_netflix != null || items.next_episode_form_netflix != null)
		document.getElementById('forms_netflix').innerHTML += "<h2>Netflix Forms:</h2>";
	if(items.pre_session_form_netflix != null){
		if(items.pre_session_form_netflix.indexOf('?') > -1)
			document.getElementById('forms_netflix').innerHTML += "<h3>Pre Session Form:</h3> <a href=\"" + items.pre_session_form_netflix + "&p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
		else
			document.getElementById('forms_netflix').innerHTML += "<h3>Pre Session Form:</h3> <a href=\"" + items.pre_session_form_netflix + "?p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
	}
	if(items.next_episode_form_netflix != null){
		if(items.next_episode_form_netflix.indexOf('?') > -1)
			document.getElementById('forms_netflix').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form_netflix + "&p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
		else
			document.getElementById('forms_netflix').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form_netflix + "?p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
	}
	if(items.pos_session_form_netflix != null){
		if(items.pos_session_form_netflix.indexOf('?') > -1)
			document.getElementById('forms_netflix').innerHTML += "<h3>Post Session Form:</h3> <a href=\"" + items.pos_session_form_netflix + "&p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
		else
			document.getElementById('forms_netflix').innerHTML += "<h3>Post Session Form:</h3> <a href=\"" + items.pos_session_form_netflix + "?p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
	}

	//YouTube
	if(items.pre_session_form_youtube != null || items.pos_session_form_youtube != null || items.next_episode_form_youtube != null)
		document.getElementById('forms_youtube').innerHTML += "<h2>YouTube Forms:</h2>";
	if(items.pre_session_form_youtube != null){
		if(items.pre_session_form_youtube.indexOf('?') > -1)
			document.getElementById('forms_youtube').innerHTML += "<h3>Pre Session Form:</h3> <a href=\"" + items.pre_session_form_youtube + "&p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
		else
			document.getElementById('forms_youtube').innerHTML += "<h3>Pre Session Form:</h3> <a href=\"" + items.pre_session_form_youtube + "?p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
	}
	if(items.next_episode_form_youtube != null){
		if(items.next_episode_form_youtube.indexOf('?') > -1)
			document.getElementById('forms_youtube').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form_youtube + "&p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
		else
			document.getElementById('forms_youtube').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form_youtube + "?p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
	}
	if(items.pos_session_form_youtube != null){
		if(items.pos_session_form_youtube.indexOf('?') > -1)
			document.getElementById('forms_youtube').innerHTML += "<h3>Post Session Form:</h3> <a href=\"" + items.pos_session_form_youtube + "&p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
		else
			document.getElementById('forms_youtube').innerHTML += "<h3>Post Session Form:</h3> <a href=\"" + items.pos_session_form_youtube + "?p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
	}

	//Amazon Prime
	if(items.pre_session_form_amazonprime != null || items.pos_session_form_amazonprime != null || items.next_episode_form_amazonprime != null)
		document.getElementById('forms_amazonprime').innerHTML += "<h2>Amazon Prime Forms:</h2>";
	if(items.pre_session_form_amazonprime != null){
		if(items.pre_session_form_amazonprime.indexOf('?') > -1)
			document.getElementById('forms_amazonprime').innerHTML += "<h3>Pre Session Form:</h3> <a href=\"" + items.pre_session_form_amazonprime + "&p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
		else
			document.getElementById('forms_amazonprime').innerHTML += "<h3>Pre Session Form:</h3> <a href=\"" + items.pre_session_form_amazonprime + "?p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
	}
	if(items.next_episode_form_amazonprime != null){
		if(items.next_episode_form_amazonprime.indexOf('?') > -1)
			document.getElementById('forms_amazonprime').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form_amazonprime + "&p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
		else
			document.getElementById('forms_amazonprime').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form_amazonprime + "?p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
	}
	if(items.pos_session_form_amazonprime != null){
		if(items.pos_session_form_amazonprime.indexOf('?') > -1)
			document.getElementById('forms_amazonprime').innerHTML += "<h3>Post Session Form:</h3> <a href=\"" + items.pos_session_form_amazonprime + "&p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
		else
			document.getElementById('forms_amazonprime').innerHTML += "<h3>Post Session Form:</h3> <a href=\"" + items.pos_session_form_amazonprime + "?p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
	}

	//Disney+
	if(items.pre_session_form_disneyplus != null || items.pos_session_form_disneyplus != null || items.next_episode_form_disneyplus != null)
		document.getElementById('forms_disneyplus').innerHTML += "<h2>Disney+ Forms:</h2>";
	if(items.pre_session_form_disneyplus != null){
		if(items.pre_session_form_disneyplus.indexOf('?') > -1)
			document.getElementById('forms_disneyplus').innerHTML += "<h3>Pre Session Form:</h3> <a href=\"" + items.pre_session_form_disneyplus + "&p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
		else
			document.getElementById('forms_disneyplus').innerHTML += "<h3>Pre Session Form:</h3> <a href=\"" + items.pre_session_form_disneyplus + "?p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
	}
	if(items.next_episode_form_disneyplus != null){
		if(items.next_episode_form_disneyplus.indexOf('?') > -1)
			document.getElementById('forms_disneyplus').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form_disneyplus + "&p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
		else
			document.getElementById('forms_disneyplus').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form_disneyplus + "?p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
	}
	if(items.pos_session_form_disneyplus != null){
		if(items.pos_session_form_disneyplus.indexOf('?') > -1)
			document.getElementById('forms_disneyplus').innerHTML += "<h3>Post Session Form:</h3> <a href=\"" + items.pos_session_form_disneyplus + "&p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
		else
			document.getElementById('forms_disneyplus').innerHTML += "<h3>Post Session Form:</h3> <a href=\"" + items.pos_session_form_disneyplus + "?p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
	}

	//HBO Max
	if(items.pre_session_form_hbomax != null || items.pos_session_form_hbomax != null || items.next_episode_form_hbomax != null)
		document.getElementById('forms_hbomax').innerHTML += "<h2>HBO Max Forms:</h2>";
	if(items.pre_session_form_hbomax != null){
		if(items.pre_session_form_hbomax.indexOf('?') > -1)
			document.getElementById('forms_hbomax').innerHTML += "<h3>Pre Session Form:</h3> <a href=\"" + items.pre_session_form_hbomax + "&p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
		else
			document.getElementById('forms_hbomax').innerHTML += "<h3>Pre Session Form:</h3> <a href=\"" + items.pre_session_form_hbomax + "?p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
	}
	if(items.next_episode_form_hbomax != null){
		if(items.next_episode_form_hbomax.indexOf('?') > -1)
			document.getElementById('forms_hbomax').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form_hbomax + "&p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
		else
			document.getElementById('forms_hbomax').innerHTML += "<h3>Next Episode Form:</h3> <a href=\"" + items.next_episode_form_hbomax + "?p=" + items.userID + "\" target=\"_blank\">Link</a></p>";
	}
	if(items.pos_session_form_hbomax != null){
		if(items.pos_session_form_hbomax.indexOf('?') > -1)
			document.getElementById('forms_hbomax').innerHTML += "<h3>Post Session Form:</h3> <a href=\"" + items.pos_session_form_hbomax + "&p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
		else
			document.getElementById('forms_hbomax').innerHTML += "<h3>Post Session Form:</h3> <a href=\"" + items.pos_session_form_hbomax + "?p=" + items.userID + "\" target=\"_blank\">Link</a><br>";
	}
	
});

//BWDAT Chrome Extension background file
//Allow-Control-Allow-Origin: * add to chrome if not working

var browser = "Google Chrome";
var server_url = <server_url>;
var user_code = "";
var sessionID = "";
var sessionStarted = false;

var tabNf = [];
var tabNNetflix = [];
var tabNYouTube = [];
var tabNAmazonPrime = [];
var tabNDisneyPlus = [];
var tabNHBOMax = [];

var has_content = false;
var has_content_netflix = false;
var has_content_youtube = false;
var has_content_amazonprime = false;
var has_content_disneyplus = false;
var has_content_hbomax = false;

var lastTabClosed = 0;
var lastTabClosed_netflix = 0;
var lastTabClosed_youtube = 0;
var lastTabClosed_amazonprime = 0;
var lastTabClosed_disneyplus = 0;
var lastTabClosed_hbomax = 0;

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
			if (request.type == "openedTab" || request.type == "openedTab_aux")
				//Loads project info
				updateProject(login.projectID, login.userID);

			chrome.storage.sync.get(['sessionID', 'p_start_time', 'p_finish_time', 'pre_study_form', 'pos_study_form', 'pre_session_form', 'pos_session_form', 'pre_session_form_netflix', 'pos_session_form_netflix', 'pre_session_form_youtube', 'pos_session_form_youtube', 'pre_session_form_amazonprime', 'pos_session_form_amazonprime', 'pre_session_form_disneyplus', 'pos_session_form_disneyplus', 'pre_session_form_hbomax', 'pos_session_form_hbomax', 'next_episode_form', 'next_episode_form_netflix', 'next_episode_form_youtube', 'next_episode_form_amazonprime', 'next_episode_form_disneyplus', 'next_episode_form_hbomax', 'has_forms', 'eps_forms', 'u_finish_time', 'netflix', 'youtube', 'amazonprime', 'disneyplus', 'hbo'],
			function(project) {

				//If the project is active TODO Verify User times
				if(project.p_start_time != null && new Date(project.p_start_time) < new Date() && ((project.netflix == 'Yes' ? request.streamer == 'Netflix' : false) || (project.youtube == 'Yes' ? request.streamer == 'YouTube' : false) || (project.amazonprime == 'Yes' ? request.streamer == 'Amazon Prime' : false) || (project.disneyplus == 'Yes' ? request.streamer == 'Disney+' : false) || (project.hbo == 'Yes' ? request.streamer == 'HBO' : false))){
					
					//When a new tab is opened
					if (request.type == "openedTab" || request.type == "openedTab_aux") {

						//If study is over, presents end form
						if((project.p_finish_time != null && new Date(project.p_finish_time) < new Date()) || (project.u_finish_time != null && new Date(project.u_finish_time) < new Date())){
							if(project.pos_study_form != null)
								if(project.pos_study_form.indexOf('?') > -1)
									chrome.tabs.create({url: project.pos_study_form + "&p=" + login.userID, selected: true, pinned: false});
								else
									chrome.tabs.create({url: project.pos_study_form + "?p=" + login.userID, selected: true, pinned: false});
					
							chrome.tabs.create({url: chrome.runtime.getURL("BWDATHowToRemove.html"), selected: false, pinned: false});
							
							//Closes the tab to prevent possible bugs
							if(request.type == "openedTab_aux")
								chrome.tabs.remove(request.sender);
							else
								chrome.tabs.remove(sender.tab.id);
								
						}
						else{
							//Updates the tabId of tabs open
							if(request.type == "openedTab_aux"){
								tabNf.push(request.sender);
								if(request.streamer == "Netflix")
									tabNNetflix.push(request.sender);
								if(request.streamer == 'YouTube')
									tabNYouTube.push(request.sender);
								if(request.streamer == 'Amazon Prime')
									tabNAmazonPrime.push(request.sender);
								if(request.streamer == 'Disney+')
									tabNDisneyPlus.push(request.sender);
								if(request.streamer == 'HBO')
									tabNHBOMax.push(request.sender);
								
							}
							else{
								tabNf.push(sender.tab.id);
								if(request.streamer == "Netflix")
									tabNNetflix.push(sender.tab.id);
								if(request.streamer == 'YouTube')
									tabNYouTube.push(sender.tab.id);
								if(request.streamer == 'Amazon Prime')
									tabNAmazonPrime.push(sender.tab.id);
								if(request.streamer == 'Disney+')
									tabNDisneyPlus.push(sender.tab.id);
								if(request.streamer == 'HBO')
									tabNHBOMax.push(sender.tab.id);
							}
							
							// If there were previous tabs open registers the action
							if(tabNf.length > 1){
								
								var dateNow = date();
								if(request.type == "openedTab_aux")
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
								if(request.type == "openedTab_aux")
									CreateSession(login.userID, login.projectID, dateNow, browser, request.action, request.streamer, request.sender);
								else
									CreateSession(login.userID, login.projectID, dateNow, browser, request.action, request.streamer, sender.tab.id);

								//Opens pre-session form
								if(project.pre_session_form != null && request.action != "Login" && request.action != "Logout" && (request.type == "openedTab_aux" ? request.sender : sender.tab.id) != lastTabClosed){
									if(project.pre_session_form.indexOf('?') > -1)
										chrome.tabs.create({url: project.pre_session_form + "&p=" + login.userID + "&sid=" + (+project.sessionID+1), selected: true, pinned: false});
									else
										chrome.tabs.create({url: project.pre_session_form + "?p=" + login.userID + "&sid=" + (+project.sessionID+1), selected: true, pinned: false});
								}
								
								//VerifyDevices(login.userID, login.projectID);
							}
							
							if(tabNNetflix.length == 1 && request.streamer == 'Netflix'){
								has_content_netflix = false;
								if(project.pre_session_form_netflix != null && request.action != "Login" && request.action != "Logout" && (request.type == "openedTab_aux" ? request.sender : sender.tab.id) != lastTabClosed_netflix){
									if(project.pre_session_form_netflix.indexOf('?') > -1)
										chrome.tabs.create({url: project.pre_session_form_netflix + "&p=" + login.userID + "&sid=" + (+project.sessionID+(tabNf.length == 1 ? 1 : 0)), selected: true, pinned: false});
									else
										chrome.tabs.create({url: project.pre_session_form_netflix + "?p=" + login.userID + "&sid=" + (+project.sessionID+(tabNf.length == 1 ? 1 : 0)), selected: true, pinned: false});
								}
							}
							if(tabNYouTube.length == 1 && request.streamer == 'YouTube'){
								has_content_youtube = false;
								if(project.pre_session_form_youtube != null && request.action != "Login" && request.action != "Logout" && (request.type == "openedTab_aux" ? request.sender : sender.tab.id) != lastTabClosed_youtube){
									if(project.pre_session_form_youtube.indexOf('?') > -1)
										chrome.tabs.create({url: project.pre_session_form_youtube + "&p=" + login.userID + "&sid=" + (+project.sessionID+(tabNf.length == 1 ? 1 : 0)), selected: true, pinned: false});
									else
										chrome.tabs.create({url: project.pre_session_form_youtube + "?p=" + login.userID + "&sid=" + (+project.sessionID+(tabNf.length == 1 ? 1 : 0)), selected: true, pinned: false});
								}
							}
							if(tabNAmazonPrime.length == 1 && request.streamer == 'Amazon Prime'){
								has_content_amazonprime = false;
								if(project.pre_session_form_amazonprime != null && request.action != "Login" && request.action != "Logout" && (request.type == "openedTab_aux" ? request.sender : sender.tab.id) != lastTabClosed_amazonprime){
									if(project.pre_session_form_amazonprime.indexOf('?') > -1)
										chrome.tabs.create({url: project.pre_session_form_amazonprime + "&p=" + login.userID + "&sid=" + (+project.sessionID+(tabNf.length == 1 ? 1 : 0)), selected: true, pinned: false});
									else
										chrome.tabs.create({url: project.pre_session_form_amazonprime + "?p=" + login.userID + "&sid=" + (+project.sessionID+(tabNf.length == 1 ? 1 : 0)), selected: true, pinned: false});
								}
							}
							if(tabNDisneyPlus.length == 1 && request.streamer == 'Disney+'){
								has_content_disneyplus = false;
								if(project.pre_session_form_disneyplus != null && request.action != "Login" && request.action != "Logout" && (request.type == "openedTab_aux" ? request.sender : sender.tab.id) != lastTabClosed_disneyplus){
									if(project.pre_session_form_disneyplus.indexOf('?') > -1)
										chrome.tabs.create({url: project.pre_session_form_disneyplus + "&p=" + login.userID + "&sid=" + (+project.sessionID+(tabNf.length == 1 ? 1 : 0)), selected: true, pinned: false});
									else
										chrome.tabs.create({url: project.pre_session_form_disneyplus + "?p=" + login.userID + "&sid=" + (+project.sessionID+(tabNf.length == 1 ? 1 : 0)), selected: true, pinned: false});
								}
							}
							if(tabNHBOMax.length == 1 && request.streamer == 'HBO'){
								has_content_hbomax = false;
								if(project.pre_session_form_hbomax != null && request.action != "Login" && request.action != "Logout" && (request.type == "openedTab_aux" ? request.sender : sender.tab.id) != lastTabClosed_hbomax){
									if(project.pre_session_form_hbomax.indexOf('?') > -1)
										chrome.tabs.create({url: project.pre_session_form_hbomax + "&p=" + login.userID + "&sid=" + (+project.sessionID+(tabNf.length == 1 ? 1 : 0)), selected: true, pinned: false});
									else
										chrome.tabs.create({url: project.pre_session_form_hbomax + "?p=" + login.userID + "&sid=" + (+project.sessionID+(tabNf.length == 1 ? 1 : 0)), selected: true, pinned: false});
								}
							}
						}
					}

					//If it leaves Netflix closes the tab to prevent coming back
					if(request.type == "URLChanged"){

						if(tabNf.length != 0 && sessionStarted == true){
							lastTabClosed = sender.tab.id;
							var dateNow = date();
							Browse(dateNow, login.userID, project.sessionID, login.projectID, "Closed Tab", request.streamer, browser, sender.tab.id);
							if(request.streamer == 'Netflix'){
								lastTabClosed_netflix = sender.tab.id;
								removeA(tabNNetflix, sender.tab.id);
							}
							if(request.streamer == 'YouTube'){
								lastTabClosed_youtube = sender.tab.id;
								removeA(tabNYouTube,sender.tab.id);
							}
							if(request.streamer == 'Amazon Prime'){
								lastTabClosed_amazonprime = sender.tab.id;
								removeA(tabNAmazonPrime,sender.tab.id);
							}
							if(request.streamer == 'Disney+'){
								lastTabClosed_disneyplus = sender.tab.id;
								removeA(tabNDisneyPlus,sender.tab.id);
							}
							if(request.streamer == 'HBO'){
								lastTabClosed_hbomax = sender.tab.id;
								removeA(tabNHBOMax,sender.tab.id);
							}
						}
						removeA(tabNf, sender.tab.id);
						
						if(tabNNetflix.length == 0 && sessionStarted == true){
							if(project.pos_session_form_netflix != null && has_content_netflix){
								if(project.pos_session_form_netflix.indexOf('?') > -1)
									chrome.windows.create({url: project.pos_session_form_netflix + "&p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
								else
									chrome.windows.create({url: project.pos_session_form_netflix + "?p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
							}
						}
						
						if(tabNYouTube.length == 0 && sessionStarted == true){
							if(project.pos_session_form_youtube != null && has_content_youtube){
								if(project.pos_session_form_youtube.indexOf('?') > -1)
									chrome.windows.create({url: project.pos_session_form_youtube + "&p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
								else
									chrome.windows.create({url: project.pos_session_form_youtube + "?p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
							}
						}
						if(tabNAmazonPrime.length == 0 && sessionStarted == true){
							if(project.pos_session_form_netflix != null && has_content_amazonprime){
								if(project.pos_session_form_netflix.indexOf('?') > -1)
									chrome.windows.create({url: project.pos_session_form_netflix + "&p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
								else
									chrome.windows.create({url: project.pos_session_form_netflix + "?p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
							}
						}
						if(tabNDisneyPlus.length == 0 && sessionStarted == true){
							if(project.pos_session_form_netflix != null && has_content_disneyplus){
								if(project.pos_session_form_netflix.indexOf('?') > -1)
									chrome.windows.create({url: project.pos_session_form_netflix + "&p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
								else
									chrome.windows.create({url: project.pos_session_form_netflix + "?p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
							}
						}
						if(tabNHBOMax.length == 0 && sessionStarted == true){
							if(project.pos_session_form_netflix != null && has_content_hbomax){
								if(project.pos_session_form_netflix.indexOf('?') > -1)
									chrome.windows.create({url: project.pos_session_form_netflix + "&p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
								else
									chrome.windows.create({url: project.pos_session_form_netflix + "?p=" + login.userID + "&sid=" + project.sessionID, state: 'maximized'});
							}
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
						if(request.streamer == 'Netflix')
							has_content_netflix = true;
						if(request.streamer == 'YouTube')
							has_content_youtube = true;
						if(request.streamer == 'Amazon Prime')
							has_content_amazonprime = true;
						if(request.streamer == 'Disney+')
							has_content_disneyplus = true;
						if(request.streamer == 'HBO')
							has_content_hbomax = true;
						
						var dateNow = date();
						if(request.eps_title != null && request.eps_title != "" && request.eps_title != " ")
							Watch2(dateNow, login.userID, project.sessionID, request.eps_time, request.eps_dur, request.action, login.projectID, request.streamer, request.eps_code, request.init_time, browser, sender.tab.id, request.eps_title);
						else
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
						if(request.streamer == 'Netflix' && project.next_episode_form_netflix != null){
							if(project.next_episode_form_netflix.indexOf('?') > -1)
								chrome.tabs.create({url: project.next_episode_form_netflix + "&p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
							else
								chrome.tabs.create({url: project.next_episode_form_netflix + "?p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
						}
						if(request.streamer == 'YouTube' && project.next_episode_form_youtube != null){
							if(project.next_episode_form_youtube.indexOf('?') > -1)
								chrome.tabs.create({url: project.next_episode_form_youtube + "&p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
							else
								chrome.tabs.create({url: project.next_episode_form_youtube + "?p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
						}
						if(request.streamer == 'Amazon Prime' && project.next_episode_form_amazonprime != null){
							if(project.next_episode_form_amazonprime.indexOf('?') > -1)
								chrome.tabs.create({url: project.next_episode_form_amazonprime + "&p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
							else
								chrome.tabs.create({url: project.next_episode_form_amazonprime + "?p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
						}
						if(request.streamer == 'Disney+' && project.next_episode_form_disneyplus != null){
							if(project.next_episode_form_disneyplus.indexOf('?') > -1)
								chrome.tabs.create({url: project.next_episode_form_disneyplus + "&p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
							else
								chrome.tabs.create({url: project.next_episode_form_disneyplus + "?p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
						}
						if(request.streamer == 'HBO' && project.next_episode_form_netflix != null){
							if(project.next_episode_form_hbomax.indexOf('?') > -1)
								chrome.tabs.create({url: project.next_episode_form_hbomax + "&p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
							else
								chrome.tabs.create({url: project.next_episode_form_hbomax + "?p=" + login.userID + "&sid=" + project.sessionID, selected: true, pinned: false});
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

async function CreateSession(userID, project_ID, time, browser, action, streamer, tabID){
	let response = await fetch(server_url + "/CreateSession?userID=" + userID + "&projectID=" + project_ID + "&time=" + time + "&brwoser=" + browser + "&action=" + action + "&streamer=" + streamer + "&tabID=" + tabID, {
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
	let response = await fetch(server_url + "/Browse" + "?time=" + time + "&userID=" + userID + "&sessionID=" + sessionID + "&projectID=" + projectID + "&action=" + action + "&streamer=" + streamer + "&browser=" + browser + "&tabID=" + tabID, {
	  method: 'POST'
	}).catch(e => console.log(e));
}

//Send /watch data

async function Watch(time, userID, sessionID, eps_time, eps_dur, action, projectID, streamer, eps_code, action_dur, browser, tabID){
	let response = await fetch(server_url + "/Watch" + "?time=" + time + "&userID=" + userID + "&sessionID=" + sessionID + "&eps_time=" + eps_time + "&eps_dur=" + eps_dur + "&projectID=" + projectID + "&eps_code=" + eps_code + "&action_dur= " + action_dur +"&action=" + action + "&streamer=" + streamer + "&browser=" + browser + "&tabID=" + tabID, {
	  method: 'POST'
	}).catch(e => console.log(e));
}

async function Watch2(time, userID, sessionID, eps_time, eps_dur, action, projectID, streamer, eps_code, action_dur, browser, tabID, eps_title){
	console.log("Watch2", eps_title);
	let response = await fetch(server_url + "/Watch2" + "?time=" + time + "&userID=" + userID + "&sessionID=" + sessionID + "&eps_time=" + eps_time + "&eps_dur=" + eps_dur + "&projectID=" + projectID + "&eps_code=" + eps_code + "&action_dur= " + action_dur +"&action=" + action + "&streamer=" + streamer + "&browser=" + browser + "&tabID=" + tabID + "&eps_title=" + eps_title, {
	  method: 'POST'
	}).catch(e => console.log(e));
}

//End session when all streaming tabs are closed

async function EndSession(time, userID, sessionID, projectID, streamer, browser, tabID){
	let response = await fetch(server_url + "/EndSession" + "?time=" + time + "&userID=" + userID + "&sessionID=" + sessionID + "&projectID=" + projectID + "&streamer=" + streamer + "&browser=" + browser + "&tabID=" + tabID, {
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
	let response = await fetch(server_url + "/GetForms/" + projectID + "/" + userID, {
	  method: 'POST'
	}).catch(e => console.log(e));

	var txt = await response.text();
	if(txt != ""){
		var proj_forms = JSON.parse(txt);
		chrome.storage.sync.set({pre_study_form: proj_forms[0].pre_study_form, pos_study_form: proj_forms[0].pos_study_form, pre_session_form:proj_forms[0].pre_session_form, pos_session_form: proj_forms[0].pos_session_form, next_episode_form: proj_forms[0].next_episode_form, p_start_time : proj_forms[0].p_start_time, p_finish_time: proj_forms[0].p_finish_time, has_devices : proj_forms[0].has_devices, has_forms : proj_forms[0].forms, u_finish_time: proj_forms[0].u_finish_time});

		if(proj_forms[0].forms == "Yes")
			getEpisodesForms(projectID);
	}
}

async function getEpisodesForms(projectID){
	let response = await fetch(server_url + "/GetFormsEpisodes/" + projectID, {
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