
var server_url = <server_url>;

var segment_str = window.location.pathname;
var segment_array = segment_str.split('/');
var project_name = decodeURI(segment_array.pop());

document.getElementById("title").innerHTML = project_name;

document.getElementById("downloadActions").innerHTML = '<h2>Contents:</h2>';

var contentsTable = document.getElementById('contents');
var header = contentsTable.createTHead();
var row = header.insertRow(0);

var headCell91 = row.insertCell(0);
var headCell90 = row.insertCell(0);
var headCell89 = row.insertCell(0);
var headCell88 = row.insertCell(0);
var headCell87 = row.insertCell(0);
var headCell86 = row.insertCell(0);
var headCell85 = row.insertCell(0);
var headCell84 = row.insertCell(0);
var headCell83 = row.insertCell(0);
var headCell82 = row.insertCell(0);
var headCell81 = row.insertCell(0);
var headCell80 = row.insertCell(0);
var headCell79 = row.insertCell(0);
var headCell78 = row.insertCell(0);
var headCell77 = row.insertCell(0);
var headCell76 = row.insertCell(0);
var headCell75 = row.insertCell(0);
var headCell74 = row.insertCell(0);
var headCell73 = row.insertCell(0);
var headCell72 = row.insertCell(0);
var headCell71 = row.insertCell(0);
var headCell70 = row.insertCell(0);
var headCell69 = row.insertCell(0);
var headCell68 = row.insertCell(0);
var headCell67 = row.insertCell(0);
var headCell66 = row.insertCell(0);
var headCell65 = row.insertCell(0);
var headCell64 = row.insertCell(0);
var headCell63 = row.insertCell(0);
var headCell62 = row.insertCell(0);
var headCell61 = row.insertCell(0);
var headCell60 = row.insertCell(0);
var headCell59 = row.insertCell(0);
var headCell58 = row.insertCell(0);
var headCell57 = row.insertCell(0);
var headCell56 = row.insertCell(0);
var headCell55 = row.insertCell(0);
var headCell54 = row.insertCell(0);
var headCell53 = row.insertCell(0);
var headCell52 = row.insertCell(0);
var headCell51 = row.insertCell(0);
var headCell50 = row.insertCell(0);
var headCell49 = row.insertCell(0);
var headCell48 = row.insertCell(0);
var headCell47 = row.insertCell(0);
var headCell46 = row.insertCell(0);
var headCell45 = row.insertCell(0);
var headCell44 = row.insertCell(0);
var headCell43 = row.insertCell(0);
var headCell42 = row.insertCell(0);
var headCell41 = row.insertCell(0);
headCell41.width ='250px';
var headCell40 = row.insertCell(0);
var headCell39 = row.insertCell(0);
var headCell38 = row.insertCell(0);
var headCell37 = row.insertCell(0);
var headCell36 = row.insertCell(0);
var headCell35 = row.insertCell(0);
var headCell34 = row.insertCell(0);
var headCell33 = row.insertCell(0);
var headCell32 = row.insertCell(0);
var headCell31 = row.insertCell(0);
var headCell30 = row.insertCell(0);
var headCell29 = row.insertCell(0);
var headCell28 = row.insertCell(0);
var headCell27 = row.insertCell(0);
var headCell26 = row.insertCell(0);
var headCell25 = row.insertCell(0);
var headCell24 = row.insertCell(0);
var headCell23 = row.insertCell(0);
var headCell22 = row.insertCell(0);
var headCell21 = row.insertCell(0);
var headCell20 = row.insertCell(0);
var headCell19 = row.insertCell(0);
var headCell18 = row.insertCell(0);
var headCell17 = row.insertCell(0);
var headCell16 = row.insertCell(0);
var headCell15 = row.insertCell(0);
var headCell14 = row.insertCell(0);
var headCell13 = row.insertCell(0);
var headCell12 = row.insertCell(0);
var headCell11 = row.insertCell(0);
var headCell10 = row.insertCell(0);
var headCell9 = row.insertCell(0);
var headCell8 = row.insertCell(0);
var headCell7 = row.insertCell(0);
var headCell6 = row.insertCell(0);
var headCell5 = row.insertCell(0);
var headCell4 = row.insertCell(0);
var headCelld = row.insertCell(0);
var headCellc = row.insertCell(0);
var headCellb = row.insertCell(0);
var headCella = row.insertCell(0);
var headCell3 = row.insertCell(0);
var headCell2 = row.insertCell(0);
var headCell1 = row.insertCell(0);

