const socket = io();

state = new CanvasState(c);
var hol = true;
if (hol) {
	var id = document.getElementById("id").innerHTML;
	console.log(id); 
	var name = document.getElementById("name").innerHTML;
	console.log(name);
	socket.emit('begin',{
		id: "id" + id,
		name
	});
	hol = false;
}

socket.on('jugada', (data) => {
	rig = data.rig;
	lef = data.lef;
	if(!data.lor) {
		state.game.rig.push(data.play);
		state.game.rigim.push(data.img);
	} else {
		state.game.lef.push(data.play);
		state.game.lefim.push(data.img);
	}
	state.updateDraw();
});
socket.on('cargarJuego', (data) => {
	cargarDomi(data);
	username = data.name;
});
socket.on('ganador', data => {
	alert('Ha ganado el equipo: ' + (data.team + 1) + '/n Total puntos en la partida equipo ganador: ' 
	+ data.won +  '\n/n> Total puntos equipo 1: ' + data.pts[0] + 'Total puntos equipo 2: ' + data.pts[1]);
	clearInterval(timer);
	turn = false;
    state = new CanvasState(c);
});
socket.on('trancado', data => {
	alert('Partida trancada /n Ha ganado el equipo: ' + data.winner + '\n Total puntos en la partida equipo ganador: ' 
	+ data.totW + '/n Total puntos en la partida equipo perdedor: ' + data.totL + '/n\n Total puntos equipo 1: ' +
	data.pts[0] + 'Total puntos equipo 2: ' + data.pts[1]);
	turn = false;
    state = new CanvasState(c);
});
socket.on('turno', () => {
	var Pass = pass();
	if (Pass.pass)
		socket.emit('pass',username);
	else{
		turn = true;
		timer = setTimeout(timeout(Pass),1000);
	}
})

function pass(){
	if (state.game.lef.length){
		var juego = {
		    rig: state.game.rig[state.game.rig.length-1].pos2,
            lef: state.game.lef[state.game.lef.length-1].pos2
		}	
	    for (i in state.handNumbers){
		    if(state.handNumbers[i].pos2 == juego.lef || state.handNumbers[i].pos1 == juego.lef)
				return {pass: false, onTimeouti: i, onTimeoutlor: 'l'};
			if(state.handNumbers[i].pos2 == juego.rig || state.handNumbers[i].pos1 == juego.rig)
				return {pass: false, onTimeouti: i, onTimeoutlor: 'r'};
	    }
	    return {pass: true};
    } else
    return {pass: false, onTimeouti: 0, onTimeoutlor: 'r1'};
}
 function timeout(play){
	return function() {
	if (turn){
		state.selection = play.onTimeouti;
		console.log('timeout' + play.onTimeoutlor);
		if ( play.onTimeoutlor == 'r') {
	        playingPieces(state.game.rig,state.game.rigim);
			socket.emit( 'jugada' , {play: state.game.rig[state.game.rig.length-1], lor: false, img: state.game.rigim[state.game.rig.length-1], username: username, rig: rig, lef: lef, pos: state.selection} );
		} else if (play.onTimeoutlor == 'l'){
			playingPieces(state.game.lef,state.game.lefim);
			socket.emit('jugada', {play: state.game.lef[state.game.lef.length-1], lor: true, img: state.game.lefim[state.game.lef.length-1], username: username, lef: lef, rig: rig, pos: state.selection} );		
		} else {
			playingPieces(state.game.rig,state.game.rigim);
			socket.emit( 'jugada' , {play: state.game.rig[state.game.rig.length-1], lor: false, img: state.game.rigim[state.game.rig.length-1], username: username, rig: rig, lef: lef, pos: state.selection} );
			state.game.lef.push( {pos1: state.handNumbers[state.selection].pos2, pos2: state.handNumbers[state.selection].pos1});
			state.game.lefim.push(state.HandPieces[state.selection].dir);
            socket.emit('jugada', {play: {pos1: state.handNumbers[state.selection].pos2, pos2: state.handNumbers[state.selection].pos1}, lor: true, img: state.game.lefim[state.game.rig.length-1], username: username,rig: rig, lef: lef, pos: state.selection} );
		}
		jugada();
		state.updateDraw();
	}}
 }
