//Constructors section

// The constructor of the shapes that will be used to draw the pieces
function HandPiece(x, y, w, h, dir, anim) {
  this.loaded = false;
  this.dir = dir;
  if (isFloat(x) && isFloat(y) && isFloat(w) && isFloat(h)) { 
    if (!anim) {
        this.initX = x;  //Piece position in hand 
        this.initY = y;
    }
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }
  else
    console.log('Error al crear el objeto HandPieces');
}

// Draws this shape to a given context
HandPiece.prototype.draw = function() {
    var x = this.x, y=this.y, dir=this.dir, w=this.w, h=this.h;
    if(this.loaded){
        ctx.drawImage(state.imgs[dir], x, y, w, h);
    }
    else { 
        state.imgs[dir].onload = function() {
            ctx.drawImage(state.imgs[dir], x, y, w, h);
        }
        this.loaded = true;
    }
}

function CanvasState(canvas) {
    this.imgs = [];
    this.imgsv = [];
    this.lor = false; // when set to true, the canvas will redraw everything
    this.HandPieces = [];  // the collection of things to be drawn
    this.handNumbers = [];
    this.hand = 6;
    this.playable = { rig: false, lef: false};
    this.game = {
        lefim: [],
        rigim: [],
        lef: [],
        rig: []
    };
    this.dragging = false; // Keep track of when we are dragging
    this.selection = null;
    canvas.addEventListener('mousedown', e => {
        mouseDownf(e);
    });
    canvas.addEventListener('mousemove', e => {
        mouseMovef(e);
    });
    canvas.addEventListener('mouseup', e => {
       mouseUpf(e);
    });
}

CanvasState.prototype.updateDraw = function() {
    limpiar();
    for (i=0; i<=this.hand; i++)
        this.HandPieces[i].draw();
    DibuJuego(this.game.rig, this.imgs,this.imgsv,this.game.rigim);
    DibuJuegoLef(this.game.lef, this.imgs, this.imgsv, this.game.lefim);
}


//seccion de manejo de eventos de CanvasState
function mouseUpf (e) {
     if(state.dragging && turn) {
            var bol = false;
            state.dragging = false;
            if((e.offsetX >= rig.x && e.offsetX <= rig.x + tamx && e.offsetY >= rig.y && e.offsetY <= rig.y + tamy)) {
                if(state.lor == 'r' || state.lor == 'rl' || state.lor == 'r1') { 
                    playingPieces(state.game.rig,state.game.rigim);
                    bol = true;
                    socket.emit('jugada' , {play: state.game.rig[state.game.rig.length-1], lor: false, img: state.game.rigim[state.game.rig.length-1], username: username, rig: rig, lef: lef, pos: state.selection} );
                } 
            }
            if((e.offsetX >= lef.x && e.offsetX <= lef.x + tamx && e.offsetY >= lef.y && e.offsetY <= lef.y + tamy)) {  
                if(state.lor == 'l' || state.lor == 'rl') {    
                    playingPieces(state.game.lef,state.game.lefim);
                    bol = true;
                    socket.emit('jugada', {play: state.game.lef[state.game.lef.length-1], lor: true, img: state.game.lefim[state.game.lef.length-1], username: username, lef: lef, rig: rig, pos: state.selection} );
                } else if (state.lor == 'r1') {
                    state.game.lef.push( {pos1: state.handNumbers[state.selection].pos2, pos2: state.handNumbers[state.selection].pos1});
                    state.game.lefim.push(state.HandPieces[state.selection].dir);
                    socket.emit('jugada', {play: {pos1: state.handNumbers[state.selection].pos2, pos2: state.handNumbers[state.selection].pos1}, lor: true, img: state.game.lefim[state.game.rig.length-1], username: username,rig: rig, lef: lef, pos: state.selection} );
                }
            }
            if (bol) {
                jugada();
            }
            else {
                state.HandPieces[state.selection].x = state.HandPieces[state.selection].initX;
                state.HandPieces[state.selection].y = state.HandPieces[state.selection].initY;
            }
                state.updateDraw();       
        }
}
function jugada(){
    turn = false;
    clearTimeout(timer);
    state.HandPieces.splice(state.selection,1);
    state.handNumbers.splice(state.selection,1);
    state.hand--; 
    if (state.hand < 0)
        socket.emit('ganador', username);
}