headCell1.innerHTML = "<b>Epsisode Code</b>";
headCell2.innerHTML = "<b>New Epsisode Code</b>";
headCell3.innerHTML = "<b>Title</b>";
headCella.innerHTML = "<b>Title2</b>";
headCellb.innerHTML = "<b>Season</b>";
headCellc.innerHTML = "<b>Episode</b>";
headCelld.innerHTML = "<b>Episode Title</b>";
headCell4.innerHTML = "<b>Genre 0</b>";
headCell5.innerHTML = "<b>Genre 1</b>";
headCell6.innerHTML = "<b>Genre 2</b>";
headCell7.innerHTML = "<b>Genre 3</b>";
headCell8.innerHTML = "<b>Genre 4</b>";
headCell9.innerHTML = "<b>Genre 5</b>";
headCell10.innerHTML = "<b>Creator 0</b>";
headCell11.innerHTML = "<b>Creator 1</b>";
headCell12.innerHTML = "<b>Creator 2</b>";
headCell13.innerHTML = "<b>Creator 3</b>";
headCell14.innerHTML = "<b>Creator 4</b>";
headCell15.innerHTML = "<b>Mood 0</b>";
headCell16.innerHTML = "<b>Mood 1</b>";
headCell17.innerHTML = "<b>Mood 2</b>";
headCell18.innerHTML = "<b>Mood 3</b>";
headCell19.innerHTML = "<b>Mood 4</b>";
headCell20.innerHTML = "<b>Mood 5</b>";
headCell21.innerHTML = "<b>Release Year</b>";
headCell22.innerHTML = "<b>Availability</b>";
headCell23.innerHTML = "<b>Maturity</b>";
headCell24.innerHTML = "<b>Rating Reasons</b>";
headCell25.innerHTML = "<b>Season Count</b>";
headCell26.innerHTML = "<b>Writer 0</b>";
headCell27.innerHTML = "<b>Writer 1</b>";
headCell28.innerHTML = "<b>Writer 2</b>";
headCell29.innerHTML = "<b>Writer 3</b>";
headCell30.innerHTML = "<b>Writer 4</b>";
headCell31.innerHTML = "<b>Writer 5</b>";
headCell32.innerHTML = "<b>Writer 6</b>";
headCell33.innerHTML = "<b>Writer 7</b>";
headCell34.innerHTML = "<b>Writer 8</b>";
headCell35.innerHTML = "<b>Writer 9</b>";
headCell36.innerHTML = "<b>Director 0</b>";
headCell37.innerHTML = "<b>Director 1</b>";
headCell38.innerHTML = "<b>Director 2</b>";
headCell39.innerHTML = "<b>Director 3</b>";
headCell40.innerHTML = "<b>Director 4</b>";
headCell41.innerHTML = "<b>Regular Synopsis</b>";
headCell42.innerHTML = "<b>Cast 0</b>";
headCell43.innerHTML = "<b>Cast 1</b>";
headCell44.innerHTML = "<b>Cast 2</b>";
headCell45.innerHTML = "<b>Cast 3</b>";
headCell46.innerHTML = "<b>Cast 4</b>";
headCell47.innerHTML = "<b>Cast 5</b>";
headCell48.innerHTML = "<b>Cast 6</b>";
headCell48.style.display = 'none';
headCell49.innerHTML = "<b>Cast 7</b>";
headCell49.style.display = 'none';
headCell50.innerHTML = "<b>Cast 8</b>";
headCell50.style.display = 'none';
headCell51.innerHTML = "<b>Cast 9</b>";
headCell51.style.display = 'none';
headCell52.innerHTML = "<b>Cast 10</b>";
headCell52.style.display = 'none';
headCell53.innerHTML = "<b>Cast 11</b>";
headCell53.style.display = 'none';
headCell54.innerHTML = "<b>Cast 12</b>";
headCell54.style.display = 'none';
headCell55.innerHTML = "<b>Cast 13</b>";
headCell55.style.display = 'none';
headCell56.innerHTML = "<b>Cast 14</b>";
headCell56.style.display = 'none';
headCell57.innerHTML = "<b>Cast 15</b>";
headCell57.style.display = 'none';
headCell58.innerHTML = "<b>Cast 16</b>";
headCell58.style.display = 'none';
headCell59.innerHTML = "<b>Cast 17</b>";
headCell59.style.display = 'none';
headCell60.innerHTML = "<b>Cast 18</b>";
headCell60.style.display = 'none';
headCell61.innerHTML = "<b>Cast 19</b>";
headCell61.style.display = 'none';
headCell62.innerHTML = "<b>Cast 20</b>";
headCell62.style.display = 'none';
headCell63.innerHTML = "<b>Cast 21</b>";
headCell63.style.display = 'none';
headCell64.innerHTML = "<b>Cast 22</b>";
headCell64.style.display = 'none';
headCell65.innerHTML = "<b>Cast 23</b>";
headCell65.style.display = 'none';
headCell66.innerHTML = "<b>Cast 24</b>";
headCell66.style.display = 'none';
headCell67.innerHTML = "<b>Cast 25</b>";
headCell67.style.display = 'none';
headCell68.innerHTML = "<b>Cast 26</b>";
headCell68.style.display = 'none';
headCell69.innerHTML = "<b>Cast 27</b>";
headCell69.style.display = 'none';
headCell70.innerHTML = "<b>Cast 28</b>";
headCell70.style.display = 'none';
headCell71.innerHTML = "<b>Cast 29</b>";
headCell71.style.display = 'none';
headCell72.innerHTML = "<b>Cast 30</b>";
headCell72.style.display = 'none';
headCell73.innerHTML = "<b>Cast 31</b>";
headCell73.style.display = 'none';
headCell74.innerHTML = "<b>Cast 32</b>";
headCell74.style.display = 'none';
headCell75.innerHTML = "<b>Cast 33</b>";
headCell75.style.display = 'none';
headCell76.innerHTML = "<b>Cast 34</b>";
headCell76.style.display = 'none';
headCell77.innerHTML = "<b>Cast 35</b>";
headCell77.style.display = 'none';
headCell78.innerHTML = "<b>Cast 36</b>";
headCell78.style.display = 'none';
headCell79.innerHTML = "<b>Cast 37</b>";
headCell79.style.display = 'none';
headCell80.innerHTML = "<b>Cast 38</b>";
headCell80.style.display = 'none';
headCell81.innerHTML = "<b>Cast 39</b>";
headCell81.style.display = 'none';
headCell82.innerHTML = "<b>Cast 40</b>";
headCell82.style.display = 'none';
headCell83.innerHTML = "<b>Cast 41</b>";
headCell83.style.display = 'none';
headCell84.innerHTML = "<b>Cast 42</b>";
headCell84.style.display = 'none';
headCell85.innerHTML = "<b>Cast 43</b>";
headCell85.style.display = 'none';
headCell86.innerHTML = "<b>Cast 44</b>";
headCell86.style.display = 'none';
headCell87.innerHTML = "<b>Cast 45</b>";
headCell87.style.display = 'none';
headCell88.innerHTML = "<b>Cast 46</b>";
headCell88.style.display = 'none';
headCell89.innerHTML = "<b>Cast 47</b>";
headCell89.style.display = 'none';
headCell90.innerHTML = "<b>Cast 48</b>";
headCell90.style.display = 'none';
headCell91.innerHTML = "<b>Cast 49</b>";
headCell91.style.display = 'none';


