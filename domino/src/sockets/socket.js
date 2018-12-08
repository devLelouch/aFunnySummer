var partida = {
    jug: [],
    pts: [0,0],
    game: {
        lef: [],
        rig: [] },
    turn: -1,
    turnOnmatch: -2,
    trc: 0
    };
var partidasPendt = {};
var id = 1;
var gameOver = false;
var inGameusr = {};
var partidas = {};
console.log(partida);
module.exports = function (io) {
    var timerDc = {};
    var users = {};
    var usersKeys = []
    var tranca = {};
    var ide = 0;
    var cont = {};
    io.on('connection', socket => {

        //sala de espera

    	socket.on('loadRoom', username => {
           /* if(timerDc[username]){
                clearInterval(timerDc[username]);
                timerDc[username] = {};
            }*/
            if(!username){
                socket.emit('cargarSala', {partidasPendt, keys: Object.getOwnPropertyNames(partidasPendt), users: Object.getOwnPropertyNames(users), match: socket.match});
                return;
            }
            if(socket.userinfo && users[username]) return 
            else
            if(users[username] && !(socket.userinfo) && (!timerDc[username])) socket.emit('alert');
            else {
                socket.userinfo = username;
                users[username] = socket;
                var usrKeys = Object.getOwnPropertyNames(users)
                users[username].emit('cargarSala', {partidasPendt, keys: Object.getOwnPropertyNames(partidasPendt), users: usrKeys });
                io.sockets.emit('updateUsers', usrKeys);
            }
        });
        socket.on('joinMatch', id => {
            console.log(id);
            var idd = "id" + id;
            if (!socket.match && socket.userinfo){
                socket.match = id;
                var success = false;
                for (i=0;i<=3;i++){
                    if (partidasPendt[idd].jug[i] == ""){
                        partidasPendt[idd].jug[i] = socket.userinfo;
                        success = true;
                        break;
                    }
                }
                if(success){
                    if( partidasPendt[idd].jug[0] && partidasPendt[idd].jug[1] &&
                    partidasPendt[idd].jug[2] && partidasPendt[idd].jug[3] ){
                        partidas[idd] = new Partida();
                        cont[idd] = 0;
                        inGameusr[idd] = { users: {}, con: 0}; 
                        for (i=0;i<=3;i++){
                            console.log('si empieza')
                            partidas[idd].jug[i] = {
                                name: partidasPendt[idd].jug[i].trim(),
                                pieces: [],
                                dir: []
                            }       
                            users[partidasPendt[idd].jug[i]].emit('begin',id);
                            delete users[partidasPendt[idd]];
                        }
                    } else {
                        console.log('no empieza');
                        socket.broadcast.emit('updateMatch',partidasPendt);
                        users[socket.userinfo].emit('joinSuccess',{partidasPendt, id: socket.match});
                    }
                }
            } 
        })
        socket.on('newMatch', match => {
            if(users[socket.userinfo] && !(socket.match)){
                match.id = id;
                partidasPendt["id"+id] = match;
                socket.match = id; 
                id++;
                socket.broadcast.emit('updateMatch',partidasPendt);
                socket.emit('joinSuccess',{partidasPendt, id: socket.match})
            }
        })
        socket.on('exitMatch', () => {
            exitMatch(socket);
        });
        socket.on('changeMatch', () => {
            changeMatch(socket);
        });
        //set timer or another variables to solve conection/reconection/reload problems
        socket.on('disconnect', data => {
            console.log('no me desconectes');
            if(!socket.userinfo) return;
            if(socket.match){
                exitMatch(socket);
            }
            delete users[socket.userinfo];
            io.sockets.emit('updateUsers',Object.getOwnPropertyNames(users));
          });

        //seccion del juego
        function changeMatch(socket){
            var changeable = false;
            var indx = 0;
            var team = findTeam(socket);
            if( team == 0 || team == 2 ) indx++;
            if( !partidasPendt["id"+socket.match].jug[indx]) {
                partidasPendt["id"+socket.match].jug[indx] = socket.userinfo;
                partidasPendt["id"+socket.match].jug[team] = "";
            }else
            if (!partidasPendt["id"+socket.match].jug[indx + 2]){
                partidasPendt["id"+socket.match].jug[indx + 2] = socket.userinfo;
                partidasPendt["id"+socket.match].jug[team] = "";
            }

        }
        function findTeam(socket){
            for (v=0;v<=3;v++){
                if (partidasPendt["id"+socket.match].jug[i] == socket.userinfo)
                    return i;
            }
        }
        function exitMatch(socket){
            var bool = true;
            var id = socket.match;
            console.log('hola');
            for (i=0;i<=3;i++){
                if (partidasPendt["id"+id].jug[i] == socket.userinfo){
                    partidasPendt["id"+id].jug[i] = "";
                }
                if(partidasPendt["id"+id].jug[i] != "")
                    bool = false;
            }
            if(bool)
                delete partidasPendt["id" + id];
            socket.match = undefined;
            io.sockets.emit('updateMatch',partidasPendt);
        }


        socket.on('begin', (data) => {
            console.log("id: "+ data.id + " name: "+data.name+" users: ")
            if( (!data.id) || (!data.name) || (!inGameusr[data.id])){
                console.log('error catch')
            } else {
                if(inGameusr[data.id] == "h")
                    inGameusr[data.id] = []; 
                socket.id = data.id;
                socket.userinfo = data.name.trim();
                inGameusr[data.id].users[data.name.trim()] = socket;
                inGameusr[data.id].con++;
                console.log(inGameusr[data.id].con); 
                if(inGameusr[data.id].con == 4){
                    comenzar(partidas[data.id],inGameusr[data.id].users);
                }
            }
        });
        socket.on('jugada', data => {
            partidas[socket.id].trc = 0;
            if(!gameOver){
            if(data.lor){ 
                partidas[socket.id].game.lef.push(data.play);
            }
            else
                partidas[socket.id].game.rig.push(data.play);
            for(i=0; i<=3; i++){
                if(data.username != partidas[socket.id].jug[i].name) 
                    inGameusr[socket.id].users[partidas[socket.id].jug[i].name].emit('jugada', data);
                else if(partidas[socket.id].turnOnmatch > -1)
                    partidas[socket.id].turnOnmatch = i;
            } 
            if(partidas[socket.id].turnOnmatch > -1){
                partidas[socket.id].jug[partidas[socket.id].turnOnmatch].pieces.splice(data.pos,1);
                partidas[socket.id].jug[partidas[socket.id].turnOnmatch].dir.splice(data.pos,1);
                turn(partidas[socket.id].turnOnmatch, inGameusr[socket.id].users,partidas[socket.id]);
            }else
                partidas[socket.id].turnOnmatch = 0;
            }
        });
        socket.on('ganador', username => {
            if(!gameOver){
                var tem = team(partidas[socket.id],username);
                var totw = counter(tem,partidas[socket.id]);
                partidas[socket.id].pts[tem] = partidas[socket.id].pts[tem] + totw;
                io.sockets.emit('ganador', {team: tem, won: totw, pts: partidas[socket.id].pts});
                setTimeout(function() {
                    partidas[socket.id] = beginAgain(partidas[socket.id]);
                    comenzar(partidas[socket.id],inGameusr[socket.id].users);
                }, 20000);
            }
        })
        socket.on('pass', (username) => {
            if(!gameOver){
                partidas[socket.id].trc++;
            if (partidas[socket.id].trc < 4){
                for(i=0; i<=3; i++){
                    if(username == partidas[socket.id].jug[i].name) 
                        turn(i,inGameusr[socket.id].users ,partidas[socket.id]);
                }
            } else{
                tranca = trancado(partidas[socket.id]);
                gameOver = true;
                io.sockets.emit('trancado', tranca);
                setTimeout(function() {
                    partidas[socket.id] = beginAgain(partidas[socket.id]);
                    comenzar(partidas[socket.id],inGameusr[socket.id].users);
                }, 20000);
                console.log('yo no paso');
            }
            }
        });
    });
}
function beginAgain(partida){
        var jugaux = partida.jug, ptsaux = partida.pts, turnaux = partida.turn;
        for (i in partida.jug){
            partida.jug[i].pieces = [];
            partida.jug[i].dir = [];
        }
        partida = {
            jug: jugaux,
            nJugs: 0,
            pts: ptsaux,
            game: {
                lef: [],
                rig: [] },
            turn: turnaux,
            turnOnmatch: -2,
            trc: 0
        };
        gameOver = false;
        console.log(partida.turnOnmatch + 'Yo voy primero');
        return partida;
}
function Partida(){
    this.jug = {};
    this.pts = [0,0];
    this.game = {
            lef: [],
            rig: [] };
    this.turn = -1;
    this.turnOnmatch = -2;
    this.trc = 0;
}



