// Save options to chrome.storage.sync

document.getElementById('submit').addEventListener('click', SendCode);

//Uploads the userID in the options.html
chrome.storage.sync.get(['userID', 'projectID'], function(items) {
	var string = "";
	if(typeof items.userID !== 'undefined')
		string += 'User ID = \n' + items.userID + ' & ';
	if(typeof items.projectID !== 'undefined')
		string += 'Project ID = \n' + items.projectID;
	document.getElementById('status').textContent = string;
});

var server_url = "";

function SendCode() {
	
	var xhttp;
	var code = document.getElementById('USER_CODE');
	if(code.value != null){
		xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				txt = xhttp.responseText;
				if(txt != "[]"){
					var project = JSON.parse(txt);
					
					chrome.storage.sync.set({ sessionID: 0, userID: project[0].user_id, projectID : project[0].project, pre_session_form : project[0].pre_session_form, pos_session_form : project[0].pos_session_form, pre_study_form : project[0].pre_study_form, pos_study_form : project[0].pos_study_form, next_episode_form : project[0].next_episode_form, p_start_time : project[0].p_start_time, p_finish_time : project[0].p_finish_time }, function(){
						// Update status to let user know options were saved
						document.getElementById('info').textContent = 'Code valid';
						
						//Cleans status var after 750 miliseconds
						setTimeout(function(){
							document.getElementById('info').textContent = '';
							
						}, 750);
					});
					
					if(project[0].pre_study_form != null){
						if(project[0].pre_study_form.indexOf('?') > -1)
							chrome.tabs.create({url: project[0].pre_study_form + "&p=" + project[0].user_id , selected: true});
						else
							chrome.tabs.create({url: project[0].pre_study_form + "?p=" + project[0].user_id , selected: true});
					}
					//Closes window after 1000 miliseconds
					setTimeout(function(){
						window.close();
					}, 1000);
				}
				else{
					document.getElementById('info').textContent = 'Please insert a valid code';
					
					//Cleans status var after 750 miliseconds
					setTimeout(function(){
						document.getElementById('info').textContent = '';
					}, 750);
				}
			}
		}
		
		var date = new Date();
		var dateNow = date.getFullYear() + "-" + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
		
		xhttp.open("POST", server_url, true);
		xhttp.send("request=ValidateCode&code=" + code.value + "&time=" + dateNow);
		
	}
	else{
		document.getElementById('info').textContent = 'Please insert a valid code';
		//Cleans status var after 750 miliseconds
		setTimeout(function(){
			document.getElementById('info').textContent = '';
		}, 750);
	}
}