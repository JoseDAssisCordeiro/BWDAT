let url = new URL(window.location.href);
let searchParams = new URLSearchParams(url.search);
if(searchParams.get('alert'))
	alert(searchParams.get('alert'));

var server_url = <server_url>;

var zip;
var xhttp;
var projects = [];

xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var txt;
		txt = xhttp.responseText;
		if(txt != "[]"){

			var sessionTable = document.getElementById('test');
			var projects = JSON.parse(txt);

			for (var i = 0; i < projects.length; i++) {
				var row = sessionTable.insertRow(sessionTable.length);
				var cell4 = row.insertCell(0);
				var cell3 = row.insertCell(0);
				var cell2 = row.insertCell(0);
				var cell1 = row.insertCell(0);
				cell1.style.textAlign = "left"; 

				if(projects[i].p_start_time == null)
					cell1.innerHTML = '<span style="padding-left: 40px;"><img src="images/grey.jpg" height="15" size="15"> ' + projects[i].project + '</span>';
				else{
					if( new Date(projects[i].p_start_time) > new Date())
						cell1.innerHTML = '<span style="padding-left: 40px;"><img src="images/grey.jpg" height="15" size="15"> ' + projects[i].project + '</span>';
					else
						if(projects[i].p_finish_time != null && new Date(projects[i].p_finish_time) < new Date())
							cell1.innerHTML = '<span style="padding-left: 40px;"><img src="images/red.jpg" height="15" size="15"> ' + projects[i].project + '</span>';
						else
							cell1.innerHTML = '<span style="padding-left: 40px;"><img src="images/green.jpg" height="15" size="15"> ' + projects[i].project + '</span>';
				}
				var div = 'dropdown' + projects[i].project;
				var div2 = 'dropdown2' + projects[i].project;
				var cell2txt = "<button  onclick=\"myFunction('" + div + "')\" class=\"return\">Edit &#9660;</button>" +
						"<div id=\"" +  div + "\" class=\"dropdown-content\">" +
							"<a href = '" + encodeURI("EditStudy/" + projects[i].project) + "'>Study</a>" +
							"<a href = '" + encodeURI("Users/" + projects[i].project) + "'>Users</a>";
				if(projects[i].has_devices == "Yes")
					cell2txt += "<a href = 'Devices/" + projects[i].project + "'>Devices</a>";
				if(projects[i].forms == "Yes")
					cell2txt += "<a href = 'Forms/" + projects[i].project + "'>Episode Forms</a>";
				cell2txt +=	"<a href = 'Permissions/" + projects[i].project + "'>Permissions</a>";
				cell2txt += "</div>";

				cell2.innerHTML = cell2txt;
				cell3.innerHTML = "<button  class=\'edit\' onClick=\"location.href = '" + server_url + "/Sessions/" + projects[i].project + "'\">Sessions</button>";
				var cell4txt = "<button  onclick=\"myFunction('" + div2 + "')\" class=\"edit\">Reports &#9660;</button>" +
						"<div id=\"" + div2 + "\" class=\"dropdown-content\">" +
							"<a href = 'ExtensionActions2/" + projects[i].project + "'>Actions (view)</a>" +
							"<a href = 'ExtensionActions/" + projects[i].project + "'>Actions (edit)</a>" +
							"<a href = 'Errors2/" + projects[i].project + "'>Errors</a>" +
							"<a href = 'Contents/" + projects[i].project + "'>Contents</a>";
				if(projects[i].has_devices == "Yes")
					cell4txt += "<a href = 'CoverageFaults/" + projects[i].project + "'>HR coverage faults</a>" +
							"<a href = 'SessionsCoverage/" + projects[i].project + "'>Sessions HR coverage</a>";
				cell4txt += "</div>";
				cell4.innerHTML = cell4txt;
			}
		}
	}
};
xhttp.open("GET", server_url + "/Projects", true);
xhttp.send();

var xhttp50;
xhttp50 = new XMLHttpRequest();

xhttp50.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		
		var txt2;
		txt2 = xhttp50.responseText;
		if(txt2 != "[]")
			document.getElementById("extra").innerHTML = txt2;
	}
};
xhttp50.open("GET", server_url + "/Links", true);
xhttp50.send();

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction(div) {
  document.getElementById(div).classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.edit') && !event.target.matches('.return')) {
	var dropdowns = document.getElementsByClassName("dropdown-content");
	var i;
	for (i = 0; i < dropdowns.length; i++) {
	  var openDropdown = dropdowns[i];
	  if (openDropdown.classList.contains('show')) {
		openDropdown.classList.remove('show');
	  }
	}
  }
} 

