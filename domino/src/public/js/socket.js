//socket events document

const socket = io();
var bol = true;
var user = document.getElementById("user").innerHTML;
if (bol){
	socket.emit('loadRoom', user);
	bol = false;
}

socket.on('cargarSala', sala => {
	if(sala.match) match = sala.match;
	MatchGenerate(sala.partidasPendt);
	cargarUsuarios(sala.users);
});
socket.on('alert', ()=>{
	alert('Por favor no abrir mas de una instancia de la pagina');
	tabla = document.getElementsByTagName('body');
	while (tabla[0].firstChild) {
        tabla[0].removeChild(tabla[0].firstChild);
    }
})
socket.on('updateUsers', users => {
	cargarUsuarios(users);
});
socket.on('updateMatch',partidasPendt =>{
	console.log('por aqui paso mi amor xD');
    MatchGenerate(partidasPendt);
});
socket.on('joinSuccess', data => {
	console.log(data.partidasPendt);
	match = data.id;
	MatchGenerate(data.partidasPendt);
});
socket.on('newMatch', match => {
	updateMatch(match);
})
socket.on('new message', datos => {
    chat.innerHTML =   chat.innerHTML + datos + '<br>';
});
socket.on('create match', data => {
	generaPartida(data);
});
socket.on('begin', id => {
    window.location.href = '/play/'+ id;
});