function mouseMovef(e) {
      if(state.dragging) {
            state.HandPieces[state.selection].x = e.offsetX;
            state.HandPieces[state.selection].y = e.offsetY;
            state.updateDraw();
            ctx.beginPath();
            ctx.rect(rig.x, rig.y, tamy,  tamy);
            ctx.rect(lef.x, lef.y, tamy,  tamy);
            ctx.stroke();
        }
}
function mouseDownf(e) {
    if(turn) {
        state.lor = '';
        if(state.game.rig.length > 0) {
            var rig = state.game.rig[state.game.rig.length-1].pos2;
            var lef = state.game.lef[state.game.lef.length-1].pos2;
        } else { 
            var rigg = -1;
            var leff = -1;
            var first = true;
        }
            for(i=0; i<=state.hand; i++) {
                if(e.offsetX >= state.HandPieces[i].x && e.offsetX <= state.HandPieces[i].x + tamx && e.offsetY >= state.HandPieces[i].y && e.offsetY <= state.HandPieces[i].y + tamy) {
                    if(state.handNumbers[i].pos1 == rig  || state.handNumbers[i].pos2 == rig || rigg == -1) {
                        state.lor = state.lor + 'r';
                        state.playable.rig = true;
                    }
                    if(state.handNumbers[i].pos1 == lef  || state.handNumbers[i].pos2 == lef || leff == -1) {
                        state.lor = state.lor + 'l';
                        state.playable.lef = true;
                    }
                    break;
                }
            }
               if (state.lor) {
                    state.selection = i;
                    state.dragging = true;
                }
                if(first)
                    state.lor = 'r1';
                
        }
}
function playingPieces(game,img) {
                var pos1 = state.handNumbers[state.selection].pos1;
                var pos2 = state.handNumbers[state.selection].pos2;
                var l = game.length;
                if (l>0) {
                    if(game[l-1].pos2 != state.handNumbers[state.selection].pos1) {
                        var t = pos1;
                        pos1 = pos2;
                        pos2 = t; 
                    }
                }    
                game.push( {pos1: pos1, pos2: pos2});
                img.push(state.HandPieces[state.selection].dir);
}
function isFloat(n){
  if (Number(n) === n) 
    return true;
  else
    return false;
}
function limpiar() {
    ctx.clearRect(0, 0, ancho, alto);
    ctx.fillStyle = 'green';            // Contexto de color verde.
    ctx.fillRect(0, 0, 2000, 2000);  
}


//Funciones de carga inicial
function CargarImgs() {
    var pos1 = 0, pos2 = 0, con = 0;
    for (i=0; i<=6; i++) {
        for (j=pos1; j<=6; j++) {
            state.imgs[con] = new Image;
            state.imgs[con].src = ('/domino/'+ pos1 +'-'+ pos2 + '.PNG');
            state.imgs[con+28] = new Image;
            state.imgs[con+28].src = ('/domino/'+ pos2 +'-'+ pos1 + '.PNG');
            state.imgsv[con] = new Image;
            state.imgsv[con].src = ('/domino/'+ pos1 +'-'+ pos2 + 'v.PNG');
            state.imgsv[con+28] = new Image;
            state.imgsv[con+28].src = ('/domino/'+ pos2 +'-'+ pos1 + 'v.PNG');
            pos2++;
            con++;
        }
        pos1++;
        pos2 = pos1;
    }
}
 function cargarDomi(pieces) {
    CargarImgs()
    state.handNumbers = pieces.pieces;
    dir = pieces.dir;
    for (i=0; i<=6; i++) {
        state.HandPieces[i] = new HandPiece(ubiAn + i*tamx, ubiAl, tamx, tamy, dir[i], false);
    }
    state.updateDraw();
  }