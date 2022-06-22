
var server_url = <server_url>;

var segment_str = window.location.pathname;
var segment_array = segment_str.split('/');
var project_name = decodeURI(segment_array.pop());

var zip;
var count;
var total;
var xhttp;
var txt;
var datastructure = {};
var usersTable = document.getElementById('users');

document.getElementById("title").innerHTML = project_name;

xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200){
		txt = xhttp.responseText;
		if(txt != "[]"){
			var users = JSON.parse(txt);

			var header = usersTable.createTHead();
			var row2 = header.insertRow(0); 

			var headCell10 = row2.insertCell(0);
			var headCell9 = row2.insertCell(0);
			var headCell8 = row2.insertCell(0);
			if(users[0].has_devices == 'Yes')
				var headCell7 = row2.insertCell(0);
			var headCell6 = row2.insertCell(0);
			//var headCell5 = row2.insertCell(0);
			var headCell4 = row2.insertCell(0);
			var headCell3 = row2.insertCell(0);
			var headCell2 = row2.insertCell(0);

			headCell2.innerHTML = "<b>User Id</b>";
			headCell3.innerHTML = "<b>Start Time</b>";
			headCell4.innerHTML = "<b>Finish Time</b>";
			//headCell5.innerHTML = "<b>Duration</b>";
			headCell6.innerHTML = "<b>User Code</b>";
			if(users[0].has_devices == 'Yes')
				headCell7.innerHTML = "<b>Devices</b>";
			headCell8.innerHTML = "<b>Visualize</b>";
			headCell9.innerHTML = "<b>Download</b>";
			headCell10.innerHTML = "<b></b>";

			total = users.length;
			for (var i = 0; i < users.length; i++) {
				
				var row = usersTable.insertRow(usersTable.length);

				var cell10 = row.insertCell(0);
				var cell9 = row.insertCell(0);
				var cell8 = row.insertCell(0);
				if(users[i].has_devices == 'Yes')
					var cell7 = row.insertCell(0);
				var cell6 = row.insertCell(0);
				var cell4 = row.insertCell(0);
				var cell3 = row.insertCell(0);
				var cell2 = row.insertCell(0);
				
				cell2.innerHTML = users[i].user_id;
				if(users[i].u_start_time != null)
					cell3.innerHTML = formatDate(users[i].u_start_time);
				else
					cell3.innerHTML = '-';
				if(users[i].u_finish_time != null)
					cell4.innerHTML = formatDate(users[i].u_finish_time);
				else
					cell4.innerHTML = '-';
				cell6.innerHTML = users[i].user_string;
				if(users[i].has_devices == 'Yes')
					cell7.innerHTML = "<button  class=\'return\' onClick=\"location.href = '" + server_url + "/DevicesUser/" + project_name + "/" + users[i].user_id + "'\">Devices</button>";
				if(users[i].u_start_time != null){
					cell8.innerHTML = "<button  class=\'edit\' onClick=\"location.href = '" + server_url + "/UserSessions/" + project_name + "/User/" + users[i].user_id + "'\">Visualize</button>";
					cell9.innerHTML = '<a> <img src="../images/download.jpg" height="15" size="15" onClick="downloadUser(false, \'' + users[i].user_id + '\')"></a>';
					cell10.innerHTML = "<button  class=\'edit\' onClick=\"location.href = '" + server_url + "/UserEdit/" + project_name + "/" + users[i].user_id +"'\">Edit</button>";
				}
				else{
					cell8.innerHTML = ""
					cell9.innerHTML = ""
					cell10.innerHTML = "<button class=\'remove\' onClick=\"removeUser('" + users[i].user_string + "', this)\">Remove</button>";
				}
			}
		}
		else
			document.getElementById("announce").innerHTML = "No users in this project. Please add new users by pressing '+Add new user' below.";
	}
};
xhttp.open("GET", encodeURI(server_url + "/StudyUsers/" + project_name));
xhttp.send();

function CreateUsers(){
	
	var i;
	
	if(document.getElementById("quantity").value > 100)
		alert("Please add less than 100 users at a time.");
	else
		for(i = 0; i < document.getElementById("quantity").value; i++)
			setTimeout(CreateUser, i*300);
}

