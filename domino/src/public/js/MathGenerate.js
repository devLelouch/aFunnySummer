//DOM handling document

var user = document.getElementById("user").innerHTML;
var match = undefined;
function MatchGenerate(partidasPendt,first){    
    var tabla = document.getElementById('partidas');
    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild);
    }
    for (i in partidasPendt){
        if(partidasPendt[i].id != match) 
            genera_tabla( partidasPendt[i]);
        else 
            genera_tabla(partidasPendt[i],true);
    }
    if(!user) document.getElementById('createMatch').setAttribute('disabled','true');
}
function genera_tabla(data,first) {
    var inGame = false;
    var body = document.getElementById("partidas");
    var tabla   = document.createElement("table");
    var tblHead = document.createElement("thead");
    var tblBody = document.createElement("tbody");
    var tblfoot = document.createElement("thead");
    var button;
    var content = [data.name];
    createTr(content,1,tblHead)
    content = ["Players: ",data.jug[0] + "/" + data.jug[2],"  vs  ",data.jug[1] + "/" + data.jug[3]];
    hilera = createTr(content,4,tblBody);
    content = ["Bet: ",data.bet,"Points to Win:",data.ptoMax];
    hilera = createTr(content,4,tblBody);
    tabla.appendChild(tblHead);
    tabla.appendChild(tblBody);
    hilera = document.createElement("tr");
    if(!first) {
        body.appendChild(tabla);
        console.log('lhjkklk')
        button = createButton('Unirse',"4",(!user),tblfoot)
        button.addEventListener("click",(e)=>{
            e.preventDefault();
            socket.emit('joinMatch', data.id);  
        })
    } else {
        body.insertBefore(tabla, body.childNodes[0]);
        var full = false
        if( ((data.jug[0] == user || data.jug[2] == user)) && (data.jug[1]) && (data.jug[3])  || 
            ((data.jug[1] == user || data.jug[3] == user)) && (data.jug[0]) && (data.jug[2]))
            full = true;
        
        button = createButton('Cambiar Equipo',"2",(full),tblfoot);
        button.addEventListener("click",(e)=>{
            e.preventDefault();
            socket.emit('changeTeam');  
        });
        var button2 = createButton('Salir',"2",(false),tblfoot);
        button2.addEventListener("click",(e)=>{
            e.preventDefault();
            socket.emit('exitMatch');  
        });
    }
    tabla.appendChild(tblfoot); 
    tabla.setAttribute("id",toString(data.id));
    tabla.setAttribute("class", "table table-sm");
    tabla.style.border = "ridge";
    tabla.style.borderColor = "red";
}
function createButton(text,colspan,condition,tblfoot){
    celda = document.createElement("td");  
    button = document.createElement("button");
        textoCelda = document.createTextNode(text);
        button.appendChild(textoCelda);
        celda.appendChild(button);
        celda.setAttribute("colspan", colspan);
        hilera.appendChild(celda);
        tblfoot.appendChild(hilera);
        if(condition) button.setAttribute("disabled", "true");
        button.setAttribute("class", "btn btn-warning");
        return button;
}
function createTr(content,n,tabla){
    var hilera = document.createElement("tr");
    for (var j = 0; j < n; j++) {
        var celda = document.createElement("td");
        var textoCelda = document.createTextNode(content[j]);
        celda.appendChild(textoCelda);
        if(n == 1)
            celda.setAttribute("colspan", "4");
        celda.style.margin = "2px"; 
        hilera.appendChild(celda);
        tabla.appendChild(hilera);
    }
}
function cargarUsuarios(users){
    var tabla = document.getElementById('users');
    while (tabla.firstChild) {
        tabla.removeChild(tabla.firstChild);
    }
    var name = '';
    tabla.appendChild(document.createElement("br"));
    for(i in users){
        name = document.createTextNode(users[i]);
        tabla.appendChild(name);
        tabla.appendChild(document.createElement("br"));
    }
}
function updateMatch(match){
    genera_tabla(match);
}
function dataValidation(){
    var newMatch = {
        jug: [user,"","",""],
        name: document.getElementById("nameMatch").value,
        bet: document.getElementById("betMatch").value,
        ptoMax: document.getElementById("pointsMatch").value
    }
    if (!newMatch.name){
        alert('Debe ingresar el nombre de la partida');
        return false;
    } else 
    {
        return newMatch
    }
}

//Events and Events Handlers
var but1 = document.getElementById('createMatch');
but1.addEventListener('click', (e) => {
    e.preventDefault();
    newMatch = dataValidation();
    socket.emit("newMatch", newMatch);
});
//window.addEventListener('beforeunload', askConfirmation);
function askConfirmation (evt) {
    console.log(match+ 'hola');
    if(match){
        var msg = 'Si recarga la página abandonara la mesa.\n¿Deseas recargar la página?';
        evt.returnValue = msg;
        return msg;
    }
}