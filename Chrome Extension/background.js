//If a userID was not define yet a new tab will ask for it
chrome.storage.sync.get(['userID'], function(login) {
	if(typeof login.userID == 'undefined')
		chrome.tabs.create({url: "options.html"});
});

//Uploads userID number
chrome.storage.sync.get(['userID', 'projectID'], function(login) {

	//uploads the userID number
	if(typeof login.userID !== 'undefined')
		chrome.tabs.query({}, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
				if (tabs[i].title == "Back up forms")
					return;
			}
			chrome.tabs.create({url: chrome.runtime.getURL("BWDATStudyForms.html"), selected: false, pinned: true});
		});
});

//In case of event detected by netflix.js
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {

	if(request.type == "check pin")
		chrome.tabs.query({}, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
				if (tabs[i].title == "Back up forms")
					return;
			}
			chrome.tabs.create({url: chrome.runtime.getURL("BWDATStudyForms.html"), selected: false, pinned: true});
			setTimeout(function(){
				chrome.runtime.sendMessage({type: "openedNetflix_aux", action : request.action, streamer : request.streamer, sender : sender.tab.id});
			}, 1000);
		});
});