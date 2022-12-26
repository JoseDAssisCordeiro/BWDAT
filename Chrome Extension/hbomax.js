//Netflix script

var time = "";
var dur = "";
var search = "";
var eps_code = "";
var init_time = "";
var streamer = "HBO";

chrome.storage.sync.get(['hbo'], function(project) {
	
	if(project.hbo == 'Yes'){
		var url = window.location.href;

		if(url.includes("/player")){
			var episodeWatched = ReadEpisode ();
			eps_code = episodeWatched[0];
			time = episodeWatched[1];
			dur = episodeWatched[2];
			init_time = episodeWatched[1];
			StartedEpisode();
		}

		chrome.runtime.sendMessage({type: "check pin", action : "regular", streamer : streamer});
		chrome.runtime.sendMessage({type: "openedTab", action : "regular", streamer : streamer});


		//Activated the detection of interface events
		document.addEventListener("pause", Paused, true);
		document.addEventListener("playing", Played, true);
		document.addEventListener("seeking", FastFowarded, true);
		document.addEventListener("keydown", KeyBoardHandler, true);
		//document.addEventListener('mouseup', MouseUpHandler, false);
		window.addEventListener("beforeunload", beforeunloadHandler);
		setInterval(UpdateEpisode, 20);
		//setInterval(VerifyDevices, 300000);
	}
})

function VerifyDevices () {
	chrome.runtime.sendMessage({type: "VerifyDevices"});
}

function beforeunloadHandler (){

	var url = window.location.href;

	if(url.includes("player") && eps_code != "")
		chrome.runtime.sendMessage({type: "eventDetected", eps_time : time, eps_dur : dur , eps_code : eps_code, action : "Stopped watching", streamer : streamer, init_time : time - init_time});

	time = "";
	dur = "";
	search = "";
	eps_code = "";
	init_time = "";

	chrome.runtime.sendMessage({type: "URLChanged", streamer : streamer});
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

//keyboard presses
function KeyBoardHandler (event)
{
  //detect key
  if(event.keyCode == 32){
	chrome.runtime.sendMessage({type : "SpaceBar", eps_code : eps_code});
	SendMessage("Pressed Key: Space bar");
  }
}

//Sends message to Background
function SendMessage(string){

	var url = window.location.href;

	if(url.includes("/player")){
		var episodeWatched = ReadEpisode();
		if(episodeWatched[0] != ""){
			chrome.runtime.sendMessage({type: "eventDetected", eps_time : episodeWatched[1], eps_dur : episodeWatched[2], eps_code : episodeWatched[0], action : string, streamer : streamer, init_time : time - init_time});
			init_time = time;
		}
	}
}

//Reads information related with the event such as title, episode and season
function ReadEpisode (){
	
	var eps_info = [];
	var eps_url = window.location.href.split('?')[0].replace(/\/$/, '').split("\/");

	if(eps_url[eps_url.length-1] !== 'undefined'){

		if(document.getElementsByTagName('video')[document.getElementsByTagName('video').length - 1] != undefined){
			var times = document.getElementsByTagName('video')[document.getElementsByTagName('video').length - 1]

			//var title = document.getElementsByTagName('h1')[document.getElementsByTagName('h1').length - 1]
			//console.log(title.firstChild.innerText);
			
			var code = eps_url[eps_url.length-1].split(":");
			eps_info[0] = code[code.length-1];

			//Reads remaining time and duration
			eps_info[1] = (times.currentTime).toFixed(0);
			eps_info[2] = (times.duration).toFixed(0);

			if(init_time == "")
				init_time = eps_info[1];
		}
		else{
			eps_info[0] = eps_code;
			eps_info[1] = time;
			eps_info[2] = dur;
		}
	}
	else{
		eps_info[0] = "";
		eps_info[1] = "";
		eps_info[2] = "";
	}

	return eps_info;
}

//When episode starts updates the episode info every 20ms
function UpdateEpisode(){

	var url = window.location.href;
	
	if(url.includes("/player")){
		search = "";
		var episodeWatched = ReadEpisode();
		
		if(episodeWatched[0] != eps_code){
			if(eps_code != ""){
				chrome.runtime.sendMessage({type: "nextEpisode"});
				chrome.runtime.sendMessage({type: "eventDetected", eps_time : time , eps_dur : dur , eps_code : eps_code, action : "Stopped watching", streamer : streamer, init_time : time - init_time});
			}
			if(episodeWatched[0] != "")
				setTimeout(function(){
					StartedEpisode();
				}, 200);
			eps_code = episodeWatched[0];
		}
		time = episodeWatched[1];
		dur = episodeWatched[2];
	}
	else{
		if(eps_code != ""){
			chrome.runtime.sendMessage({type: "eventDetected", eps_time : time , eps_code : eps_code, eps_dur : dur , action : "Stopped watching", streamer : streamer, init_time : time - init_time});

			time = "";
			dur = "";
			eps_code = "";
			init_time = "";
		}
	}
	if(url.includes("/results")){
		let searchParams = new URLSearchParams(new URL(window.location.href).search);
		if(searchParams.get('search_query') != null && search != searchParams.get('search_query')){
			search = searchParams.get('search_query');
			chrome.runtime.sendMessage({type: "Browse", action : "Search: " + search, streamer : streamer});
		}
	}
}
