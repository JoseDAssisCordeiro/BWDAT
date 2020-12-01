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