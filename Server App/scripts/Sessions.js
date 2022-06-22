
var server_url = <server_url>;

var segment_str = window.location.pathname;
var segment_array = segment_str.split('/');
var project_name = decodeURI(segment_array.pop());

document.getElementById("title").innerHTML = project_name;

var sessionsTable = document.getElementById('extensionSessions');

var header = sessionsTable.createTHead();
var row = header.insertRow(0);    

var headCell7 = row.insertCell(0);
var headCell6 = row.insertCell(0);
var headCell5 = row.insertCell(0);
var headCell4 = row.insertCell(0);
var headCell3 = row.insertCell(0);
var headCell2 = row.insertCell(0);

headCell2.innerHTML = "<b>User</b>";
headCell3.innerHTML = "<b>Session</b>";
headCell4.innerHTML = "<b>Start Time</b>";
headCell5.innerHTML = "<b>Duration</b>";
headCell6.innerHTML = "<b>Finish Time</b>";
headCell7.innerHTML = "<b>Visualize</b>";

var xhttp;
var txt;

xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		txt = xhttp.responseText;
		if(txt != "[]"){
			var extensionSessions = JSON.parse(txt);
			
			for (var i = 0; i < extensionSessions.length; i++) {
				
				var row = sessionsTable.insertRow(sessionsTable.length);

				var cell7 = row.insertCell(0);
				var cell6 = row.insertCell(0);
				var cell5 = row.insertCell(0);
				var cell4 = row.insertCell(0);
				var cell3 = row.insertCell(0);
				var cell2 = row.insertCell(0);
				
				cell2.innerHTML = extensionSessions[i].user_id;
				cell3.innerHTML = extensionSessions[i].session_code;
				cell4.innerHTML = formatDate(extensionSessions[i].s_start_time);
				if(extensionSessions[i].s_finish_time != null){
					var date_f = new Date(extensionSessions[i].s_finish_time);
					var date_i = new Date(extensionSessions[i].s_start_time);
					cell5.innerHTML = getDuration(date_i, date_f);
					cell6.innerHTML = formatDate(extensionSessions[i].s_finish_time);
				}
				else{
					cell5.innerHTML = '-';
					cell6.innerHTML = '-';
				}
				cell7.innerHTML = "<button class=\'edit\' onClick=\"location.href = '" + server_url + "/Session/" + extensionSessions[i].project + "/User/" + extensionSessions[i].user_id + "/Session/" + extensionSessions[i].session_code + "'\">Visualize</button>";
			}
		}
	}
};

xhttp.open("GET", encodeURI(server_url + "/StudySessions/" + project_name));
xhttp.send();

function formatDate(input){
	var d = new Date(input);
    d.setHours(d.getHours() + (new Date().getTimezoneOffset() / 60) + 2);
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
	if(d.getHours() < 10)
		date += " 0" + d.getHours();
	else
		date += " " + d.getHours();
	if(d.getMinutes() < 10)
		date += ":0" + d.getMinutes();
	else
		date += ":" + d.getMinutes();
	if(d.getSeconds() < 10)
		date += ":0" + d.getSeconds();
	else
		date += ":" + d.getSeconds();
	return date;
};


function getDuration(d1, d2) {
    d = new Date(d2 - d1);
	d.setHours(d.getHours() + (new Date().getTimezoneOffset() / 60));
	var date = "";

	if(d.getHours() < 10)
		date += "0" + (d.getHours());
	else
		date += " " + (d.getHours());
	if(d.getMinutes() < 10)
		date += ":0" + d.getMinutes();
	else
		date += ":" + d.getMinutes();
	if(d.getSeconds() < 10)
		date += ":0" + d.getSeconds();
	else
		date += ":" + d.getSeconds();
	return date;
}