function CreateUser(){
	
	var xhttp;
	var txt;

	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			txt = xhttp.responseText;
			if(txt != "[]"){
				var users = JSON.parse(txt);

				if(usersTable.getElementsByTagName("tr").length == 0){
					
					document.getElementById("announce").innerHTML = "";

					var header = usersTable.createTHead();
					var row2 = header.insertRow(0); 

					var headCell10 = row2.insertCell(0);
					var headCell9 = row2.insertCell(0);
					var headCell8 = row2.insertCell(0);
					if(users[0].has_devices == 'Yes')
						var headCell7 = row2.insertCell(0);
					var headCell6 = row2.insertCell(0);
					//var headCell5 = row2.insertCell(0);
					var headCell4 = row2.insertCell(0);
					var headCell3 = row2.insertCell(0);
					var headCell2 = row2.insertCell(0);

					headCell2.innerHTML = "<b>User Id</b>";
					headCell3.innerHTML = "<b>Start Time</b>";
					headCell4.innerHTML = "<b>Finish Time</b>";
					//headCell5.innerHTML = "<b>Duration</b>";
					headCell6.innerHTML = "<b>User Code</b>";
					if(users[0].has_devices == 'Yes')
						headCell7.innerHTML = "<b>Devices</b>";
					headCell8.innerHTML = "<b>Visualize</b>";
					headCell9.innerHTML = "<b>Download</b>";
					headCell10.innerHTML = "<b></b>";
				}
				
				var row = usersTable.insertRow(usersTable.length);

				var cell10 = row.insertCell(0);
				var cell9 = row.insertCell(0);
				var cell8 = row.insertCell(0);
				if(users[0].has_devices == 'Yes')
					var cell7 = row.insertCell(0);
				var cell6 = row.insertCell(0);
				var cell4 = row.insertCell(0);
				var cell3 = row.insertCell(0);
				var cell2 = row.insertCell(0);
				
				cell2.innerHTML = users[0].user_id;
				cell3.innerHTML = '-';
				cell4.innerHTML = '-';
				cell6.innerHTML = users[0].user_string;
				if(users[0].has_devices == 'Yes')
					cell7.innerHTML = "<button  class=\'return\' onClick=\"location.href = '" + server_url + "/DevicesUser/" + project_name + "/" + users[0].user_id + "'\">Devices</button>";
				cell8.innerHTML = '';
				cell9.innerHTML = '';
				cell10.innerHTML = "<button  class=\'remove\' onClick=\"removeUser('" + users[0].user_string + "', this)\">Remove</button>";
			}
		}
	};
	xhttp.open("POST", encodeURI(server_url + "/CreateUser/" + project_name));
	xhttp.send();
}

function removeUser(user_code, row){
	
	var xhttp;
	var txt;

	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			txt = xhttp.responseText;
			if(txt != "[]"){
				deleteUserRow (row);
			}
		}
	};
	xhttp.open("POST", encodeURI(server_url + "/RemoveUser/" + project_name + "/" + user_code));
	xhttp.send();	
}

function deleteUserRow (row, table_name) {
      var d = row.parentNode.parentNode.rowIndex;
      usersTable.deleteRow(d);
};

function convertToCSV(objArray) {
    var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    var str = '';
	//str += "user ID, session ID, device ID, time, hr, gyro_x, gyro_y, gyro_z, acc_x, acc_y, acc_z, series title, season nr, eps nr, epis title, epis time, action, flag\r\n"
	str += "user ID, session ID, time, series title, season nr, eps nr, epis title, epis time, action, ID\r\n"
    for (var i = 0; i < array.length; i++) {
        var line = '';
        for (var index in array[i]) {
            if (line != '') line += ','
			if(index=='data_diahr')
				line += formatDate(array[i][index]);
			else
				/*if(index=='ID'){
					if(datastructure[array[i][index]] === undefined)
						line += '0';
					else
						line += datastructure[array[i][index]];
				}
				else*/
					if(index=='eps_time'){
						if(array[i][index] == null)
							line += array[i][index];
						else
							line += epsTime(array[i][index]);
					}
					else
						if(index=='series_title' || index=='series_title2' || index=='eps_t')
							line += '"' + array[i][index] + '"';
						else
							line += array[i][index];
        }
        str += line + '\r\n';
    }
    return str;
}

