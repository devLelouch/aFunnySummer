
function createMatch(e) {
	e.preventDefault();
	partida = leeMatch();
    return partida;
}
function leeMatch() {
	var partida = {
	jug1: document.getElementById("username").innerHTML,
	jug2: "",
	tPartida: document.getElementById("sel1").value,
	tim: document.getElementById("sel2").value,
	ptmax: document.getElementById("sel3").value,
	apt: document.getElementById("sel4").value
    }
    return partida;
}
function generaPartida(data) {
	document.getElementById("mesas").style.display = "initial";
	document.getElementById("apt").innerHTML = data.apt;
	document.getElementById("tiem").innerHTML = data.tim;
	document.getElementById("tpart").innerHTML = data.tPartida;
	document.getElementById("ptmax").innerHTML = data.ptmax;
	document.getElementById("jug1").innerHTML = data.jug1;
}
function joinDos() {

}
function joinUn() {
	comienzaPartida();
}
function validaJoin() {

}
function comienzaPartida() {
	
}