
var server_url = <server_url>;

var segment_str = window.location.pathname;
var segment_array = segment_str.split('/');
var user_id = decodeURI(segment_array.pop());
var project_name = decodeURI(segment_array.pop());

document.getElementById("return").action = "/Users/" + project_name;
document.getElementById("title").innerHTML = user_id;

var xhttp;
var txt;

var start;

xhttp = new XMLHttpRequest();

xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		
		txt = xhttp.responseText;
		if(txt != "[]"){
			
			document.getElementsByName('p_name')[0].value = project_name;
			document.getElementsByName('user_id')[0].value = user_id;
			var track = JSON.parse(txt);
			var d = new Date(track[0].u_start_time);
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
			start = date;
			document.getElementById('start_date_val').innerHTML = "Start date: " + formatDate(track[0].u_start_time);
			document.getElementsByName('finish_date_val')[0].min = date;

			if(track[0].u_finish_time != null){
				var d = new Date(track[0].u_finish_time);
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
				document.getElementsByName('finish_date_val')[0].value = date;
			}
			else{
				d.setDate(d.getDate()+14);
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
				document.getElementsByName('finish_date_val')[0].value = date;
			}
		}
	}
};
xhttp.open("GET", encodeURI(server_url + "/User/" + project_name + "/" + user_id));
xhttp.send();

function SendRequest(){

	var xhttp;
	var txt;

	xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
				window.location.href = "Users.html?project=" + getQueryVariable("project");
		}		
	}

	if(document.getElementById('finish_date_val').value != null && document.getElementById('finish_date_val').value != 0){
		if(document.getElementById('finish_date_val').value < start)
			alert("Finish date after start date");
		else{
			xhttp.open("POST", "http://bwdat.rnl.tecnico.ulisboa.pt:8080", true);
			xhttp.send("request=EditUser&user_id=" + getQueryVariable("user_id") + "&project=" + getQueryVariable("project") + "&finish_time=" + document.getElementById('finish_date_val').value);
		}
	}
	else
		alert("Finish date is not fully defined");
	
}

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
	return date;
};