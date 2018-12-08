function DibuJuego(gam,img,imgv,dirrig) {
    var l = gam.length;
    var ctrDraw = {
        len: 0,
        first: true
    };
    var position = {x: (ancho - 2*tamx)/2, y: (alto - tamy)/2};
    for(i=0; i<l; i++) {
        if(gam[i].pos1 != gam[i].pos2) {
            var dir = dirrig[i];
            if (i) {
                if (ctrDraw.len < 2){
                    if(gam[i].pos2 < gam[i].pos1)
                        dir = dirrig[i] + 28;
                }else{
                    if(gam[i].pos2 > gam[i].pos1)
                        dir = dirrig[i] + 28;
                }
            }
            controlDibujoA(ctrDraw,tamx,tamy,dir,imgv,img,position);
        }else {
            controlDibujoB(ctrDraw,tamx,tamy,dirrig[i],imgv,img,position);
        }
        rig = position;
    }   
}
function controlDibujoA(ctrDraw,tamx,tamy,dir,imgv,img,position){
    if(ctrDraw.len == 0){
        ctx.drawImage(imgv[dir], position.x, position.y, tamy, tamx);
        position.x = position.x + tamy;
        if (position.x > 2*ancho/3){
            ctrDraw.len = 1;
        }
    } else if (ctrDraw.len == 1){
        ctx.drawImage(img[dir], position.x, position.y, tamx, tamy);
        position.y = position.y + tamy;
        ctrDraw.first = false;
        if (position.y > 2*alto/3){
            ctrDraw.len = 2;
        }
    } else if(ctrDraw.len == 2){
        if(!ctrDraw.first){
           position.y = position.y - tamx;   
        }
        position.x = position.x - tamy;
        ctx.drawImage(imgv[dir], position.x, position.y, tamy, tamx);
        ctrDraw.first = true;
    }
}
function controlDibujoB(ctrDraw,tamx,tamy,dir,imgv,img,position){
    if(ctrDraw.len == 0){
        ctx.drawImage(img[dir], position.x, position.y - 1/4*tamy, tamx, tamy);
        if (position.x > 2*ancho/3){
            ctrDraw.len = 1;
            position.y = position.y + 3/4*tamy;
        } else 
            position.x = position.x + tamx;
        }else if (ctrDraw.len == 1){
            if(!ctrDraw.first){
                ctx.drawImage(imgv[dir], position.x - 1/4*tamy, position.y, tamy, tamx);
                position.y = position.y + tamx;
            } else {
                ctx.drawImage(img[dir], position.x, position.y - 1/4*tamy, tamx, tamy);
                position.y = position.y + 3/4*tamy;
                ctrDraw.first = false;
            }
            if (position.y > 2*alto/3){
                ctrDraw.len = 2;
                position.x = position.x - 3/4*tamy;
                ctrDraw.first = true;
            }
        }else if (ctrDraw.len == 2){
            if(ctrDraw.first){
                position.x = position.x - tamx;
                ctx.drawImage(img[dir], position.x, position.y - 1/4*tamy, tamx, tamy);
            } else {
                ctrDraw.first = true;
                ctx.drawImage(imgv[dir], position.x - 1/4*tamy, position.y, tamy, tamx);
                position.x = position.x - 1/2*tamx;
            }
        }
}

function DibuJuegoLef(gam,img,imgv,dirrig) {
    var l = gam.length;
    var ctrDraw = {
        len: 0,
        first: true
    };    
    var position = {x: (ancho - 2*tamx)/2, y: (alto - tamy)/2};
    for(i=1; i<l; i++) {
        if(gam[i].pos1 != gam[i].pos2) {
            var dir = dirrig[i];
            if (ctrDraw.len < 2){
                if(gam[i].pos2 > gam[i].pos1)
                    dir = dirrig[i] + 28;
            }else{
                if(gam[i].pos2 < gam[i].pos1)
                    dir = dirrig[i] + 28;
            }
            controlDibujoAlef(ctrDraw,tamx,tamy,dir,imgv,img,position)
        }else {
            controlDibujoBlef(ctrDraw,tamx,tamy,dirrig[i],imgv,img,position)
        }
    }  
    if(gam.length>1)
        lef = position;
    else
        lef.x = position.x 
}

function controlDibujoAlef(ctrDraw,tamx,tamy,dir,imgv,img,position){
    if(ctrDraw.len == 0){
        position.x = position.x - tamy;
        ctx.drawImage(imgv[dir], position.x, position.y, tamy, tamx);
        if (position.x < ancho/3){
            ctrDraw.len = 1;
        }
    } else if (ctrDraw.len == 1){
        position.y = position.y - tamy;
        ctx.drawImage(img[dir], position.x, position.y, tamx, tamy);
        ctrDraw.first = false;
        if (position.y < alto/3){
            ctrDraw.len = 2;
            position.x = position.x + tamx;
        }
    } else if(ctrDraw.len == 2){
        ctx.drawImage(imgv[dir], position.x, position.y, tamy, tamx);
        position.x = position.x + tamy;
        ctrDraw.first = true;
    }
}
function controlDibujoBlef(ctrDraw,tamx,tamy,dir,imgv,img,position){
    if(ctrDraw.len == 0){
        position.x = position.x - tamx; 
        ctx.drawImage(img[dir], position.x, position.y - 1/4*tamy, tamx, tamy);
        if (position.x < ancho/3){
            ctrDraw.len = 1;
            position.y = position.y - 1/4*tamy;
        } 
        }else if (ctrDraw.len == 1){
            if(!ctrDraw.first){
                position.y = position.y - tamx;
                ctx.drawImage(imgv[dir], position.x - 1/4*tamy, position.y, tamy, tamx);
            } else {
                position.x = position.x - tamx;
                ctx.drawImage(img[dir], position.x, position.y - 1/4*tamy, tamx, tamy);
                position.y = position.y - 1/4*tamy;
                ctrDraw.first = false;
            }
            if (position.y < alto/3){
                ctrDraw.len = 2;
                position.x = position.x + 3/4*tamy;
                ctrDraw.first = true;
            }
        }else if (ctrDraw.len == 2){
            if(ctrDraw.first){
                ctx.drawImage(img[dir], position.x, position.y - 1/4*tamy, tamx, tamy);
                position.x = position.x + tamx;
            } else {
                position.y = position.y - tamx;
                position.x = position.x - tamx;
                ctx.drawImage(imgv[dir], position.x - 1/4*tamy, position.y, tamy, tamx);
                position.x = position.x + 3/4*tamy;
                ctrDraw.first = true;
            }
        }
}
