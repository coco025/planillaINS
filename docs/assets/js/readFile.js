var xmlhttp = new XMLHttpRequest();
var urlWS = "http://186.176.206.154:8088/business/get_EmployeeInfoExactus?"
//import { saveAs } from 'file-saver';

// Llamada al Web Service
function getInfoByUser(id, company){
	url = urlWS + "id=" + id + "&company=" + company
	//alert(url)
	xmlhttp.open("GET", url, false);
	xmlhttp.send();
}

var firstLineH;
// Lee un archivo y lo convierte en el formato requerido
function convertFile(){
	
	document.getElementById("process").style.display = "";
	
	var fileInput = document.getElementById("file");
	var file = fileInput.files[0];
	//copyFile(file.mozFullPath)
	var reader = new FileReader();
	
	var resultHeader = [];
	var resultLines = [];
	var companyPolicy;
	
	reader.onload = function(progressEvent){
		alert("ready");
		var line;
		var secondLine = "Email " + "mzuniga@grupointeca.com";
		var thirdLine;
		var lines = this.result.split('\n');
		var linesCant = lines.length;
		var percentage;
		
		for(var lineNum = 0; lineNum < lines.length; lineNum++){

			line = reduceSpaces(lines[lineNum]);
			
			var res = line.split(" ");
			//console.log(res)
			
			switch (lineNum) {
			  case 0:
				companyPolicy = res[1]
				//alert("Poliza: " + companyPolicy)
				firstLineH = firstLine(res)
				break;
			  case 1:
				thirdLine = "600 mts sur parque industrial Tejar El Guarco Cartago";
				break;
			  case 2:
				break;
			  default:
				line = convertLine(res, companyPolicy);
				//console.log(line);
				resultLines.push(line);
				break;
			}
		}
		
		
		resultHeader.push(firstLineH.toString().replace(/,/g, ""))
		resultHeader.push(secondLine)
		resultHeader.push(thirdLine)
		
		//console.log(resultHeader);
		//console.log(resultLines);
		createFile(resultHeader, resultLines, file.name)
		
		document.getElementById("process").style.display = "none";

	};
	
	reader.readAsText(file);	
}

function copyFile(name){
	alert(name);
}

function firstLine(data){
	var info1, tomador, telefono, fax, calendario, vPlanilla, codExcel;
	
	info1 = fill(data[0], 15);
	
	tomador = fill("#".repeat(10), 20);
	
	telefono = fill(data[2], 8);
	
	fax = fill("22505781", 9);
	
	calendario = fill("M", 1);
	
	vPlanilla = fill("V01A", 4);
	
	codExcel = fill("0".repeat(24), 24);
	
	return [info1 , tomador , telefono , fax , calendario , vPlanilla , codExcel]
}

