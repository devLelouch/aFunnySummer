// Declaracion de variables 
var c = document.getElementById("myCanvas");
var ancho = window.innerWidth;
var alto = window.innerHeight;  
var state = {};
//tamaño de las piezas.
var tamx = ancho/40;
var tamy = 2*tamx;   

//posición de las piezas por jugar
var rig = {x: (ancho - 2*tamx)/2, y: (alto - tamy)/2};
var lef = {x: (ancho - 2*tamx)/2, y: (alto - tamy)/2};
var turn = false;
var username = ''; 
var firstT = true;
var timer;


//Caja de piezas
function generaPiezas() {
    var pieces = [];
    for (i=0; i<=6; i++) {
	   for (j=i; j<=6; j++) {
		  pieces.push(i);
		  pieces.push(j);
	   }
    }
    return pieces;
}

//inicializacion del canvas
c.width = ancho;
c.height = alto;
ctx = c.getContext('2d');
obj = {};
//visualización gráfica de las piezas
var ubiAl = alto - 3/2*tamy;
var ubiAn = ancho - ancho/2 - (3*ancho/15);


 
/*function eventos() {
    var down = false;
    console.log(ctx.keys);
        ctx.canvas.addEventListener('mousedown', function () { 
            console.log('hableme claro');
            down = true; 
        }, false);
        ctx.canvas.addEventListener('mouseup', function () {
            console.log('klk'); 
            down = false; 
        }, false);
        ctx.canvas.addEventListener('mousemove', function (event) {
            if (down){
                //Rxt.translate(0, -50);
                //clear();
                ctx.drawImage(obj.img0, event.clientX - this.offsetLeft,
                event.clientY - this.offsetTop, 50, 50);
                //Rxt.translate(0, 50);
            }
        }, false);
}*/