/*
function convertToCSV(objArray, header) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
	str += header + "\r\n"
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
			if(index=='data_diahr')
				line += formatDate(array[i][index]);
			else
				if(index=='eps_time'){
					if(array[i][index] == null)
						line += array[i][index];
					else{
						line += epsTime(array[i][index]);
					}
				}
				else
					if(index=='series_title' || index=='series_title2')
						line += '"' + array[i][index] + '"';
					else
						line += array[i][index];
        }

        str += line + '\r\n';
    }

    return str;
}

function exportCSVFile(zip, items, fileName, header) {
    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);
    var csv = this.convertToCSV(jsonObject, header);

	console.log("Adding " + fileName);
	zip.file(fileName + '.csv', csv);
}


function create_zip() {

	zip = new JSZip();

	var xhttp1;

	xhttp1 = new XMLHttpRequest();
	xhttp1.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			exportCSVFile(JSON.parse(xhttp1.responseText), "BackupBWDAT_app_data", "ID, data_diahr, hr, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z, session_nr, device_id, battery");
			zip.generateAsync({type:"blob"})
			.then(function(content) {
				saveAs(content, "BWDATBackup.zip");
			});
		}
	}
	xhttp1.open("POST", "http://bwatch.rnl.tecnico.ulisboa.pt:8080", true);
	xhttp1.send("request=BackupBWDAT_app_data");

	var xhttp2;

	xhttp2 = new XMLHttpRequest();
	xhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			exportCSVFile(JSON.parse(xhttp2.responseText), "BackupBWDAT_chrome_data", "ID, data_diahr, series_title, season, eps_nr, eps_time, action, project, user_id, session_code, eps_dur, streamer, eps_code, action_dur, hidden, ID_aux, eps_time_aux, action_dur_aux, eps_dur_aux");
		}
	}
	xhttp2.open("POST", "http://bwatch.rnl.tecnico.ulisboa.pt:8080", true);
	xhttp2.send("request=BackupBWDAT_chrome_data");

	var xhttp3;

	xhttp3 = new XMLHttpRequest();
	xhttp3.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			exportCSVFile(JSON.parse(xhttp3.responseText), "BackupDevices", "device_id, added_time, project, name, model");
		}
	}
	xhttp3.open("POST", "http://bwatch.rnl.tecnico.ulisboa.pt:8080", true);
	xhttp3.send("request=BackupDevices");

	var xhttp4;

	xhttp4 = new XMLHttpRequest();
	xhttp4.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			exportCSVFile(JSON.parse(xhttp4.responseText), "BackupDevices_track", "ID, user_id, project, device_id, d_start_time, d_finish_time");
		}
	}
	xhttp4.open("POST", "http://bwatch.rnl.tecnico.ulisboa.pt:8080", true);
	xhttp4.send("request=BackupDevices_track");

	var xhttp5;

	xhttp5 = new XMLHttpRequest();
	xhttp5.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			exportCSVFile(JSON.parse(xhttp5.responseText), "BackupForms", "series_title, season, eps_nr, link, project");
		}
	}
	xhttp5.open("POST", "http://bwatch.rnl.tecnico.ulisboa.pt:8080", true);
	xhttp5.send("request=BackupForms");

	var xhttp6;

	xhttp6 = new XMLHttpRequest();
	xhttp6.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			exportCSVFile(JSON.parse(xhttp6.responseText), "BackupProject", "project, info, has_devices, is_public, is_anonymus, p_start_time, p_finish_time, pre_study_form, pos_study_form, pre_session_form, pos_session_form, netflix, youtube, next_episode_form");
		}
	}
	xhttp6.open("POST", "http://bwatch.rnl.tecnico.ulisboa.pt:8080", true);
	xhttp6.send("request=BackupProject");

	var xhttp7;

	xhttp7 = new XMLHttpRequest();
	xhttp7.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			exportCSVFile(JSON.parse(xhttp7.responseText), "BackupSessions", "user_id, session_code, s_start_time, s_finish_time");
		}
	}
	xhttp7.open("POST", "http://bwatch.rnl.tecnico.ulisboa.pt:8080", true);
	xhttp7.send("request=BackupSessions");

	var xhttp8;

	xhttp8 = new XMLHttpRequest();
	xhttp8.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			exportCSVFile(JSON.parse(xhttp8.responseText), "BackupUser_login", "user_password, user_permission, user_email, login_time, token");
		}
	}
	xhttp8.open("POST", "http://bwatch.rnl.tecnico.ulisboa.pt:8080", true);
	xhttp8.send("request=BackupUser_login");

	var xhttp9;

	xhttp9 = new XMLHttpRequest();
	xhttp9.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			exportCSVFile(JSON.parse(xhttp9.responseText), "BackupUsers", "user_id, project, u_start_time, u_finish_time, birth_date, user_string");
		}
	}
	xhttp9.open("POST", "http://bwatch.rnl.tecnico.ulisboa.pt:8080", true);
	xhttp9.send("request=BackupUsers");

}


function formatDate(input){
	var d = new Date(input);
    d.setHours(d.getHours() + (new Date().getTimezoneOffset() / 60) - 1);
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

function epsTime(input){

	var h = parseInt(input / 3600, 10);
	var m = parseInt((input - h * 3600) / 60, 10);
	var s = parseInt(input - h * 3600 - m * 60, 10);
	
	var aux = '';
	if(h < 10)
		aux += '0' + h + ':';
	else
		aux += h + ':';
	if(m < 10)
		aux += '0' + m + ':';
	else aux += m + ':';
	if(s < 10)
		aux += '0' + s;
	else
		aux += s;

	return aux;
};
*/

