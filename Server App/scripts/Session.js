
var server_url = <server_url>;

var segment_str = window.location.pathname;
var segment_array = segment_str.split('/');
var session = decodeURI(segment_array.pop());
var user = decodeURI(segment_array.pop());
var user = decodeURI(segment_array.pop());
var project_name = decodeURI(segment_array.pop());
var project_name = decodeURI(segment_array.pop());

document.getElementById("return").action = "/Sessions/" + project_name;
document.getElementById("title").innerHTML = project_name;
document.getElementById("user").innerHTML = user;
document.getElementById("session").innerHTML = session;

var dados;
var xhttp2;
var txt2;

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
			
			var sessionTable = document.getElementById('extensionSession0');
			var i;

			var header = sessionTable.createTHead();
			var row = header.insertRow(0);    

			var headCell8 = row.insertCell(0);
			var headCell7 = row.insertCell(0);
			var headCell6 = row.insertCell(0);
			var headCell5 = row.insertCell(0);
			var headCell4 = row.insertCell(0);
			var headCell3 = row.insertCell(0);
			var headCell2 = row.insertCell(0);
			var headCell1 = row.insertCell(0);

			headCell1.innerHTML = "<b>Time</b>";
			headCell2.innerHTML = "<b>Title</b>";
			headCell3.innerHTML = "<b>Season</b>";
			headCell4.innerHTML = "<b>Episode</b>";
			headCell5.innerHTML = "<b>Episode Time</b>";
			headCell6.innerHTML = "<b>Action</b>";
			
			var extensionSession2 = JSON.parse(txt2);

			init = new Date(extensionSession2[0].data_diahr);
			init.setHours(init.getHours() + (new Date().getTimezoneOffset() / 60) + 1);
			init = init.getTime()/1000;
			end = new Date(extensionSession2[extensionSession2.length-1].data_diahr);
			end.setHours(end.getHours() + (new Date().getTimezoneOffset() / 60) + 1);
			end = end.getTime()/1000;
			dados = end - init + 1;
			for(i = 0; i < dados; i++){
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
					array1.push({"x" : d, "y" : 1, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date});
				else if(extensionSession2[i].action == "Stopped watching" || extensionSession2[i].action == "Stopped Watching")
					array2.push({"x" : d, "y" : 2, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date});
				else if(extensionSession2[i].action == "Paused")
					array3.push({"x" : d, "y" : 3, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date});
				else if(extensionSession2[i].action == "Forwarded/Rewound" || extensionSession2[i].action == "Forwarded" || extensionSession2[i].action == "Rewound")
					array4.push({"x" : d, "y" : 4, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date});
				else if(extensionSession2[i].action == "Played")
					array5.push({"x" : d, "y" : 5, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date});
				else if(extensionSession2[i].action == "Started Watching" || extensionSession2[i].action == "Started watching")
					array6.push({"x" : d, "y" : 6, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date});
				else if(extensionSession2[i].action == "Opened Tab")
					array7.push({"x" : d, "y" : 7, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date});
				else if(extensionSession2[i].action == "Login")
					array8.push({"x" : d, "y" : 8, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date});
				else
					array9.push({"x" : d, "y" : 9, "z" : d.getHours() + "h " + d.getMinutes() + "m " + d.getSeconds() + "s", action : extensionSession2[i].action, "series" : extensionSession2[i].series_title, "date" : date});
				
				var row = sessionTable.insertRow(sessionTable.length);
				var cell6 = row.insertCell(0);
				var cell5 = row.insertCell(0);
				var cell4 = row.insertCell(0);
				var cell3 = row.insertCell(0);
				var cell2 = row.insertCell(0);
				var cell1 = row.insertCell(0);

				cell1.innerHTML = formatDate(extensionSession2[i].data_diahr);
				cell2.innerHTML = extensionSession2[i].series_title;
				cell3.innerHTML = extensionSession2[i].season;
				cell4.innerHTML = extensionSession2[i].eps_nr;
				if(extensionSession2[i].eps_time != null)
					cell5.innerHTML = epsTime(parseInt(extensionSession2[i].eps_time, 10));
				else
					cell5.innerHTML = extensionSession2[i].eps_time;
				cell6.innerHTML = extensionSession2[i].action;
			}

			document.getElementById("chartContainer0").style.height = "200px";
			document.getElementById("chartContainer0").style.width = "90%";
			var chart = new CanvasJS.Chart("chartContainer0", {
				title:{
					text: "Chrome Data"
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
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array5,
						showInLegend: true,
						color: "Green",  
						legendText: "Played",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array9,
						showInLegend: true,
						color: "Brown",
						legendText: "Skipped Credits/Intro",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array4,
						showInLegend: true,
						color: "Purple", 
						legendText: "Forwarded/Rewinded",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array3,
						showInLegend: true,
						color: "Yellow", 
						legendText: "Paused",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array2,
						showInLegend: true,
						color: "Red", 
						legendText: "Stopped watching",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
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
	}
}
xhttp2.open("GET", encodeURI(server_url + "/SessionActions/" + project_name + "/User/" + user + "/Session/" + session), true);
xhttp2.send();

var xhttp;
var txt;

xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		txt = xhttp.responseText;
		if(txt != "[]"){
			
			var sessionTable = document.getElementById('extensionSession1');

			var header = sessionTable.createTHead();
			var row = header.insertRow(0);    

			var headCell8 = row.insertCell(0);
			var headCell7 = row.insertCell(0);
			var headCell6 = row.insertCell(0);
			var headCell5 = row.insertCell(0);
			var headCell4 = row.insertCell(0);
			var headCell3 = row.insertCell(0);
			var headCell2 = row.insertCell(0);
			var headCell1 = row.insertCell(0);

			headCell1.innerHTML = "<b>Time</b>";
			headCell2.innerHTML = "<b>Heart Rate</b>";
			headCell3.innerHTML = "<b>Gyro X</b>";
			headCell4.innerHTML = "<b>Gyro Y</b>";
			headCell5.innerHTML = "<b>Gyro Z</b>";
			headCell6.innerHTML = "<b>Acc X</b>";
			headCell7.innerHTML = "<b>Acc Y</b>";
			headCell8.innerHTML = "<b>Acc Z</b>";
			
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
				date.setHours(date.getHours() + (new Date().getTimezoneOffset() / 60) + 1);
				var pos = date.getTime()/1000 - init;

				array0[pos].y = extensionSession[i].hr;
				array10[pos].y = extensionSession[i].acc_x;
				array11[pos].y = extensionSession[i].acc_y;
				array12[pos].y = extensionSession[i].acc_z;
				array13[pos].y = extensionSession[i].gyro_x;
				array14[pos].y = extensionSession[i].gyro_y;
				array15[pos].y = extensionSession[i].gyro_z;

				var row = sessionTable.insertRow(sessionTable.length);
				var cell8 = row.insertCell(0);
				var cell7 = row.insertCell(0);
				var cell6 = row.insertCell(0);
				var cell5 = row.insertCell(0);
				var cell4 = row.insertCell(0);
				var cell3 = row.insertCell(0);
				var cell2 = row.insertCell(0);
				var cell1 = row.insertCell(0);

				cell1.innerHTML = formatDate(extensionSession[i].data_diahr);
				cell2.innerHTML = extensionSession[i].hr;
				cell3.innerHTML = extensionSession[i].gyro_x;
				cell4.innerHTML = extensionSession[i].gyro_y;
				cell5.innerHTML = extensionSession[i].gyro_z;
				cell6.innerHTML = extensionSession[i].acc_x;
				cell7.innerHTML = extensionSession[i].acc_y;
				cell8.innerHTML = extensionSession[i].acc_z;
			}

			document.getElementById("hr").innerHTML = "Heart Rate coverage: " + ((data/dados)* 100).toFixed(2) + "%";
			document.getElementById("hravg").innerHTML = "Heart Rate average: " + (sum/(data-zero)).toFixed(1);
			

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

			document.getElementById("chartContainer1").style.height = "200px";
			document.getElementById("chartContainer1").style.width = "90%";

			var chart = new CanvasJS.Chart("chartContainer1", {
				title:{
					text: "Heart Rate"
				},
				axisY:[
				{
				stripLines: [{
					value: sum/(data-zero),
					label: "Average = " + (sum/(data-zero)).toFixed(1)
				}],
				suffix: "bpm"
				}],
				toolTip:{
					shared: true
				},
			    data: [{
					  type: "area",
					  showInLegend: true,
					  color: "Blue",
					  name: "HR",
					  dataPoints: array0,
					  toolTipContent: "<b> Time:</b> {z}<br/><b> Heart Rate:</b> {y}<br/>"
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
						color: "#2F4F4F",  
						legendText: "Started watching",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array5,
						showInLegend: true,
						color: "Green",  
						legendText: "Played",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array9,
						showInLegend: true,
						color: "Brown",
						legendText: "Skipped Credits/Intro",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array4,
						showInLegend: true,
						color: "Purple", 
						legendText: "Forwarded/Rewinded",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array3,
						showInLegend: true,
						color: "Yellow", 
						legendText: "Paused",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array2,
						showInLegend: true,
						color: "Red", 
						legendText: "Stopped watching",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
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

			for(var j = 0; j < array1.length; j++){
				var posicao = array1[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array1[j].y = array10[posicao].y;
			}
			for(var j = 0; j < array2.length; j++){
				var posicao = array2[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array2[j].y = array10[posicao].y;
			}
			for(var j = 0; j < array3.length; j++){
				var posicao = array3[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array3[j].y = array10[posicao].y;
			}
			for(var j = 0; j < array4.length; j++){
				var posicao = array4[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array4[j].y = array10[posicao].y;
			}
			for(var j = 0; j < array5.length; j++){
				var posicao = array5[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array5[j].y = array10[posicao].y;
			}
			for(var j = 0; j < array6.length; j++){
				var posicao = array6[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array6[j].y = array10[posicao].y;
			}
			for(var j = 0; j < array7.length; j++){
				var posicao = array7[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array7[j].y = array10[posicao].y;
			}
			for(var j = 0; j < array8.length; j++){
				var posicao = array8[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array8[j].y = array10[posicao].y;
			}
			for(var j = 0; j < array9.length; j++){
				var posicao = array9[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array9[j].y = array10[posicao].y;
			}

			document.getElementById("chartContainer2").style.height = "200px";
			document.getElementById("chartContainer2").style.width = "90%";
			
			var chart2 = new CanvasJS.Chart("chartContainer2", {
				title:{
					text: "Accelerometer"
				},
			toolTip:{
				shared: true
			},
			  data: [
					{
					  type: "spline",
					  showInLegend: true,  
					  name: "Acc x",
					  dataPoints: array10,
					  toolTipContent: "<b> Time:</b> {z}<br/>Acc X:</b> {y}"
				  }, {
					  type: "spline",
					  showInLegend: true,  
					  name: "Acc y",
					  dataPoints: array11,
					  toolTipContent: "<b>Acc Y:</b> {y}"
				  }, {
					  type: "spline",
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
						color: "#2F4F4F",  
						legendText: "Started watching",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array5,
						showInLegend: true,
						color: "Green",  
						legendText: "Played",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array9,
						showInLegend: true,
						color: "Brown",
						legendText: "Skipped Credits/Intro",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array4,
						showInLegend: true,
						color: "Purple", 
						legendText: "Forwarded/Rewinded",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array3,
						showInLegend: true,
						color: "Yellow", 
						legendText: "Paused",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array2,
						showInLegend: true,
						color: "Red", 
						legendText: "Stopped watching",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
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
			
			chart2.render();
			
			for(var j = 0; j < array1.length; j++){
				var posicao = array1[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array1[j].y = array13[posicao].y;
			}
			for(var j = 0; j < array2.length; j++){
				var posicao = array2[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array2[j].y = array13[posicao].y;
			}
			for(var j = 0; j < array3.length; j++){
				var posicao = array3[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array3[j].y = array13[posicao].y;
			}
			for(var j = 0; j < array4.length; j++){
				var posicao = array4[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array4[j].y = array13[posicao].y;
			}
			for(var j = 0; j < array5.length; j++){
				var posicao = array5[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array5[j].y = array13[posicao].y;
			}
			for(var j = 0; j < array6.length; j++){
				var posicao = array6[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array6[j].y = array13[posicao].y;
			}
			for(var j = 0; j < array7.length; j++){
				var posicao = array7[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array7[j].y = array13[posicao].y;
			}
			for(var j = 0; j < array8.length; j++){
				var posicao = array8[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array8[j].y = array13[posicao].y;
			}
			for(var j = 0; j < array9.length; j++){
				var posicao = array9[j].date.getTime()/1000 - init;
				if(array0[posicao].y != null)
					array9[j].y = array13[posicao].y;
			}

			document.getElementById("chartContainer3").style.height = "200px";
			document.getElementById("chartContainer3").style.width = "90%";
			
			var chart3 = new CanvasJS.Chart("chartContainer3", {
				title:{
					text: "Gyroscope"
				},
			toolTip:{
				shared: true
			},
			  data: [
					{
					  type: "spline",
					  showInLegend: true,   
					  dataPoints: array13,
					  name: "Gyr x",
					  toolTipContent: "<b> Time:</b> {z}<br/>Gyr X:</b> {y}"
				  }, {
					  type: "spline",
					  showInLegend: true,   
					  dataPoints: array14,
					  name: "Gyr y",
					  toolTipContent: "<b>Gyr Y:</b> {y}"
				  }, {
					  type: "spline",
					  showInLegend: true,   
					  dataPoints: array15,
					  name: "Gyr z",
					  toolTipContent: "<b>Gyr Z:</b> {y}</br>"
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
						color: "#2F4F4F",  
						legendText: "Started watching",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array5,
						showInLegend: true,
						color: "Green",  
						legendText: "Played",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array9,
						showInLegend: true,
						color: "Brown",
						legendText: "Skipped Credits/Intro",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array4,
						showInLegend: true,
						color: "Purple", 
						legendText: "Forwarded/Rewinded",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array3,
						showInLegend: true,
						color: "Yellow", 
						legendText: "Paused",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
					},
					{
						type: "scatter",
						dataPoints: array2,
						showInLegend: true,
						color: "Red", 
						legendText: "Stopped watching",
						toolTipContent: "<b> Time:</b> {z}<br/><b> Content:</b> {series}<br/><b> Action:</b>{action}"
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
			
			chart3.render();
		}
		else
			document.getElementById("hr").innerHTML = "Heart Rate coverage: 0.00%";
	}
};
xhttp.open("GET", encodeURI(server_url + "/SessionHR/" + project_name + "/User/" + user + "/Session/" + session), true);
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
