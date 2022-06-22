
var server_url = <server_url>;

var segment_str = window.location.pathname;
var segment_array = segment_str.split('/');
var user = decodeURI(segment_array.pop());
var project_name = decodeURI(segment_array.pop());
var project_name = decodeURI(segment_array.pop());

document.getElementById("title").innerHTML = ' User Sessions';
document.getElementById("user").innerHTML = user;

var xhttp3;
var txt3;

var z;
var sessions = [];
var div;

var dadosT = 0;
var hrT = 0;
var countT = 0;
var zerosT = 0;

xhttp3 = new XMLHttpRequest();
xhttp3.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		txt3 = xhttp3.responseText;
		if(txt3 != "[]"){
			
			var userSessions = JSON.parse(txt3);
			
			for(z = 0; z < userSessions.length; z++){
				sessions.push(userSessions[z].session);
			}
			document.getElementById("session").innerHTML = userSessions.length;
			graphics();
		}
	}
}
xhttp3.open("POST", server_url + "/UserSessions/" + project_name + "/" + user);
xhttp3.send();

if(countT != 0){
	document.getElementById("hr").innerHTML = "Heart Rate coverage: " + ((countT/dadosT)* 100).toFixed(2) + "%";
	document.getElementById("hravg").innerHTML = "Heart Rate average: " + (hrT/(countT-zerosT)).toFixed(1);
}
else{
	document.getElementById("hr").innerHTML = "Heart Rate coverage: 0.00%";
	document.getElementById("hravg").innerHTML = "Heart Rate average: NA";
}

