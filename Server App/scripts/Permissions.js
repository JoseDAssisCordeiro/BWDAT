
var server_url = <server_url>;

var segment_str = window.location.pathname;
var segment_array = segment_str.split('/');
var project_name = decodeURI(segment_array.pop());

var permissionsTable = document.getElementById('permissions');
document.getElementById("title").innerHTML = project_name;

var header = permissionsTable.createTHead();
var row = header.insertRow(0);    

var headCell2 = row.insertCell(0);
var headCell1 = row.insertCell(0);
headCell1.innerHTML = "<b>User</b>";
headCell2.innerHTML = "<b>Remove</b>";

var xhttp;
var txt;

xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		txt = xhttp.responseText;
		if(txt != "[]"){
			var permissions = JSON.parse(txt);
			
			for (var i = 0; i < permissions.length; i++) {
				
				var row = permissionsTable.insertRow(permissionsTable.length);

				var cell2 = row.insertCell(0);
				var cell1 = row.insertCell(0);

				cell1.innerHTML = permissions[i].user_email;
				cell2.innerHTML = "<button class=\'remove\' onclick=\"removePermission('" + permissions[i].user_email + "', this)\">Remove</button>";
			}
		}
	}
};
xhttp.open("GET", encodeURI(server_url + "/StudyPermissions/" + project_name));
xhttp.send();

function removePermission(user_email, row){
	
	var xhttp;
	var txt;

	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			txt = xhttp.responseText;
			if(txt != "[]"){
				deletePermissionRow (row);
			}
		}
	};
	xhttp.open("POST", encodeURI(server_url + "/RemoveStudyPermission/" + project_name + "/" + user_email));
	xhttp.send();
};

function deletePermissionRow (row){
				
	var d = row.parentNode.parentNode.rowIndex;
	document.getElementById('permissions').deleteRow(d);
}

function AddPermission(){

	var xhttp;
	var txt;
	var newUser = document.getElementById("newPermission").value;

	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			txt = xhttp.responseText;
			if(txt != ""){
				var row = permissionsTable.insertRow(permissionsTable.length);

				var cell2 = row.insertCell(0);
				var cell1 = row.insertCell(0);

				cell1.innerHTML = newUser;
				cell2.innerHTML = "<button class=\'remove\' onclick=\"removePermission('" + newUser + "', this)\">Remove</button>";
			}
			else
				alert("User '" + newUser + "' does not exist.");
		}
	};
	xhttp.open("POST", encodeURI(server_url + "/AddStudyPermission/" + project_name + "/" + newUser));
	xhttp.send();
}