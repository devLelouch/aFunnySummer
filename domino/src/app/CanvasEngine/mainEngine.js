// The constructor of the shapes that will be used to draw the pieces
function Shape(x, y, w, h) {
  if (isFloat(x) && isFloat(y) && isFloat(w) && isFloat(h)) { 
    this.x = x || 0;
    this.y = y || 0;
    this.w = w || 1;
    this.h = h || 1;
  }
  else
    console.log('El constructor shape acepta solo valores numericos');
}

// Draws this shape to a given context
Shape.prototype.draw = function(ctx) {
  ctx.fillStyle = this.fill;
  ctx.fillRect(this.x, this.y, this.w, this.h);
}

function CanvasState(canvas) {

  this.valid = false; // when set to true, the canvas will redraw everything
  this.shapes = [];  // the collection of things to be drawn
  this.dragging = false; // Keep track of when we are dragging
  this.selection = null;
  this.dragoffx = 0; 
  this.dragoffy = 0;
  canvas.addEventlistener('mousedown', e => {

  })
}

function PruebaDraw(x,y) { 
  obj['img'+i] = new Image;
  obj['img'+i].src = '/domino/'+ pieces[2*pos[i]] +'-'+ pieces[(2*pos[i])+ 1] + '.PNG';
  ctx.drawImage(obj['img'+0], x, y, alto/15, ancho/15);
}


function isFloat(n){
  if (Number(n) === n) 
    return true;
  else
    return false;
}