function exportCSVFile(is_zip, items, user) {
    // Convert Object to JSON
    var jsonObject = JSON.stringify(items);
    var csv = this.convertToCSV(jsonObject);

    var exportedFilename = 'User' + user + '.csv';

	if(is_zip){
		count++;
		document.getElementById("announce").innerHTML = 'Downloading... User ' + count + '/' + (total + 1);
		zip.file(exportedFilename, csv);
		if(count == total){
			zip.generateAsync({type:"blob"})
			.then(function(content) {
				saveAs(content, project_name + "_Users.zip");
			});
			document.getElementById("announce").innerHTML = '';
		}
	}
	else{
		var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
		if (navigator.msSaveBlob) { // IE 10+
			navigator.msSaveBlob(blob, exportedFilename);
		} else {
			var link = document.createElement("a");
			if (link.download !== undefined) { // feature detection
				// Browsers that support HTML5 download attribute
				var url = URL.createObjectURL(blob);
				link.setAttribute("href", url);
				link.setAttribute("download", exportedFilename);
				link.style.visibility = 'hidden';
				document.body.appendChild(link);
				link.click();
				document.body.removeChild(link);
			}
		}
	}
}

async function downloadAll(){

	zip = new JSZip();
	//await updateDataStructure();
	count = 0;
	
	var rows = document.getElementById('users').rows;
	
	for(var i = 1; i < rows.length; i++){
		downloadUser(true, rows[i].cells[0].textContent);
	}
}

function downloadUser(is_zip, user){
	var xhttp2;
	
	//if(!is_zip)
	//	updateDataStructure();
	
	xhttp2 = new XMLHttpRequest();
	xhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			exportCSVFile(is_zip, JSON.parse(xhttp2.responseText), user);
		}
	}
	xhttp2.open("POST", encodeURI(server_url + "/DownloadUserSimple/" + project_name + "/" + user, true));
	xhttp2.send();
}

