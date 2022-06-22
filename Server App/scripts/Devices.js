
var server_url = <server_url>;

var segment_str = window.location.pathname;
var segment_array = segment_str.split('/');
var project_name = decodeURI(segment_array.pop());

document.getElementById("title").innerHTML = project_name;

var devicesTable = document.getElementById('devices');
var header = devicesTable.createTHead();
var row = header.insertRow(0);    

var headCell6 = row.insertCell(0);
var headCell5 = row.insertCell(0);
var headCell4 = row.insertCell(0);
var headCell3 = row.insertCell(0);
var headCell2 = row.insertCell(0);

headCell2.innerHTML = "<b>Device Id</b>";
headCell3.innerHTML = "<b>Model</b>";
headCell4.innerHTML = "<b>Added Time</b>";
headCell5.innerHTML = "<b>Availability</b>";
headCell6.innerHTML = "<b>Remove</b>";
var div = document.getElementById('users');

var xhttp4;
var txt4;

xhttp4 = new XMLHttpRequest();

xhttp4.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		
		txt4 = xhttp4.responseText;
		if(txt4 != "[]"){
			var users = JSON.parse(txt4);
			
			var x = document.createElement("SELECT");
			x.setAttribute("id", "user_name");
			var k = document.createElement("br");
			div.appendChild(k);
			var z, t;
			z = document.createElement("option");
			z.setAttribute("value", null);
			t = document.createTextNode(" ");
			z.appendChild(t);
			x.appendChild(z);
			for (var i = 0; i < users.length; i++) {
				z = document.createElement("option");
				z.setAttribute("value", users[i].user_id);
				t = document.createTextNode(users[i].user_id);
				z.appendChild(t);
				x.appendChild(z);
			}
			t = document.createTextNode("User:  ");
			div.appendChild(t);
			div.appendChild(x);
		
			document.getElementById('user_name').addEventListener('change', Reload2);
		}
	}
};
xhttp4.open("GET", encodeURI(server_url + "/StudyUsers/" + project_name));
xhttp4.send();

var xhttp;
var txt;
var div2 = document.getElementById('devices2');

xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		txt = xhttp.responseText;
		if(txt != "[]"){
			var devices = JSON.parse(txt);
						
			var x = document.createElement("SELECT");
			x.setAttribute("id", "device_name2");
			var k = document.createElement("br");
			div2.appendChild(k);
			var z, t;
			z = document.createElement("option");
			z.setAttribute("value", null);
			t = document.createTextNode(" ");
			z.appendChild(t);
			x.appendChild(z);

			for (var i = 0; i < devices.length; i++) {
				
				var row = devicesTable.insertRow(devicesTable.length);

				var cell6 = row.insertCell(0);
				var cell5 = row.insertCell(0);
				var cell4 = row.insertCell(0);
				var cell3 = row.insertCell(0);
				var cell2 = row.insertCell(0);

				cell2.innerHTML = devices[i].device_id;
				cell3.innerHTML = devices[i].model;
				cell4.innerHTML = formatDate(devices[i].added_time);
				if(devices[i].user_id != null){
					cell5.innerHTML = "User " + devices[i].user_id;
					cell6.innerHTML = "";
				}
				else{
					cell5.innerHTML = "Available";
					cell6.innerHTML = "<button class=\'remove\' onclick=\"removeDevice(" + devices[i].device_id + ", this)\">Remove</button>";
				}
				
				z = document.createElement("option");
				z.setAttribute("value", devices[i].device_id);
				t = document.createTextNode(devices[i].model + " - id: " + devices[i].device_id);
				z.appendChild(t);
				x.appendChild(z);
			}

			t = document.createTextNode("Device:  ");
			div2.appendChild(t);
			div2.appendChild(x);
			div2.appendChild(document.createElement("br"));
			div2.appendChild(document.createElement("br"));
			x = document.createElement("div");
			x.setAttribute("id", "save2");
			div2.appendChild(x);
		
			document.getElementById('device_name2').addEventListener('change', Reload2);
		}
	}
};
xhttp.open("GET", encodeURI(server_url + "/StudyDevices/" + project_name));
xhttp.send();

var d = new Date();
var date = d.getFullYear() + "-";
if(d.getMonth() < 10)
	date += "0" + (parseInt(d.getMonth())+1);
else
	date += (parseInt(d.getMonth())+1);
date += "-";
if(d.getDate() < 10)
	date += "0" + d.getDate();
else
	date += d.getDate();
date += 'T00:00'
document.getElementById('start_date').value = date;


function Reload2(){
	
	HideSave2();

	var device_name2 = document.getElementById('device_name2');
	var user_name = document.getElementById('user_name');
	if(device_name2.value != "null" && user_name.value != "null")
		UnlockSave2();
}

function HideSave2() {
	ClearChildNodes ('save2');
}

function UnlockSave2 () {
	
	var saveButton = document.getElementById("save2");
	var z = document.createElement("button");
	var t = document.createTextNode("+ Assign new device to an user");
	z.appendChild(t);
	z.classList.add("save");
	saveButton.appendChild(z);
	document.getElementById('save2').addEventListener('click', SendRequest2);
}

function SendRequest2(){
	
	var xhttp;
	var txt;

	xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				window.location.href = server_url + "/Devices/" + project_name;
		}		
	}

	xhttp.open("POST", encodeURI(server_url + "/AddTrackDeviceStudy/" + project_name + "/" + document.getElementById('user_name').value + "/" + document.getElementById('device_name2').value + "/" + document.getElementById('start_date').value));
	xhttp.send();
	
}

var div3 = document.getElementById('AddDevice');

var xhttp3;
var txt3;

xhttp3 = new XMLHttpRequest();