// La magia
function convertLine(list, policy){
	
	// Información del archivo original
	var aseguradoList, idList, detailList; 
	
	// Información del resultado del WS
	var fechaWS, nombreWS, apellido1WS, apellido2WS, nombrePilaWS, aseguradoWS, idWS, telefonoWS, emailWS, estadoCivilWS, generoWS, horasWS, jornadaWS, paisWS;
	
	// Información requerida
	var tipoId, identificacion, numAsegurado, nombre, apellido1, apellido2, fechaNacimiento, telefono, correo, genero, estadoCivil, nacionalidad, salario, diasLaborales, horasLaborales, jornadaLaboral, observacion, ocupacion;
	
	var parser = new DOMParser();

	getInfoByUser(list[1], policy);
	//alert(xmlhttp.responseText);
	//console.log(xmlhttp.responseText);
	
	var infoByUser;
	
	try {
		infoByUser = parser.parseFromString(xmlhttp.responseText,"text/xml").getElementsByTagName("string")[0].childNodes[0].nodeValue.split(",");
	}
	catch(error) {
		console.log("ERROR: " + list[1])
		return list[1];
	}
	
	
	if(infoByUser.length == 0){
		//alert("No encontrado: ", list[1])
		return list[1] + list[2] + list[3] + list[4];
	}
	
	firstLineH[1] = fill(infoByUser[14], 20);
	
	aseguradoList = list[0];
	idList = list[1];
	detailList = list[list.length - 1];
	
	fechaWS = infoByUser[0];
	nombreWS = infoByUser[1];
	apellido1WS = infoByUser[2];
	apellido2WS = infoByUser[3]; 
	nombrePilaWS = infoByUser[4]; 
	aseguradoWS = infoByUser[5];
	idWS = infoByUser[6];
	telefonoWS = infoByUser[7]; 
	emailWS = infoByUser[8]; 
	estadoCivilWS= infoByUser[9]; 
	generoWS = infoByUser[10]; 
	horasWS = infoByUser[11]; 
	jornadaWS = infoByUser[12]; 
	paisWS = infoByUser[13];
	
	//console.log(list)
	//console.log(infoByUser)
	
	if(paisWS == "CR"){
		tipoId = "0";
	}else{
		tipoId = "6";
	}
	
	identificacion = fill(idWS, 19);
	
	numAsegurado = fill(aseguradoWS, 20)

	nombre = fill(deleteChars(nombrePilaWS), 15)
	
	apellido1 = fill(deleteChars(apellido1WS), 15)
	
	apellido2 = fill(deleteChars(apellido2WS), 15)
	
	fechaNacimiento = fill(fechaWS, 10)
	
	telefono = fill(telefonoWS, 8)
	
	correo = fill(emailWS, 40)
	
	genero = fill(generoWS, 1)
	
	estadoCivil = fill(estadoCivilWS, 1)
	
	nacionalidad = fill(paisWS, 2)
	
	salario = fill(detailList.substring(0, 13), 13)
	
	diasLaborales = fill(detailList.substring(13, 16),3)
	
	horasLaborales = fill(horasWS, 4)
	
	jornadaLaboral = fill(jornadaWS, 2);
	
	observacion = fill(detailList.substring(22, 24), 2)
	
	ocupacion = fill(detailList.substring(24, 29), 5)
	
	var resultList = [tipoId, identificacion, numAsegurado, nombre, apellido1, apellido2, fechaNacimiento, telefono, correo, genero, estadoCivil, nacionalidad, salario, diasLaborales, horasLaborales, jornadaLaboral, observacion, ocupacion];
	
	//console.log(resultList)
	
	//console.log(resultList.toString().replace(/,/g, ""))
	
	return resultList.toString().replace(/,/g, "");
}

// Construye el archivo resultante
function createFile(header, lines, name){
	var data = "";
	
	for (var x = 0; x < header.length; x++){
		data += header[x] + "\r\n";
	}
	
	for (var x = 0; x < lines.length; x++){
		data += lines[x] + "\r\n";
	}
	
	var blob = new Blob([data],{type: "text/plain"});
 
	// download the file:
	download(blob, name);
	//saveAs(blob, name);
	
 
}

// Despliega la ventana para guardar el archivo resultante
function download(blob,name) {
	var url = URL.createObjectURL(blob),
	div = document.createElement("div"),
	anch = document.createElement("a");

	document.body.appendChild(div);
	div.appendChild(anch);

	anch.innerHTML = "&nbsp;";
	div.style.width = "0";
	div.style.height = "0";
	anch.href = url;
	anch.download = name;
	
	var ev = new MouseEvent("click",{});
	anch.dispatchEvent(ev);
	document.body.removeChild(div);
}

// AUX FUNCTIONS //

// Imprime una lista
function printList(list, show){
	console.log(list);
	
	if(!show)return;
	
	for (var n = 0; n < list.length; n++){
		alert(list[n]);
	}
}

// Convierte el formato YYYYMMDD -> DDMMYYYY
function toDDMMYYYY(date){
	return date.substring(6, 8) + "/" + date.substring(4, 6) + "/" + date.substring(0, 4) 
}

// Completa con espacios si es requerido
function fill(data, length){
	if(data.length > length)
		data = data.substring(0, length);
	//alert("DATA: " + data + " Size Required: " + length.toString() + "DataSize: " + data.length.toString())
	return data + " ".repeat(length - data.length);
}

// Elimina espacios innecesarios de una línea
function reduceSpaces(line){
	var lineResult = "";
	var addSpace = 1;
	
	for (var i = 0; i < line.length; i++) {
		if(line.charAt(i) != ' '){
			lineResult += line.charAt(i);
			addSpace = 1;
		}else if(line.charAt(i) == ' ' && addSpace == 1){
			lineResult += line.charAt(i);
			addSpace = 0;
		}
	}
	return lineResult;
}

// Elimina caracteres especiales
function deleteChars(data){
	data = data.toUpperCase();
	data = data.replace("Á", "A");
	data = data.replace("É", "E");
	data = data.replace("Í", "I");
	data = data.replace("Ó", "O");
	data = data.replace("Ú", "U");
	data = data.replace("Ñ", "N");
	data = data.replace("Ü", "U");
	return data;
}
