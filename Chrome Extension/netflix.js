//Netflix script

var title = "";
var season = "";
var episode = "";
var time = "";
var dur = "";
var search = "";
var eps_code = "";
var init_time = "";

var netflixurl = window.location.href;

if(netflixurl.includes("/watch")){
	var episodeWatched = ReadEpisode ();
	title = episodeWatched[0];
	season = episodeWatched[1];
	episode = episodeWatched[2];
	time = episodeWatched[3];
	dur = episodeWatched[4];
	eps_code = episodeWatched[5];
	init_time = episodeWatched[3];
	StartedEpisode();
}


if(netflixurl.includes("/login") || netflixurl.includes("/Login")){
	search = "";
	login = true;
	logout = false;
	chrome.runtime.sendMessage({type: "openedNetflix", action : "Login", streamer : "Netflix"});
}
else {
	if(netflixurl.includes("/logout")){
		search = "";
		login = false;
		logout = true;
		chrome.runtime.sendMessage({type: "openedNetflix", action : "Logout", streamer : "Netflix"});
	}
	else
		chrome.runtime.sendMessage({type: "openedNetflix", action : "regular", streamer : "Netflix"});
}


//Activated the detection of interface events
document.addEventListener("pause", Paused, true);
document.addEventListener("playing", Played, true);
document.addEventListener("seeking", FastFowarded, true);
document.addEventListener('mouseup', MouseUpHandler, false);
window.addEventListener("beforeunload", beforeunloadHandler);
setInterval(UpdateEpisode, 20);
setInterval(VerifyDevices, 300000);

function VerifyDevices () {
	chrome.runtime.sendMessage({type: "VerifyDevices"});
}

function beforeunloadHandler (){

	var netflixurl = window.location.href;

	if(netflixurl.includes("watch") && title != "" && season != "" && episode != "")
		chrome.runtime.sendMessage({type: "eventDetected", title : title, season : season, eps_nr : episode, eps_time : time, eps_dur : dur , eps_code : eps_code, action : "Stopped watching", streamer : "Netflix", init_time : time - init_time});

	title = "";
	season = "";
	episode = "";
	time = "";
	dur = "";
	search = "";
	eps_code = "";
	init_time = "";

	chrome.runtime.sendMessage({type: "URLChanged", streamer : "Netflix"});
}

//Detects the event Paused and sends them to the server
function Paused (event){ SendMessage("Paused"); }

//Detects the event Played and sends them to the server
function Played (event){ SendMessage("Played"); }

//Detects the event Loaded and sends them to the server
function FastFowarded (event){
	UpdateEpisode();
	if(parseInt(time, 10) > parseInt(init_time, 10)){
		SendMessage("Forwarded");
	}
	else{
		SendMessage("Rewound");
	}
}

//Detects the event Loaded and sends them to the server
function StartedEpisode (){	SendMessage("Started watching"); }

//Detects the skip Intro or Credits
function MouseUpHandler(event){
	
	var netflixurl = window.location.href;
	
	if(netflixurl.includes("/watch")){			
		if (event === undefined)
			event = window.event;
		var target = 'target' in event? event.target : event.srcElement;


		if(target.className == "nf-flat-button-text"){
			if(target.innerText != null){
				SendMessage("Clicked: " + target.innerText);
			}
		}
	}
}

//Sends message to Background
function SendMessage(string){

	var netflixurl = window.location.href;

	if(netflixurl.includes("/watch")){
		var episodeWatched = ReadEpisode();
		if(episodeWatched[0] != ""){
			chrome.runtime.sendMessage({type: "eventDetected", title : episodeWatched[0], season : episodeWatched[1], eps_nr : episodeWatched[2], eps_time : episodeWatched[3], eps_dur : episodeWatched[4], eps_code : episodeWatched[5], action : string, streamer : "Netflix", init_time : time - init_time});
			init_time = time;
		}
	}
}

//Reads information related with the event such as title, episode and season
function ReadEpisode (){
	
	var eps_url = window.location.href.split('?')[0].replace(/\/$/, '').split("\/");

	var eps_info = [];
	var y = document.getElementsByClassName('ellipsize-text');
	
	//Read title
	if(typeof y[0] !== 'undefined'){
		if (y[0].childNodes[0].innerHTML == undefined)
			eps_info[0] = y[0].innerHTML;
		else
			eps_info[0] = y[0].childNodes[0].innerHTML;
		
		//Read episode and season
		if(typeof y[0].getElementsByTagName('span')[0] !== 'undefined' && y[0].getElementsByTagName('span')[0].innerHTML.match(/\d+/g) != null){
			var aux = y[0].getElementsByTagName('span')[0].innerHTML.match(/\d+/g);
			eps_info[1] = aux[0];
			eps_info[2] = aux[1];
		}
		else{
			eps_info[1] = -1;
			eps_info[2] = -1;
		}
		eps_info[5] = eps_url[eps_url.length-1];

		//Reads remaining time and duration
		eps_info[3] = (document.getElementsByTagName('video')[document.getElementsByTagName('video').length - 1].currentTime).toFixed(0);
		eps_info[4] = (document.getElementsByTagName('video')[document.getElementsByTagName('video').length - 1].duration).toFixed(0);
		if(init_time == "")
			init_time = eps_info[3];
	}
	else{
		eps_info[0] = "";
		eps_info[1] = "";
		eps_info[2] = "";
		eps_info[3] = "";
		eps_info[4] = "";
		eps_info[5] = "";
	}

	return eps_info;
}

//When episode starts updates the epsidoe infor every 50ms
function UpdateEpisode(){

	var netflixurl = window.location.href;
	
	if(netflixurl.includes("/watch")){
		search = "";
		var episodeWatched = ReadEpisode();
		
		if(episodeWatched[0] != title || episodeWatched[1] != season || episodeWatched[2] != episode){
			if(title != "" && season != "" && episode != ""){
				chrome.runtime.sendMessage({type: "nextEpisode"});
				chrome.runtime.sendMessage({type: "eventDetected", title : title, season : season, eps_nr : episode, eps_time : time , eps_dur : dur , eps_code : eps_code, action : "Stopped watching", streamer : "Netflix", init_time : time - init_time});
			}
			title = episodeWatched[0];
			season = episodeWatched[1];
			episode = episodeWatched[2];
			eps_code = episodeWatched[5];
			time = episodeWatched[3];
			dur = episodeWatched[4];
			if(title != "" && season != "" && episode != "")
				setTimeout(function(){
					StartedEpisode();
				}, 200);
		}
		time = episodeWatched[3];
		dur = episodeWatched[4];
	}
	else{
		if(title != "" && season != "" && episode != ""){
			chrome.runtime.sendMessage({type: "eventDetected", title : title, season : season, eps_nr : episode, eps_time : time , eps_code : eps_code, eps_dur : dur , action : "Stopped watching", streamer : "Netflix", init_time : time - init_time});
			title = "";
			season = "";
			episode = "";
			time = "";
			dur = "";
			eps_code = "";
			init_time = "";
		}
	}
	if(netflixurl.includes("/search")){
		let searchParams = new URLSearchParams(new URL(window.location.href).search);
		if(searchParams.get('q') != null && search != searchParams.get('q')){
			search = searchParams.get('q');
			chrome.runtime.sendMessage({type: "Browse", action : "Search: " + search, streamer : "Netflix"});
		}
	}
}