function graphics() {}
/*
	var i;
	for(z = 0; z < sessions.length; z++){
		div = document.createElement("div");
		div.id = "chartContainer" + sessions[z];
		div.style.height = "200px";
		div.style.width = "90%";
		div.style.cursor = "pointer";
		div.onclick = function() {
			location.href = "http://web.ist.utl.pt/ist178614/ExtensionSessionHR.html?project=" + project_name + "&user= " + user + "&session=" + this.attributes[0].value.replace ( /[^\d.]/g, '' );
		}
		document.getElementById("chartContainer").appendChild(div);
		
		retrieveSession(sessions[z]);
	}
}

function retrieveSession(session){
	
	var xhttp2;
	var txt2;
	var dados;
	var start;
	
	var array0 = [];
	var array1 = [];
	var array2 = [];
	var array3 = [];
	var array4 = [];
	var array5 = [];
	var array6 = [];
	var array7 = [];
	var array8 = [];
	var array9 = [];
	var array10 = [];
	var array11 = [];
	var array12 = [];
	var array13 = [];
	var array14 = [];
	var array15 = [];

	var length;
	var init;
	xhttp2 = new XMLHttpRequest();
	xhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			txt2 = xhttp2.responseText;
			if(txt2 != "[]"){

				var extensionSession2 = JSON.parse(txt2);

				start = extensionSession2[0].data_diahr;

				init = new Date(extensionSession2[0].data_diahr);
				init.setHours(init.getHours() + (new Date().getTimezoneOffset() / 60+ 1));
				init = init.getTime()/1000;
				end = new Date(extensionSession2[extensionSession2.length-1].data_diahr);
				end.setHours(end.getHours() + (new Date().getTimezoneOffset() / 60) + 1);
				end = end.getTime()/1000;
				dados = end - init;
				dadosT += dados + 1;
				for(i = 0; i < dados + 1; i++){
					var date = new Date(extensionSession2[0].data_diahr);
					date.setHours(date.getHours() + (new Date().getTimezoneOffset() / 60) + 1);
					date.setSeconds(date.getSeconds() + i);
					var d = new Date(date.getYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
					array0.push({"x" : d, "y" : null, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s"});
					array10.push({"x" : d, "y" : null, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s"});
					array11.push({"x" : d, "y" : null, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s"});
					array12.push({"x" : d, "y" : null, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s"});
					array13.push({"x" : d, "y" : null, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s"});
					array14.push({"x" : d, "y" : null, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s"});
					array15.push({"x" : d, "y" : null, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s"});
				}
				for(i = 0; i < extensionSession2.length; i++){
					var date = new Date(extensionSession2[i].data_diahr);
					date.setHours(date.getHours() + (new Date().getTimezoneOffset() / 60) + 1);
					var d = new Date(date.getYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds());
					if(extensionSession2[i].action == "Closed Tab")
						array1.push({"x" : d, "y" : 1, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date, "eps_time" : null});
					else if(extensionSession2[i].action == "Stopped watching" || extensionSession2[i].action == "Stopped Watching")
						array2.push({"x" : d, "y" : 2, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date, "eps_time" : (extensionSession2[i].eps_time ? epsTime(extensionSession2[i].eps_time) : null)});
					else if(extensionSession2[i].action == "Paused")
						array3.push({"x" : d, "y" : 3, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date, "eps_time" : (extensionSession2[i].eps_time ? epsTime(extensionSession2[i].eps_time) : null)});
					else if(extensionSession2[i].action == "Forwarded/Rewound" || extensionSession2[i].action == "Forwarded" || extensionSession2[i].action == "Rewound")
						array4.push({"x" : d, "y" : 4, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date, "eps_time" : (extensionSession2[i].eps_time ? epsTime(extensionSession2[i].eps_time) : null)});
					else if(extensionSession2[i].action == "Played")
						array5.push({"x" : d, "y" : 5, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date, "eps_time" : (extensionSession2[i].eps_time ? epsTime(extensionSession2[i].eps_time) : null)});
					else if(extensionSession2[i].action == "Started Watching" || extensionSession2[i].action == "Started watching")
						array6.push({"x" : d, "y" : 6, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date, "eps_time" : (extensionSession2[i].eps_time ? epsTime(extensionSession2[i].eps_time) : null)});
					else if(extensionSession2[i].action == "Opened Tab")
						array7.push({"x" : d, "y" : 7, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date});
					else if(extensionSession2[i].action == "Login")
						array8.push({"x" : d, "y" : 8, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date});
					else
						array9.push({"x" : d, "y" : 9, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date});
				}
			}
		}
	}
	xhttp2.open("POST", "http://bwdat.rnl.tecnico.ulisboa.pt:8080", false);
	xhttp2.send("request=ProjectChromeSession&session=" + session + "&user=" + user + "&project=" + project_name);

	var xhttp;
	var txt;
				
	xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			txt = xhttp.responseText;
			if(txt != "[]"){
				
				var extensionSession = JSON.parse(txt);

				var sum = 0;
				var data = 0;
				var zero = 0;
				
				for (var i = 0; i < extensionSession.length; i++) {
					if((i < extensionSession.length - 1 && extensionSession[i].data_diahr != extensionSession[i+1].data_diahr) || (i == extensionSession.length - 1)){
						data++;
						if(extensionSession[i].hr == 0)
							zero++;
						else
							sum += extensionSession[i].hr;
					}
					var date = new Date(extensionSession[i].data_diahr);
					date.setHours(date.getHours() + (new Date().getTimezoneOffset() / 60));
					var pos = date.getTime()/1000 - init;
					

					array0[pos].y = extensionSession[i].hr;
					array10[pos].y = Math.abs(extensionSession[i].acc_x);
					array11[pos].y = Math.abs(extensionSession[i].acc_y);
					array12[pos].y = Math.abs(extensionSession[i].acc_z);
					array13[pos].y = extensionSession[i].gyro_x;
					array14[pos].y = extensionSession[i].gyro_y;
					array15[pos].y = extensionSession[i].gyro_z;

				}
				
				hrT += sum;
				countT += data;
				zerosT += zero;
				
				for(var j = 0; j < array1.length; j++){
					var posicao = array1[j].date.getTime()/1000 - init;
					if(array0[posicao].y != null)
						array1[j].y = array0[posicao].y;
				}
				for(var j = 0; j < array2.length; j++){
					var posicao = array2[j].date.getTime()/1000 - init;
					if(array0[posicao].y != null)
						array2[j].y = array0[posicao].y;
				}
				for(var j = 0; j < array3.length; j++){
					var posicao = array3[j].date.getTime()/1000 - init;
					if(array0[posicao].y != null)
						array3[j].y = array0[posicao].y;
				}
				for(var j = 0; j < array4.length; j++){
					var posicao = array4[j].date.getTime()/1000 - init;
					if(array0[posicao].y != null)
						array4[j].y = array0[posicao].y;
				}
				for(var j = 0; j < array5.length; j++){
					var posicao = array5[j].date.getTime()/1000 - init;
					if(array0[posicao].y != null)
						array5[j].y = array0[posicao].y;
				}
				for(var j = 0; j < array6.length; j++){
					var posicao = array6[j].date.getTime()/1000 - init;
					if(array0[posicao].y != null)
						array6[j].y = array0[posicao].y;
				}
				for(var j = 0; j < array7.length; j++){
					var posicao = array7[j].date.getTime()/1000 - init;
					if(array0[posicao].y != null)
						array7[j].y = array0[posicao].y;
				}
				for(var j = 0; j < array8.length; j++){
					var posicao = array8[j].date.getTime()/1000 - init;
					if(array0[posicao].y != null)
						array8[j].y = array0[posicao].y;
				}
				for(var j = 0; j < array9.length; j++){
					var posicao = array9[j].date.getTime()/1000 - init;
					if(array0[posicao].y != null)
						array9[j].y = array0[posicao].y;
				}

				var chart = new CanvasJS.Chart("chartContainer" + session, {
					title:{
						text: "Session " + session + "  Start: " + formatDate(start) + "  Duration: " +  epsTime(dados) + "s"
					},
					axisY:[
					{
						stripLines: [{
							value: sum/(data-zero),
							label: "Average HR = " + (sum/(data-zero)).toFixed(1)
						}],
						title: " Heart Rate (bpm)",
						sufix: "bpm",
						lineColor: "Blue",
						titleFontColor: "Blue",
						labelFontColor: "Blue"
					}],axisY2:[{
						title: "Movement",
						lineColor: "#7F6084",
						titleFontColor: "#7F6084",
						labelFontColor: "#7F6084"
					}],
					toolTip:{
						shared: true
					},
					data: [
						{
						  type: "area",
						  showInLegend: true,
						  name: "HR",
						  markerType: "square",
						  color: "Blue",
						  dataPoints: array0,
						  toolTipContent: "<b> Time:</b> {z}<br/><b> Heart Rate:</b> {y}<br/>"
						},{
						  type: "spline",
							axisYType: "secondary",
						  showInLegend: true,  
						  name: "Acc x",
						  dataPoints: array10,
						  toolTipContent: "<b> Time:</b> {z}<br/>Acc X:</b> {y}"
					  }, {
						  type: "spline",
							axisYType: "secondary",
						  showInLegend: true,  
						  name: "Acc y",
						  dataPoints: array11,
						  toolTipContent: "<b>Acc Y:</b> {y}"
					  }, {
						  type: "spline",
							axisYType: "secondary",
						  showInLegend: true,
						  name: "Acc z",
						  dataPoints: array12,
						  toolTipContent: "<b>Acc Z:</b> {y}</br>"
					  },
						{
							type: "scatter",
							dataPoints: array7,
							showInLegend: true,
							color: "LightSeaGreen", 
							legendText: "Opened Tab",
							toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
						},
						{
							type: "scatter",
							dataPoints: array8,
							showInLegend: true,
							color: "Pink",
							legendText: "Login",
							toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
						},
						{
							type: "scatter",
							dataPoints: array6,
							showInLegend: true,
							color: "###2F4F4F",  
							legendText: "Started watching",
							toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}<br/><b> Eps Time:</b>{eps_time}"
						},
						{
							type: "scatter",
							dataPoints: array5,
							showInLegend: true,
							color: "Green",  
							legendText: "Played",
							toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}<br/><b> Eps Time:</b>{eps_time}"
						},
						{
							type: "scatter",
							dataPoints: array9,
							showInLegend: true,
							color: "Brown",
							legendText: "Skipped Credits/Intro",
							toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}<br/><b> Eps Time:</b>{eps_time}"
						},
						{
							type: "scatter",
							dataPoints: array4,
							showInLegend: true,
							color: "Purple", 
							legendText: "Forwarded/Rewinded",
							toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}<br/><b> Eps Time:</b>{eps_time}"
						},
						{
							type: "scatter",
							dataPoints: array3,
							showInLegend: true,
							color: "Yellow", 
							legendText: "Paused",
							toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}<br/><b> Eps Time:</b>{eps_time}"
						},
						{
							type: "scatter",
							dataPoints: array2,
							showInLegend: true,
							color: "Red", 
							legendText: "Stopped watching",
							toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}<br/><b> Eps Time:</b>{eps_time}"
						},
					  {
							type: "scatter",
							dataPoints: array1,
							showInLegend: true,
							color: "Black",
							legendText: "Closed Tab",
							toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
						}
				  ]
				});

				chart.render();
			}
			else{
				var chart = new CanvasJS.Chart("chartContainer"  + session, {
					title:{
							text: "Session " + session  + "  Start: " + formatDate(start) + "  Duration: " +  epsTime(dados) + "s"
						},
					toolTip:{
						shared: true
					},
					  data: [
					{
						type: "scatter",
						dataPoints: array7,
						showInLegend: true,
						color: "LightSeaGreen", 
						legendText: "Opened Tab",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array8,
						showInLegend: true,
						color: "Pink",
						legendText: "Login",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array6,
						showInLegend: true,
						color: "#2F4F4F",  
						legendText: "Started watching",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}<br/><b> Eps Time:</b>{eps_time}"
					},
					{
						type: "scatter",
						dataPoints: array5,
						showInLegend: true,
						color: "Green",  
						legendText: "Played",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}<br/><b> Eps Time:</b>{eps_time}"
					},
					{
						type: "scatter",
						dataPoints: array9,
						showInLegend: true,
						color: "Brown",
						legendText: "Skipped Credits/Intro",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}<br/><b> Eps Time:</b>{eps_time}"
					},
					{
						type: "scatter",
						dataPoints: array4,
						showInLegend: true,
						color: "Purple", 
						legendText: "Forwarded/Rewinded",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}<br/><b> Eps Time:</b>{eps_time}"
					},
					{
						type: "scatter",
						dataPoints: array3,
						showInLegend: true,
						color: "Yellow", 
						legendText: "Paused",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}<br/><b> Eps Time:</b>{eps_time}"
					},
					{
						type: "scatter",
						dataPoints: array2,
						showInLegend: true,
						color: "Red", 
						legendText: "Stopped watching",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}<br/><b> Eps Time:</b>{eps_time}"
					},
				  {
						type: "scatter",
						dataPoints: array1,
						showInLegend: true,
						color: "Black",
						legendText: "Closed Tab",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					}
			  ]
			});
			
			chart.render();
				document.getElementById("hr").innerHTML = "Heart Rate coverage: 0.00%";
			}
		}
	};

	xhttp.open("POST", "http://bwdat.rnl.tecnico.ulisboa.pt:8080", false);
	xhttp.send("request=ProjectChromeSessionHRWithoutActions&session=" + session + "&user=" + user + "&project=" + project_name);
}
*/
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