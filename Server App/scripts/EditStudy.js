let url = new URL(window.location.href);
let searchParams = new URLSearchParams(url.search);
if(searchParams.get('alert'))
	alert(searchParams.get('alert'));

var server_url = <server_url>;

var segment_str = window.location.pathname;
var segment_array = segment_str.split('/');
var project_name = decodeURI(segment_array.pop());

document.getElementById("title").innerHTML = project_name;
console.log(document.getElementsByName("p_name")[0]);
document.getElementsByName("p_name")[0].value = project_name;
console.log(document.getElementsByName("p_name")[0]);

var xhttp;
xhttp = new XMLHttpRequest();
var txt;

xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		txt = xhttp.responseText;
		if(txt != "[]"){
			var project = JSON.parse(txt);

			if(project[0].has_devices == "Yes")
				document.getElementById('devices').checked = true;

			if(project[0].p_start_time != null){
				var d = new Date(project[0].p_start_time);
				d.setHours(d.getHours() + (new Date().getTimezoneOffset() / 60) + 1);
				var date = d.getFullYear() + "-";
				var month = d.getMonth() + 1;
				if(month < 10)
					date += "0" + month + "-";
				else
					date += month + "-";
				if(d.getDate() < 10)
					date += "0" + d.getDate();
				else
					date += d.getDate();
				document.getElementsByName("start_date_val")[0].value = date;
				
			}
			if(project[0].p_finish_time != null){
				var d = new Date(project[0].p_finish_time);
				d.setHours(d.getHours() + (new Date().getTimezoneOffset() / 60) + 1);
				var date = d.getFullYear() + "-";
				var month = d.getMonth() + 1;
				if(month < 10)
					date += "0" + month + "-";
				else
					date += month + "-";
				if(d.getDate() < 10)
					date += "0" + d.getDate();
				else
					date += d.getDate();
				document.getElementsByName("finish_date_val")[0].value = date;
				
			}

			if(project[0].pre_study_form != null)
				document.getElementsByName('pre_study_url')[0].value = project[0].pre_study_form;

			if(project[0].pos_study_form != null)
				document.getElementsByName('post_study_url')[0].value = project[0].pos_study_form;

			if(project[0].pre_session_form != null)
				document.getElementsByName('pre_session_url')[0].value = project[0].pre_session_form;

			if(project[0].pos_session_form != null)
				document.getElementsByName('post_session_url')[0].value = project[0].pos_session_form;

			if(project[0].next_episode_form != null)
				document.getElementsByName('next_episode_url')[0].value = project[0].next_episode_form;
		}
	}
}
xhttp.open("GET", encodeURI(server_url + "/GetStudyInfos/" + project_name));
xhttp.send();