function updateDataStructure(){

	var xhttp3;
	datastructrcture = {};

	xhttp3 = new XMLHttpRequest();
	xhttp3.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			txt2 = xhttp3.responseText;
			if(txt2 != "[]"){
				//Identify errors
				var extensionSession2 = JSON.parse(txt2);
				for(var i = 0; i < extensionSession2.length; i++){
					
					if(!((extensionSession2[i].action == 'Opened Tab') ||
					
					(extensionSession2[i].action == 'Closed Tab' && (i == extensionSession2.length - 1 || extensionSession2[i].user_id != extensionSession2[i+1].user_id || extensionSession2[i].session_code != extensionSession2[i+1].session_code || (extensionSession2[i].user_id == extensionSession2[i+1].user_id && extensionSession2[i].session_code == extensionSession2[i+1].session_code && extensionSession2[i+1].action != 'Stopped watching'))) ||

					((extensionSession2[i].action == 'Logout' || extensionSession2[i].action == 'Login') && i != 0 && extensionSession2[i-1].action  == 'Opened Tab' && (extensionSession2[i-1].data_diahr == extensionSession2[i].data_diahr || extensionSession2[i+1].action  == 'Closed Tab')) ||

					((extensionSession2[i].action == 'Skipped Intro' || extensionSession2[i].action.includes('Clicked: ') || extensionSession2[i].action == 'Skipped Credits' || extensionSession2[i].action == 'Skipped Recap' || extensionSession2[i].action == 'Ended Episode') && i != 0 && extensionSession2[i].series_title != null && extensionSession2[i].eps_time != null) ||

					(extensionSession2[i].action == 'Started watching' && i != 0 && extensionSession2[i].series_title !== "" && extensionSession2[i].eps_time !== "" && Math.abs(Math.abs(parseInt(extensionSession2[i].eps_time_aux != null ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i+1].eps_time_aux != null ? extensionSession2[i+1].eps_time_aux : extensionSession2[i+1].eps_time, 10)) - Math.abs(new Date(extensionSession2[i].data_diahr).getTime()/1000 - new Date(extensionSession2[i+1].data_diahr).getTime()/1000)) < 2 && (extensionSession2[i-1].action == 'Opened Tab' || extensionSession2[i-1].action.includes("Search: ") || (extensionSession2[i-1].action == 'Played' && Math.abs(parseInt(extensionSession2[i].eps_time_aux != null ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i-1].eps_time_aux ? extensionSession2[i-1].eps_time_aux : extensionSession2[i-1].eps_time, 10)) < 2 && extensionSession2[i].series_title == extensionSession2[i-1].series_title && extensionSession2[i].season == extensionSession2[i-1].season && extensionSession2[i].eps_nr == extensionSession2[i-1].eps_nr) || extensionSession2[i-1].action == 'Stopped watching')) ||
					
					(extensionSession2[i].action == 'Stopped watching' && i != 0 && extensionSession2[i].series_title !== "" && extensionSession2[i].eps_time !== "" && extensionSession2[i].series_title == extensionSession2[i-1].series_title && extensionSession2[i].season == extensionSession2[i-1].season && extensionSession2[i].eps_nr == extensionSession2[i-1].eps_nr && ((extensionSession2[i-1].action == 'Started watching' && Math.abs(Math.abs(parseInt(extensionSession2[i].eps_time_aux != null ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i-1].eps_time_aux != null ? extensionSession2[i-1].eps_time_aux : extensionSession2[i-1].eps_time, 10)) - Math.abs(new Date(extensionSession2[i].data_diahr).getTime()/1000 - new Date(extensionSession2[i-1].data_diahr).getTime()/1000)) < 2) || (extensionSession2[i-1].action == 'Skipped Recap' || extensionSession2[i-1].action.includes('Clicked: ') || extensionSession2[i-1].action == 'Ended Episode' ) || extensionSession2[i-1].action == 'Skipped Credits' || (extensionSession2[i-1].action == 'Played' && Math.abs(Math.abs(parseInt(extensionSession2[i].eps_time_aux ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i-1].eps_time_aux != null ? extensionSession2[i-1].eps_time : extensionSession2[i-1].eps_time, 10)) - Math.abs(new Date(extensionSession2[i].data_diahr).getTime()/1000 - new Date(extensionSession2[i-1].data_diahr).getTime()/1000)) < 2) || (extensionSession2[i-1].action == 'Paused' && Math.abs(parseInt(extensionSession2[i].eps_time_aux != null ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i-1].eps_time_aux != null ? extensionSession2[i-1].eps_time_aux : extensionSession2[i-1].eps_time, 10)) < 2) || ((extensionSession2[i-1].action == 'Forwarded/Rewound' || extensionSession2[i-1].action == 'Forwarded' || extensionSession2[i-1].action == 'Rewound') && Math.abs(parseInt(extensionSession2[i].eps_time_aux != null ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i-1].eps_time_aux != null ? extensionSession2[i-1].eps_time_aux : extensionSession2[i-1].eps_time, 10)) < 2))) ||
					
					(extensionSession2[i].action == 'Paused' && i != 0 && extensionSession2[i].series_title !== "" && extensionSession2[i].eps_time !== "" && (extensionSession2[i-1].action == 'Skipped Credits' || (extensionSession2[i-1].action == 'Skipped Recap' || extensionSession2[i-1].action.includes('Clicked: ') || extensionSession2[i-1].action == 'Skipped Intro') || (extensionSession2[i].series_title == extensionSession2[i-1].series_title && extensionSession2[i].season == extensionSession2[i-1].season && extensionSession2[i].eps_nr == extensionSession2[i-1].eps_nr && ((extensionSession2[i-1].action == 'Played' && Math.abs(Math.abs(parseInt(extensionSession2[i].eps_time_aux != null ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i-1].eps_time_aux != null ? extensionSession2[i-1].eps_time_aux : extensionSession2[i-1].eps_time, 10)) - Math.abs(new Date(extensionSession2[i].data_diahr).getTime()/1000 - new Date(extensionSession2[i-1].data_diahr).getTime()/1000)) < 2) || (extensionSession2[i-1].action == 'Started watching' && Math.abs(Math.abs(parseInt(extensionSession2[i].eps_time_aux != null ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i-1].eps_time_aux != null ? extensionSession2[i-1].eps_time_aux : extensionSession2[i-1].eps_time, 10)) - Math.abs(new Date(extensionSession2[i].data_diahr).getTime()/1000 - new Date(extensionSession2[i-1].data_diahr).getTime()/1000)) < 2))))) ||

					((extensionSession2[i].action == 'Forwarded/Rewound' || extensionSession2[i].action == 'Forwarded' || extensionSession2[i].action == 'Rewound') && i != 0 && extensionSession2[i].series_title !== "" && extensionSession2[i].eps_time !== "" && extensionSession2[i].series_title == extensionSession2[i-1].series_title && extensionSession2[i].season == extensionSession2[i-1].season && extensionSession2[i].eps_nr == extensionSession2[i-1].eps_nr && ((extensionSession2[i-1].action == 'Forwarded/Rewound' || extensionSession2[i-1].action == 'Forwarded' || extensionSession2[i-1].action == 'Rewound' || extensionSession2[i-1].action == 'Skipped Recap' || extensionSession2[i-1].action.includes('Clicked: ') || extensionSession2[i-1].action == 'Skipped Intro' || extensionSession2[i-1].action == 'Skipped Credits' || extensionSession2[i-1].action == 'Ended Episode') || extensionSession2[i-1].action == 'Paused')) ||
					
					(extensionSession2[i].action == 'Played' && i != 0 && extensionSession2[i].series_title !== "" && extensionSession2[i].eps_time !== "" && Math.abs(Math.abs(parseInt(extensionSession2[i].eps_time_aux != null ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i+1].eps_time_aux != null ? extensionSession2[i+1].eps_time_aux : extensionSession2[i+1].eps_time, 10)) - Math.abs(new Date(extensionSession2[i].data_diahr).getTime()/1000 - new Date(extensionSession2[i+1].data_diahr).getTime()/1000)) < 2 && (((extensionSession2[i-1].action == 'Paused' || extensionSession2[i-1].action == 'Rewound' || extensionSession2[i-1].action == 'Forwarded/Rewound' || extensionSession2[i-1].action == 'Forwarded' || extensionSession2[i-1].action == 'Started watching' || extensionSession2[i+1].action == 'Skipped Recap' || extensionSession2[i+1].action.includes('Clicked: ') || extensionSession2[i+1].action == 'Skipped Intro' || extensionSession2[i+1].action == 'Skipped Credits' || extensionSession2[i+1].action == 'Ended Episode') && Math.abs(parseInt(extensionSession2[i].eps_time_aux != null ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i-1].eps_time_aux ? extensionSession2[i-1].eps_time_aux : extensionSession2[i-1].eps_time, 10)) < 2 && extensionSession2[i].series_title == extensionSession2[i-1].series_title && extensionSession2[i].season == extensionSession2[i-1].season && extensionSession2[i].eps_nr == extensionSession2[i-1].eps_nr) || ((extensionSession2[i-1].action == 'Stopped watching' || extensionSession2[i-1].action == 'Opened Tab' || extensionSession2[i-1].action.includes("Search: ")) && extensionSession2[i+1].action == 'Started watching' && Math.abs(parseInt(extensionSession2[i].eps_time_aux != null ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i+1].eps_time_aux != null ? extensionSession2[i+1].eps_time_aux : extensionSession2[i+1].eps_time, 10)) < 2 && extensionSession2[i].series_title == extensionSession2[i+1].series_title && extensionSession2[i].season == extensionSession2[i+1].season && extensionSession2[i].eps_nr == extensionSession2[i+1].eps_nr))) ||
					
					(extensionSession2[i].action.includes("Search: ") && i != 0 && ((extensionSession2[i-1].action.includes("Search: ") || extensionSession2[i-1].action == 'Opened Tab' || extensionSession2[i-1].action == 'Stopped watching') || (extensionSession2[i-1].action == 'Closed Tab' && extensionSession2[i+1].action.includes("Search: ")))))){
						
						if(i != 0 && (extensionSession2[i].series_title === "" || extensionSession2[i].eps_time === "")){
							datastructure[extensionSession2[i].ID] = 1; //Empty
						}
						else {
							if(i != 0 && (((extensionSession2[i].action == 'Started watching' || extensionSession2[i].action == 'Played') && Math.abs(parseInt(extensionSession2[i].eps_time_aux != null ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i+1].eps_time_aux != null ? extensionSession2[i+1].eps_time_aux : extensionSession2[i+1].eps_time, 10)) <= Math.abs(new Date(extensionSession2[i].data_diahr).getTime()/1000 - new Date(extensionSession2[i+1].data_diahr).getTime()/1000) && extensionSession2[i].series_title == extensionSession2[i+1].series_title && extensionSession2[i].eps_dur == extensionSession2[i+1].eps_dur && extensionSession2[i].season == extensionSession2[i+1].season && extensionSession2[i].eps_nr == extensionSession2[i+1].eps_nr && extensionSession2[i].eps_code == extensionSession2[i+1].eps_code) ||

							((extensionSession2[i].action == 'Paused' || extensionSession2[i].action == 'Stopped watching') && (extensionSession2[i-1].action == 'Played' || extensionSession2[i-1].action == 'Started watching') && Math.abs(parseInt(extensionSession2[i].eps_time_aux != null ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i-1].eps_time_aux != null ? extensionSession2[i-1].eps_time_aux : extensionSession2[i-1].eps_time, 10)) < Math.abs(new Date(extensionSession2[i].data_diahr).getTime()/1000 - new Date(extensionSession2[i-1].data_diahr).getTime()/1000) && extensionSession2[i].series_title == extensionSession2[i-1].series_title && extensionSession2[i].eps_dur == extensionSession2[i-1].eps_dur && extensionSession2[i].season == extensionSession2[i-1].season && extensionSession2[i].eps_nr == extensionSession2[i-1].eps_nr && extensionSession2[i].eps_code == extensionSession2[i-1].eps_code))){
									datastructure[extensionSession2[i].ID] = 0; // Delay
							}
							else{
								if(i != 0 && (((extensionSession2[i].action == 'Forwarded/Rewound' || extensionSession2[i].action == 'Forwarded' || extensionSession2[i].action == 'Rewound') && extensionSession2[i].series_title == extensionSession2[i-1].series_title && extensionSession2[i].season == extensionSession2[i-1].season && extensionSession2[i].eps_nr == extensionSession2[i-1].eps_nr &&
								((extensionSession2[i-2].action == 'Paused' && extensionSession2[i].season == extensionSession2[i-2].season && extensionSession2[i].eps_nr == extensionSession2[i-2].eps_nr && (((extensionSession2[i-1].action == 'Skipped Intro' || extensionSession2[i-1].action.includes('Clicked: ') || extensionSession2[i-1].action == 'Skipped Recap') && Math.abs(parseInt(extensionSession2[i-1].eps_time, 10) - parseInt(extensionSession2[i-2].eps_time, 10)) < 2 && extensionSession2[i+1].action == 'Played' && Math.abs(parseInt(extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i+1].eps_time, 10)) < 2) ||
								(extensionSession2[i-1].action == 'Played' && Math.abs(parseInt(extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i-1].eps_time, 10)) < 2) && extensionSession2[i-2].action == 'Paused') && extensionSession2[i].series_title == extensionSession2[i-2].series_title && extensionSession2[i].season == extensionSession2[i-2].season && extensionSession2[i].eps_nr == extensionSession2[i-2].eps_nr) ||
								(extensionSession2[i+1].action == 'Paused' && extensionSession2[i+2].action == 'Played')) ||
								
								(extensionSession2[i].action == 'Paused' && (((extensionSession2[i-1].action == 'Forwarded/Rewound' || extensionSession2[i-1].action == 'Forwarded' || extensionSession2[i-1].action == 'Rewound') && extensionSession2[i-2].action == 'Played') || (extensionSession2[i-1].action == 'Stopped watching' && (extensionSession2[i-2].action == 'Started watching' || extensionSession2[i-2].action == 'Played'))))) ||
								
								(extensionSession2[i].action == 'Played' && (((extensionSession2[i+1].action == 'Forwarded/Rewound' || extensionSession2[i+1].action == 'Forwarded' || extensionSession2[i+1].action == 'Rewound') && extensionSession2[i-1].action == 'Paused') || (extensionSession2[i-1].action == 'Paused' && (extensionSession2[i-2].action == 'Forwarded/Rewound' || extensionSession2[i-2].action == 'Forwarded' || extensionSession2[i-2].action == 'Rewound')) || (extensionSession2[i+1].action == 'Paused' && (extensionSession2[i+2].action == 'Forwarded/Rewound' || extensionSession2[i+2].action == 'Forwarded' || extensionSession2[i+2].action == 'Rewound')))) ||

								((extensionSession2[i].action == 'Login' || extensionSession2[i].action == 'Logout') && extensionSession2[i-1].action == 'Closed Tab' && extensionSession2[i-2].action == 'Opened Tab' && extensionSession2[i-1].data_diahr == extensionSession2[i].data_diahr) ||

								(extensionSession2[i].action == 'Closed Tab' && extensionSession2[i+1].action == 'Stopped watching' && extensionSession2[i+1].data_diahr == extensionSession2[i].data_diahr) ||
								
								(extensionSession2[i].action.includes("Search: ") && extensionSession2[i-1].action == 'Closed Tab' && (extensionSession2[i].user_id != extensionSession2[i+1].user_id || extensionSession2[i].session_code != extensionSession2[i+1].session_code)) ||

								(extensionSession2[i].action == 'Started watching' && extensionSession2[i+1].action == 'Stopped watching' && extensionSession2[i+1].data_diahr == extensionSession2[i].data_diahr && extensionSession2[i].series_title == extensionSession2[i+2].series_title && extensionSession2[i].season == extensionSession2[i+2].season && extensionSession2[i].eps_nr == extensionSession2[i+2].eps_nr && extensionSession2[i-1].series_title == extensionSession2[i+1].series_title && extensionSession2[i-1].season == extensionSession2[i+1].season && extensionSession2[i-1].eps_nr == extensionSession2[i+1].eps_nr) ||
								
								(extensionSession2[i].action == 'Stopped watching' && (((extensionSession2[i-1].action == 'Forwarded/Rewound' || extensionSession2[i-1].action == 'Forwarded' || extensionSession2[i-1].action == 'Rewound') && extensionSession2[i-2].action == 'Played' && extensionSession2[i-3].action == 'Paused') || (extensionSession2[i-1].action == 'Closed Tab' && extensionSession2[i-1].data_diahr == extensionSession2[i].data_diahr) || (extensionSession2[i-1].action == 'Started watching' && extensionSession2[i].series_title == extensionSession2[i-2].series_title && extensionSession2[i].season == extensionSession2[i-2].season && extensionSession2[i].eps_nr == extensionSession2[i-2].eps_nr && extensionSession2[i-1].series_title == extensionSession2[i+1].series_title && extensionSession2[i-1].season == extensionSession2[i+1].season && extensionSession2[i-1].eps_nr == extensionSession2[i+1].eps_nr && extensionSession2[i-1].data_diahr == extensionSession2[i].data_diahr))))){
									datastructure[extensionSession2[i].ID] = 0; // Out of order
								}
								else{
									if(i != 0 && extensionSession2[i].action == extensionSession2[i-1].action && extensionSession2[i].series_title == extensionSession2[i-1].series_title && extensionSession2[i].season == extensionSession2[i-1].season && extensionSession2[i].eps_nr == extensionSession2[i-1].eps_nr && parseInt(extensionSession2[i].eps_time, 10) == parseInt(extensionSession2[i-1].eps_time, 10) && new Date(extensionSession2[i].data_diahr).getTime()/1000 == new Date(extensionSession2[i-1].data_diahr).getTime()/1000){
										datastructure[extensionSession2[i].ID] = 1; // Repeated
									}
									else{
										if(i != 0 && ((extensionSession2[i].action == 'Started watching' && extensionSession2[i-1].action == 'Stopped watching' && (extensionSession2[i].series_title != extensionSession2[i-1].series_title || extensionSession2[i].season != extensionSession2[i-1].season || extensionSession2[i].eps_nr != extensionSession2[i-1].eps_nr) && Math.abs(parseInt(extensionSession2[i].eps_time_aux != null ? extensionSession2[i].eps_time_aux : extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i-1].eps_time_aux != null ? extensionSession2[i-1].eps_time_aux : extensionSession2[i-1].eps_time, 10)) < 2 && Math.abs(new Date(extensionSession2[i].data_diahr).getTime()/1000 - new Date(extensionSession2[i-1].data_diahr).getTime()/1000) < 2 ) || (extensionSession2[i].action == 'Played' && extensionSession2[i-1].action == 'Started watching' && extensionSession2[i-2].action == 'Stopped watching' && extensionSession2[i].series_title == extensionSession2[i-1].series_title && extensionSession2[i].season == extensionSession2[i-1].season && extensionSession2[i].eps_nr == extensionSession2[i-1].eps_nr && (extensionSession2[i].series_title != extensionSession2[i-2].series_title || extensionSession2[i].season != extensionSession2[i-2].season || extensionSession2[i].eps_nr != extensionSession2[i-2].eps_nr) && Math.abs(parseInt(extensionSession2[i-1].eps_time_aux != null ? extensionSession2[i-1].eps_time_aux : extensionSession2[i-1].eps_time, 10) - parseInt(extensionSession2[i-2].eps_time_aux != null ? extensionSession2[i-2].eps_time_aux : extensionSession2[i-2].eps_time, 10)) < 2 && Math.abs(new Date(extensionSession2[i-1].data_diahr).getTime()/1000 - new Date(extensionSession2[i-2].data_diahr).getTime()/1000) < 2))){
											datastructure[extensionSession2[i].ID] = 0; // Transition
										}
										else{
											if(i != 0 && (((extensionSession2[i].action == 'Started watching' || extensionSession2[i].action == 'Played') && Math.abs(parseInt(extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i+1].eps_time, 10)) > Math.abs(new Date(extensionSession2[i].data_diahr).getTime()/1000 - new Date(extensionSession2[i+1].data_diahr).getTime()/1000)) ||

											(extensionSession2[i].action == 'Played' && Math.abs(parseInt(extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i-1].eps_time, 10)) > Math.abs(new Date(extensionSession2[i].data_diahr).getTime()/1000 - new Date(extensionSession2[i-1].data_diahr).getTime()/1000)) ||

											((extensionSession2[i].action == 'Paused' || extensionSession2[i].action == 'Stopped watching') && (extensionSession2[i-1].action == 'Played' || extensionSession2[i-1].action == 'Started watching') && Math.abs(parseInt(extensionSession2[i].eps_time, 10) - parseInt(extensionSession2[i-1].eps_time, 10)) > Math.abs(new Date(extensionSession2[i].data_diahr).getTime()/1000 - new Date(extensionSession2[i-1].data_diahr).getTime()/1000)))){
												datastructure[extensionSession2[i].ID] = 0; // More time played than time passed
											}
											else{
												datastructure[extensionSession2[i].ID] = 1;
											}
										}
									}
								}
							}
						}
					}
					else{
						datastructure[extensionSession2[i].ID] = 0;
					}
				}
			}
		}
	}
	xhttp3.open("POST", encodeURI(server_url + "/ProjectActions2/" + project_name, true));
	xhttp3.send();

}

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

function getDuration(d1, d2) {
    d = new Date(d2 - d1);
	d.setHours(d.getHours() + (new Date().getTimezoneOffset() / 60) + 1);
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