function comenzar(partida,users) { 
    //Reparticion de las piezas 
    var pieces = generaPiezas();
    var pos = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27]
    gameOver = false;
    for (i = 28; i; i--) {
        j = Math.floor(Math.random() * i);
        k = pos[i - 1];
        pos[i - 1] = pos[j];
        pos[j] = k;
    }   
    for ( i=1; i<=4; i++) {
        var p = [];
        for (j=(i-1)*7; j<=(i*7)-1; j++){
            p[j-(i-1)*7] = pos[j];
        }
        cargarDomi(partida,p,i-1,pieces);
        console.log({ partida:  partida.jug[i-1].name, users: users["pepe"]} );
        users[partida.jug[i-1].name].emit('cargarJuego', partida.jug[i-1]);
    }
    if(partida.turn == -1)
        partida.turn = firstTurn(partida);
    else{
        if (partida.turn<3)
            partida.turn++;
        else
            partida.turn = 0;
    }
    users[partida.jug[partida.turn].name].emit('turno');
    console.log(' yo paso despues '+ gameOver)
}
function turn(i,users,partida) {
    if (i<3){
        users[partida.jug[i+1].name].emit('turno');
    }
    else {
        users[partida.jug[0].name].emit('turno');    
    }
}
//Caja de piezas
//Caja de piezas
function generaPiezas() {
    var pieces = [];
    for (p=0; p<=6; p++) {
	   for (j=p; j<=6; j++) {
		  pieces.push(p);
		  pieces.push(j);
	   }
    }
    return pieces;
}