xhttp3.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		
		txt3 = xhttp3.responseText;
		if(txt3 != "[]"){
			var devices = JSON.parse(txt3);
			
			var x = document.createElement("SELECT");
			x.setAttribute("id", "device_name");
			var k = document.createElement("br");
			div3.appendChild(k);
			var z, t;
			z = document.createElement("option");
			z.setAttribute("value", null);
			t = document.createTextNode(" ");
			z.appendChild(t);
			x.appendChild(z);
			for (var i = 0; i < devices.length; i++) {
				z = document.createElement("option");
				z.setAttribute("value", devices[i].device_id);
				t = document.createTextNode(devices[i].model + " - id: " + devices[i].device_id);
				z.appendChild(t);
				x.appendChild(z);
			}
			t = document.createTextNode("Add Device: ");
			div3.appendChild(t);
			div3.appendChild(x);
			div3.appendChild(document.createElement("br"));
			div3.appendChild(document.createElement("br"));
			x = document.createElement("div");
			x.setAttribute("id", "save");
			div3.appendChild(x);
		
			document.getElementById('device_name').addEventListener('change', DevicesReload);
		}
	}
};
xhttp3.open("GET", encodeURI(server_url + "/ActiveDevices/" + project_name));
xhttp3.send();


function DevicesReload(){
	
	HideSave();
	
	var device_name = document.getElementById('device_name');
	if(device_name.value != "null")
		UnlockSave();
}

function HideSave() {
	ClearChildNodes ('save');
}

function ClearChildNodes (id) {
	var status = document.getElementById(id);
	while (status.firstChild)
		status.removeChild(status.firstChild);
}

function UnlockSave () {
	
	var saveButton = document.getElementById("save");
	var z = document.createElement("button");
	var t = document.createTextNode("+ Add new device to the study");
	z.appendChild(t);
	z.classList.add("save");
	saveButton.appendChild(z);
	document.getElementById('save').addEventListener('click', SendRequest);
}

function SendRequest(){
	
	var xhttp;
	var txt;

	xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				window.location.href = server_url + "/Devices/" + project_name;
		}
	}

	xhttp.open("POST", encodeURI(server_url + "/AddDeviceStudy/" + project_name + "/" + document.getElementById('device_name').value));
	xhttp.send();
}

var devicesTrackingTable = document.getElementById('devicesTracking');

var header = devicesTrackingTable.createTHead();
var row3 = header.insertRow(0);   

var headCell18 = row3.insertCell(0);
var headCell17 = row3.insertCell(0);
var headCell15 = row3.insertCell(0);
var headCell14 = row3.insertCell(0);
var headCell13 = row3.insertCell(0);
var headCell12 = row3.insertCell(0);

headCell12.innerHTML = "<b>Device Id</b>";
headCell13.innerHTML = "<b>User</b>";
headCell14.innerHTML = "<b>Start Time</b>";
headCell15.innerHTML = "<b>Finish Time</b>";
headCell17.innerHTML = "<b>Edit</b>";
headCell18.innerHTML = "<b>Remove</b>";


var xhttp2;
var txt2;

xhttp2 = new XMLHttpRequest();
xhttp2.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		txt2 = xhttp2.responseText;
		if(txt2 != "[]"){
			var devicesTracking = JSON.parse(txt2);
			
			for (var i = 0; i < devicesTracking.length; i++) {
				
				var row2 = devicesTrackingTable.insertRow(devicesTable.length);

				var cell18 = row2.insertCell(0);
				var cell17 = row2.insertCell(0);
				var cell15 = row2.insertCell(0);
				var cell14 = row2.insertCell(0);
				var cell13 = row2.insertCell(0);
				var cell12 = row2.insertCell(0);

				cell12.innerHTML = devicesTracking[i].device_id;
				cell13.innerHTML = devicesTracking[i].user_id;
				cell14.innerHTML = formatDate(devicesTracking[i].d_start_time);
				if(devicesTracking[i].d_finish_time != null){
					cell15.innerHTML = formatDate(devicesTracking[i].d_finish_time);
				}
				else{
					cell15.innerHTML = " - ";
				}
				cell17.innerHTML = "<button class=\'edit\' onClick=\"location.href = 'DeviceTrackEdit.html?id=" + devicesTracking[i].ID + "&project=" + project_name + "'\">Edit</button>";
				cell18.innerHTML = "<button class=\'remove\' onclick=\"removeDeviceTracking(" + devicesTracking[i].ID + ", this)\">Remove</button>";
			}
		}
	}
};
xhttp2.open("GET", encodeURI(server_url + "/StudyDevicesTracking/" + project_name));
xhttp2.send();

function removeDevice(device_id, row){
	
	var xhttp;
	var txt;

	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			txt = xhttp.responseText;
			if(txt != ""){
				deleteDevicesRow (row);
			}
			else
				alert("Device '" + device_id + "' not found.");
		}
	};
	xhttp.open("POST", encodeURI(server_url + "/RemoveDeviceFromStudy/" + project_name + "/" + device_id));
	xhttp.send();	
}

function removeDeviceTracking(tracking_id, row){
	
	var xhttp;
	var txt;

	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			txt = xhttp.responseText;
			if(txt != ""){
				deleteTrackingRow (row);
			}
			else
				alert("Something went wrong.");
		}
	};
	xhttp.open("POST", encodeURI(server_url + "/RemoveDeviceTrackFromStudy/" + project_name + "/" + tracking_id));
	xhttp.send();	
}

function deleteDevicesRow (row, table_name) {
      var d = row.parentNode.parentNode.rowIndex;
      document.getElementById('devices').deleteRow(d);
};

function deleteTrackingRow (row, table_name) {
      var d = row.parentNode.parentNode.rowIndex;
      document.getElementById('devicesTracking').deleteRow(d);
};

function formatDate(input){
	var d = new Date(input);
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