var xhttp;
var txt;

xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		txt = xhttp.responseText;
		if(txt != "[]"){
			var contentsSessions = JSON.parse(txt);

			for (var i = 0; i < contentsSessions.length; i++) {
				
				var row = contentsTable.insertRow(contentsTable.length);

				var cell91 = row.insertCell(0);
				var cell90 = row.insertCell(0);
				var cell89 = row.insertCell(0);
				var cell88 = row.insertCell(0);
				var cell87 = row.insertCell(0);
				var cell86 = row.insertCell(0);
				var cell85 = row.insertCell(0);
				var cell84 = row.insertCell(0);
				var cell83 = row.insertCell(0);
				var cell82 = row.insertCell(0);
				var cell81 = row.insertCell(0);
				var cell80 = row.insertCell(0);
				var cell79 = row.insertCell(0);
				var cell78 = row.insertCell(0);
				var cell77 = row.insertCell(0);
				var cell76 = row.insertCell(0);
				var cell75 = row.insertCell(0);
				var cell74 = row.insertCell(0);
				var cell73 = row.insertCell(0);
				var cell72 = row.insertCell(0);
				var cell71 = row.insertCell(0);
				var cell70 = row.insertCell(0);
				var cell69 = row.insertCell(0);
				var cell68 = row.insertCell(0);
				var cell67 = row.insertCell(0);
				var cell66 = row.insertCell(0);
				var cell65 = row.insertCell(0);
				var cell64 = row.insertCell(0);
				var cell63 = row.insertCell(0);
				var cell62 = row.insertCell(0);
				var cell61 = row.insertCell(0);
				var cell60 = row.insertCell(0);
				var cell59 = row.insertCell(0);
				var cell58 = row.insertCell(0);
				var cell57 = row.insertCell(0);
				var cell56 = row.insertCell(0);
				var cell55 = row.insertCell(0);
				var cell54 = row.insertCell(0);
				var cell53 = row.insertCell(0);
				var cell52 = row.insertCell(0);
				var cell51 = row.insertCell(0);
				var cell50 = row.insertCell(0);
				var cell49 = row.insertCell(0);
				var cell48 = row.insertCell(0);
				var cell47 = row.insertCell(0);
				var cell46 = row.insertCell(0);
				var cell45 = row.insertCell(0);
				var cell44 = row.insertCell(0);
				var cell43 = row.insertCell(0);
				var cell42 = row.insertCell(0);
				var cell41 = row.insertCell(0);
				cell41.width ='250px';
				var cell40 = row.insertCell(0);
				var cell39 = row.insertCell(0);
				var cell38 = row.insertCell(0);
				var cell37 = row.insertCell(0);
				var cell36 = row.insertCell(0);
				var cell35 = row.insertCell(0);
				var cell34 = row.insertCell(0);
				var cell33 = row.insertCell(0);
				var cell32 = row.insertCell(0);
				var cell31 = row.insertCell(0);
				var cell30 = row.insertCell(0);
				var cell29 = row.insertCell(0);
				var cell28 = row.insertCell(0);
				var cell27 = row.insertCell(0);
				var cell26 = row.insertCell(0);
				var cell25 = row.insertCell(0);
				var cell24 = row.insertCell(0);
				var cell23 = row.insertCell(0);
				var cell22 = row.insertCell(0);
				var cell21 = row.insertCell(0);
				var cell20 = row.insertCell(0);
				var cell19 = row.insertCell(0);
				var cell18 = row.insertCell(0);
				var cell17 = row.insertCell(0);
				var cell16 = row.insertCell(0);
				var cell15 = row.insertCell(0);
				var cell14 = row.insertCell(0);
				var cell13 = row.insertCell(0);
				var cell12 = row.insertCell(0);
				var cell11 = row.insertCell(0);
				var cell10 = row.insertCell(0);
				var cell9 = row.insertCell(0);
				var cell8 = row.insertCell(0);
				var cell7 = row.insertCell(0);
				var cell6 = row.insertCell(0);
				var cell5 = row.insertCell(0);
				var cell4 = row.insertCell(0);
				var celld = row.insertCell(0);
				var cellc = row.insertCell(0);
				var cellb = row.insertCell(0);
				var cella = row.insertCell(0);
				var cell3 = row.insertCell(0);
				var cell2 = row.insertCell(0);
				var cell1 = row.insertCell(0);

				cell1.innerHTML = contentsSessions[i].eps_code;
				cell2.innerHTML = contentsSessions[i].eps_code_new != null ? contentsSessions[i].eps_code_new : contentsSessions[i].eps_code;
				cell3.innerHTML = contentsSessions[i].title;
				cella.innerHTML = contentsSessions[i].series_title;
				cellb.innerHTML = contentsSessions[i].season;
				cellc.innerHTML = contentsSessions[i].eps_nr;
				celld.innerHTML = contentsSessions[i].eps_t;
				cell4.innerHTML = contentsSessions[i].genre_0;
				cell5.innerHTML = contentsSessions[i].genre_1;
				cell6.innerHTML = contentsSessions[i].genre_2;
				cell7.innerHTML = contentsSessions[i].genre_3;
				cell8.innerHTML = contentsSessions[i].genre_4;
				cell9.innerHTML = contentsSessions[i].genre_5;
				cell10.innerHTML = contentsSessions[i].creator_0;
				cell11.innerHTML = contentsSessions[i].creator_1;
				cell12.innerHTML = contentsSessions[i].creator_2;
				cell13.innerHTML = contentsSessions[i].creator_3;
				cell14.innerHTML = contentsSessions[i].creator_4;
				cell15.innerHTML = contentsSessions[i].mood_0;
				cell16.innerHTML = contentsSessions[i].mood_1;
				cell17.innerHTML = contentsSessions[i].mood_2;
				cell18.innerHTML = contentsSessions[i].mood_3;
				cell19.innerHTML = contentsSessions[i].mood_4;
				cell20.innerHTML = contentsSessions[i].mood_5;
				cell21.innerHTML = contentsSessions[i].releaseYear;
				cell22.innerHTML = contentsSessions[i].availability;
				cell23.innerHTML = contentsSessions[i].maturity;
				cell24.innerHTML = contentsSessions[i].specificRatingReasons;
				cell25.innerHTML = contentsSessions[i].seasonCount;
				cell26.innerHTML = contentsSessions[i].writer_0;
				cell27.innerHTML = contentsSessions[i].writer_1;
				cell28.innerHTML = contentsSessions[i].writer_2;
				cell29.innerHTML = contentsSessions[i].writer_3;
				cell30.innerHTML = contentsSessions[i].writer_4;
				cell31.innerHTML = contentsSessions[i].writer_5;
				cell32.innerHTML = contentsSessions[i].writer_6;
				cell33.innerHTML = contentsSessions[i].writer_7;
				cell34.innerHTML = contentsSessions[i].writer_8;
				cell35.innerHTML = contentsSessions[i].writer_9;
				cell36.innerHTML = contentsSessions[i].director_0;
				cell37.innerHTML = contentsSessions[i].director_1;
				cell38.innerHTML = contentsSessions[i].director_2;
				cell39.innerHTML = contentsSessions[i].director_3;
				cell40.innerHTML = contentsSessions[i].director_4;
				cell41.innerHTML = contentsSessions[i].regularSynopsis;
				cell42.innerHTML = contentsSessions[i].cast_0;
				cell43.innerHTML = contentsSessions[i].cast_1;
				cell44.innerHTML = contentsSessions[i].cast_2;
				cell45.innerHTML = contentsSessions[i].cast_3;
				cell46.innerHTML = contentsSessions[i].cast_4;
				cell47.innerHTML = contentsSessions[i].cast_5;
				cell48.innerHTML = contentsSessions[i].cast_6;
				cell48.style.display = 'none';
				cell49.innerHTML = contentsSessions[i].cast_7;
				cell49.style.display = 'none';
				cell50.innerHTML = contentsSessions[i].cast_8;
				cell50.style.display = 'none';
				cell51.innerHTML = contentsSessions[i].cast_9;
				cell51.style.display = 'none';
				cell52.innerHTML = contentsSessions[i].cast_10;
				cell52.style.display = 'none';
				cell53.innerHTML = contentsSessions[i].cast_11;
				cell53.style.display = 'none';
				cell54.innerHTML = contentsSessions[i].cast_12;
				cell54.style.display = 'none';
				cell55.innerHTML = contentsSessions[i].cast_13;
				cell55.style.display = 'none';
				cell56.innerHTML = contentsSessions[i].cast_14;
				cell56.style.display = 'none';
				cell57.innerHTML = contentsSessions[i].cast_15;
				cell57.style.display = 'none';
				cell58.innerHTML = contentsSessions[i].cast_16;
				cell58.style.display = 'none';
				cell59.innerHTML = contentsSessions[i].cast_17;
				cell59.style.display = 'none';
				cell60.innerHTML = contentsSessions[i].cast_18;
				cell60.style.display = 'none';
				cell61.innerHTML = contentsSessions[i].cast_19;
				cell61.style.display = 'none';
				cell62.innerHTML = contentsSessions[i].cast_20;
				cell62.style.display = 'none';
				cell63.innerHTML = contentsSessions[i].cast_21;
				cell63.style.display = 'none';
				cell64.innerHTML = contentsSessions[i].cast_22;
				cell64.style.display = 'none';
				cell65.innerHTML = contentsSessions[i].cast_23;
				cell65.style.display = 'none';
				cell66.innerHTML = contentsSessions[i].cast_24;
				cell66.style.display = 'none';
				cell67.innerHTML = contentsSessions[i].cast_25;
				cell67.style.display = 'none';
				cell68.innerHTML = contentsSessions[i].cast_26;
				cell68.style.display = 'none';
				cell69.innerHTML = contentsSessions[i].cast_27;
				cell69.style.display = 'none';
				cell70.innerHTML = contentsSessions[i].cast_28;
				cell70.style.display = 'none';
				cell71.innerHTML = contentsSessions[i].cast_29;
				cell71.style.display = 'none';
				cell72.innerHTML = contentsSessions[i].cast_30;
				cell72.style.display = 'none';
				cell73.innerHTML = contentsSessions[i].cast_31;
				cell73.style.display = 'none';
				cell74.innerHTML = contentsSessions[i].cast_32;
				cell74.style.display = 'none';
				cell75.innerHTML = contentsSessions[i].cast_33;
				cell75.style.display = 'none';
				cell76.innerHTML = contentsSessions[i].cast_34;
				cell76.style.display = 'none';
				cell77.innerHTML = contentsSessions[i].cast_35;
				cell77.style.display = 'none';
				cell78.innerHTML = contentsSessions[i].cast_36;
				cell78.style.display = 'none';
				cell79.innerHTML = contentsSessions[i].cast_37;
				cell79.style.display = 'none';
				cell80.innerHTML = contentsSessions[i].cast_38;
				cell80.style.display = 'none';
				cell81.innerHTML = contentsSessions[i].cast_39;
				cell81.style.display = 'none';
				cell82.innerHTML = contentsSessions[i].cast_40;
				cell82.style.display = 'none';
				cell83.innerHTML = contentsSessions[i].cast_41;
				cell83.style.display = 'none';
				cell84.innerHTML = contentsSessions[i].cast_42;
				cell84.style.display = 'none';
				cell85.innerHTML = contentsSessions[i].cast_43;
				cell85.style.display = 'none';
				cell86.innerHTML = contentsSessions[i].cast_44;
				cell86.style.display = 'none';
				cell87.innerHTML = contentsSessions[i].cast_45;
				cell87.style.display = 'none';
				cell88.innerHTML = contentsSessions[i].cast_46;
				cell88.style.display = 'none';
				cell89.innerHTML = contentsSessions[i].cast_47;
				cell89.style.display = 'none';
				cell90.innerHTML = contentsSessions[i].cast_48;
				cell90.style.display = 'none';
				cell91.innerHTML = contentsSessions[i].cast_49;
				cell91.style.display = 'none';

			}
			document.getElementById("downloadActions").innerHTML = '<h2>Contents:<a> <img src="../images/download.jpg" height="15" size="15" onClick="exportCSVFile()"></a> </h2>';
		}
		else
			document.getElementById("contents").innerHTML = 'No episodes codes found.';
	}
};

xhttp.open("GET", encodeURI(server_url + "/getEpsInfo/" + project_name));
xhttp.send();

function convertToCSV() {

	var rows = document.getElementById('contents').rows;

	var j, i;
    var str = '';
	var line = '';
	for (j= 0; j < rows[0].cells.length; j++) {
		if (line != '')
			line += ','

			line += rows[0].cells[j].innerText || rows[0].cells[j].textContent;
   }
   str += line + '\r\n';

   for (i = 1; i < rows.length; i++) {
	line = '';

        for (j = 0; j < rows[i].cells.length; j++) {
            if (line != '')
				line += ','
			
				line += '"' + rows[i].cells[j].innerHTML + '"';
        }
        str += line + '\r\n';
    }

    return str;
}


function exportCSVFile() {

    var csv = this.convertToCSV();

    var exportedFilenmae = project_name + ' Contents.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}