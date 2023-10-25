var canvas=document.getElementById("gameCanvas");
canvas.width=600;
canvas.height=600;
var tileSize=canvas.width/3;
var ctx=canvas.getContext("2d");
function update(){
    ctx.lineWidth=3;
    ctx.beginPath();
    ctx.moveTo(tileSize,0);
    ctx.lineTo(tileSize,tileSize*3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(tileSize*2,0);
    ctx.lineTo(tileSize*2,tileSize*3);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0,tileSize);
    ctx.lineTo(tileSize*3,tileSize);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0,tileSize*2);
    ctx.lineTo(tileSize*3,tileSize*2);
    ctx.stroke();
    requestAnimationFrame(update);
}
requestAnimationFrame(update);