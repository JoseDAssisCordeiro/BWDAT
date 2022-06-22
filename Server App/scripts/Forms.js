
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
var formsTable = document.getElementById('forms');

document.getElementById("title").innerHTML = project_name;

xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if(this.readyState == 4 && this.status == 200){
		txt = xhttp.responseText;
		if(txt != "[]"){
			var forms_data = JSON.parse(txt);

			var header = formsTable.createTHead();
			var row2 = header.insertRow(0); 

			var headCell4 = row2.insertCell(0);
			var headCell3 = row2.insertCell(0);
			var headCell2 = row2.insertCell(0);
			var headCell1 = row2.insertCell(0);

			headCell1.innerHTML = "<b>Streamer</b>";
			headCell2.innerHTML = "<b>Episode Code</b>";
			headCell3.innerHTML = "<b>Form</b>";
			headCell4.innerHTML = "<b></b>";

			for (var i = 0; i < forms_data.length; i++) {

				var row = formsTable.insertRow(formsTable.length);

				var cell4 = row.insertCell(0);
				var cell3 = row.insertCell(0);
				var cell2 = row.insertCell(0);
				var cell1 = row.insertCell(0);

				cell1.innerHTML = forms_data[i].streamer;
				cell2.innerHTML = forms_data[i].eps_code;
				cell3.innerHTML = forms_data[i].form;
				cell4.innerHTML = "<button  class=\'remove\' onClick=\"removeForm('" + forms_data[i].streamer + "', '" + forms_data[i].eps_code + "', this)\">Remove</button>";
			}
		}
		else
			document.getElementById("announce").innerHTML = "No forms in this project.";
	}
};
xhttp.open("GET", encodeURI(server_url + "/StudyForms/" + project_name));
xhttp.send();


function AddForm(){

	var xhttp;
	var txt;
	var url = document.getElementById("url").value;
	var eps_code = document.getElementById("eps_code").value;

	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			txt = xhttp.responseText;
			if(txt != ""){
				if(formsTable.getElementsByTagName("tr").length == 0){
					
					document.getElementById("announce").innerHTML = "";

					var header = formsTable.createTHead();
					var row2 = header.insertRow(0); 

					var headCell4 = row2.insertCell(0);
					var headCell3 = row2.insertCell(0);
					var headCell2 = row2.insertCell(0);
					var headCell1 = row2.insertCell(0);

					headCell2.innerHTML = "<b>Streamer</b>";
					headCell2.innerHTML = "<b>Episode Code</b>";
					headCell3.innerHTML = "<b>Form</b>";
					headCell4.innerHTML = "<b></b>";
				}

				var row = formsTable.insertRow(formsTable.length);

				var cell4 = row.insertCell(0);
				var cell3 = row.insertCell(0);
				var cell2 = row.insertCell(0);
				var cell1 = row.insertCell(0);

				cell1.innerHTML = "Netflix";
				cell2.innerHTML = eps_code;
				cell3.innerHTML = url;
				cell4.innerHTML = "<button  class=\'remove\' onClick=\"removeForm('Netflix', '" + eps_code + "', this)\">Remove</button>";
			}
			else
				alert("Something went wrong.");
		}
	};
	xhttp.open("POST", encodeURI(server_url + "/AddStudyForm/" + project_name + "/" + eps_code + "?url=" + url) );
	xhttp.send();
}

function removeForm(streamer, eps_code, row){
	
	var xhttp;
	var txt;

	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			txt = xhttp.responseText;
			if(txt != "[]"){
				deleteFormRow (row);
			}
		}
	};
	xhttp.open("POST", encodeURI(server_url + "/RemoveForm/" + project_name + "/" + streamer + "/" + eps_code));
	xhttp.send();	
}

function deleteFormRow (row, table_name) {
      var d = row.parentNode.parentNode.rowIndex;
      formsTable.deleteRow(d);
};