function cargarDomi(partida,pos,i,pieces) {
    for (k=0; k<=6; k++) {
        var pos1 = pieces[2*pos[k]], pos2 = pieces[(2*pos[k])+1];
        partida.jug[i].pieces[k] = { pos1, pos2 };
        partida.jug[i].dir[k] = pos[k];
    }
  }
function firstTurn(partida){
    for(i=0; i<=3; i++){
        for (j=0; j<=6; j++) {
            if(partida.jug[i].pieces[j].pos1 == 6 && partida.jug[i].pieces[j].pos2 == 6)
                return i;
        }
    }
}
function trancado(partida){
    var tot1= 0, tot2 = 0;
    var totW, totL;
    for(i=0;i<=3;i++){
        if(i==0 || i==2){
            tot1 += sumPiece(i,partida);
        } else {
            tot2 += sumPiece(i,partida);
        }
    }
    console.log(tot1 + ' y tot2 ' + tot2);
    if(tot2 < tot1){
        totW = tot1;
        totL = tot2;
        tot1 = 1;
        partida.pts[0] += totW;
    } else if (tot1 < tot2){
        totW = tot2;
        totL = tot1;
        tot1 = 2;
        partida.pts[1] += totL;
    } 
    return {winner: tot1, totW, totL, pts: partida.pts};
}

function team(partida,username) {
    for(i=0;i<=3;i++){
        if(partida.jug[i].name == username)
            if(i == 0 || i == 2)
                return 0;
            else
                return 1;       
    }
}
function counter(team,partida) {
    var totw = 0;
    for(j=0;j<=3;j++){
        if(team == 1 && (j == 0 || j==2)) {
            totw += sumPiece(j,partida);
        } else if(team == 0 && (j == 1 || j==3)){
            totw += sumPiece(j,partida);
        }
    }
    return totw;
}
function sumPiece(i,partida){
    var total = 0;
    for(k in partida.jug[i].pieces){
        total += partida.jug[i].pieces[k].pos1;
        total += partida.jug[i].pieces[k].pos2;
    }
    return total;
}




/*socket.on('begin', () => {
    var name
    if(c == 0)
        name = 'hola';
    if(c == 1)
        name = 'mundo';
    if(c == 2)
        name = 'del';
    if(c == 3)
        name = 'domino'
    partida.jug[c] = {
        name: name,
        pieces: [],
        dir: []
    }   
    c++;
    socket.nickname = name;
    users[socket.nickname] = socket;
    if (c == 4){
        c = 0;
        comenzar(partida,users);
    }
});
socket.on('jugada', data => {
    partida.trc = 0;
    if(!gameOver){
    if(data.lor){ 
        partida.game.lef.push(data.play);
    }
    else
        partida.game.rig.push(data.play);
    for(i=0; i<=3; i++){
        if(data.username != partida.jug[i].name) 
            users[partida.jug[i].name].emit('jugada', data);
        else if(partida.turnOnmatch > -1)
            partida.turnOnmatch = i;
    } 
    if(partida.turnOnmatch > -1){
        partida.jug[partida.turnOnmatch].pieces.splice(data.pos,1);
        partida.jug[partida.turnOnmatch].dir.splice(data.pos,1);
        turn(partida.turnOnmatch,users,partida);
    }else
        partida.turnOnmatch = 0;
    }
});
socket.on('ganador', username => {
    if(!gameOver){
    var tem = team(partida,username);
    var totw = counter(tem,partida);
    partida.pts[tem] = partida.pts[tem] + totw;
    io.sockets.emit('ganador', {team: tem, won: totw, pts: partida.pts});
    setTimeout(beginAgain, 20000,users);
    console.log(gameOver);
    }
})
socket.on('pass', (username) => {
    if(!gameOver){
    partida.trc++;
    if (partida.trc < 4){
        for(i=0; i<=3; i++){
            if(username == partida.jug[i].name) 
                turn(i,users,partida);
        }
    } else{
        tranca = trancado(partida);
        gameOver = true;
        io.sockets.emit('trancado', tranca);
        setTimeout(beginAgain, 20000,users);
        console.log('yo no paso');
    }
    }
});
});*/