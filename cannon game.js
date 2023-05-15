var canvas=document.getElementById("gameCanvas");
var width=window.innerWidth;
var height=window.innerHeight-5;
canvas.width=width;
canvas.height=height;
var ctx=canvas.getContext("2d");

function getDistance(point1,point2){
    return Math.sqrt((point1.x-point2.x)**2+(point1.y-point2.y)**2);
}
function getAngle(point1,point2){
    return Math.atan2(point1.y-point2.y,point1.x-point2.x);
}

function explode(x,y,radius,power){
    var center=new Point(x,y);
    var originalLength=building.points.length;
    for(var i=0;i<originalLength;i++){
        var point=building.points[i];
        var dist=getDistance(point,center);
        if(dist<radius){
            //destruction
            for(var l=0;l<building.lines.length;l++){
                if(building.lines[l][0]==i){
                    building.lineDurabilities[l]--;
                    if(building.lineDurabilities[l]<=0){
                        building.points.push(point);
                        building.lines[0]=building.points.length-1;
                        //building.lines.splice(l,1);
                        //building.lineDurabilities.splice(l,1);
                    }
                }
                else if(building.lines[l][1]==i){
                    building.lineDurabilities[l]--;
                    if(building.lineDurabilities[l]<=0){
                        building.points.push(point);
                        building.lines[1]=building.points.length-1;
                        //building.lines.splice(l,1);
                        //building.lineDurabilities.splice(l,1);
                    }
                }
            }
        }
        if(dist<radius*2){
            var angle=getAngle(point,center);
            //yeeting
            point.vx+=Math.cos(angle)*100*power/dist;
            point.vy+=Math.sin(angle)*100*power/dist;
        }
    }
    building.getConnectedPoints();
    explosions.push(new Explosion(x,y,radius));
}

const gravity=.25;
const lineLength=75;
var cannonballs=[];
var explosions=[];
var cannonAngle=0;
var building=new Building();
var powerLevel=.5;
var launchDist=0;
powerRange=document.getElementById("powerRange");
powerRange.oninput = function(){
    powerLevel=this.value/10;
}
var explosionRadius=100;
radiusRange=document.getElementById("radiusRange");
radiusRange.oninput = function(){
    explosionRadius=this.value;
}
function update(){
    ctx.fillStyle="#4ab7ff";
    ctx.fillRect(0,0,width,height);
    ctx.fillStyle="#56ff4a";
    ctx.fillRect(0,height-50,width,50);
    ctx.fillStyle="rgb(50,50,50)";
    ctx.fillRect(50,height-150,100,100);
    ctx.lineWidth=Math.floor(explosionRadius/5);
    ctx.strokeStyle="rgb(50,50,50)";
    ctx.beginPath();
    ctx.moveTo(100,height-100);
    ctx.lineTo(100+Math.cos(cannonAngle)*launchDist,height-100+Math.sin(cannonAngle)*launchDist)
    ctx.stroke();
    for(var i=0;i<cannonballs.length;i++){
        cannonballs[i].update();
        cannonballs[i].draw();
    }
    for(var i=0;i<cannonballs.length;i++){
        closestPoint=0;
        closestPointDist=10000;
        for(var p=0;p<building.points.length;p++){
            var dist=getDistance(cannonballs[i],building.points[p]);
            if(dist<closestPointDist){
                closestPoint=p;
                closestPointDist=dist;
            }
        }
        if(closestPointDist<lineLength){
            for(var l=0;l<building.lines.length;l++){
                var lineIndexOne=building.lines[l][0];
                var lineIndexTwo=building.lines[l][1];
                if(lineIndexOne==closestPoint){
                    var angle=getAngle(building.points[lineIndexTwo],building.points[lineIndexOne]);
                    var collisionPosition=new Point(building.points[lineIndexOne].x+Math.cos(angle)*closestPointDist,building.points[lineIndexOne].y+Math.sin(angle)*closestPointDist)
                    if(getDistance(cannonballs[i],collisionPosition)<30){
                        var power=Math.sqrt((cannonballs[i].vx)**2+(cannonballs[i].vy)**2);
                        explode(cannonballs[i].x,cannonballs[i].y,cannonballs[i].explosionRadius,power*cannonballs[i].powerFactor);
                        cannonballs[i].destroy()
                        break;
                    }
                }
                else if(lineIndexTwo==closestPoint){
                    var angle=getAngle(building.points[lineIndexOne],building.points[lineIndexTwo]);
                    var collisionPosition=new Point(building.points[lineIndexTwo].x+Math.cos(angle)*closestPointDist,building.points[lineIndexTwo].y+Math.sin(angle)*closestPointDist)
                    if(getDistance(cannonballs[i],collisionPosition)<30){
                        var power=Math.sqrt((cannonballs[i].vx)**2+(cannonballs[i].vy)**2);
                        explode(cannonballs[i].x,cannonballs[i].y,cannonballs[i].explosionRadius,power*cannonballs[i].powerFactor);
                        cannonballs[i].destroy();
                        break;
                    }
                }
            }
        }
    }
    for(var i=0;i<cannonballs.length;i++){
        if(cannonballs[i].y>=height-50-cannonballs[i].radius){
            var power=Math.sqrt((cannonballs[i].vx)**2+(cannonballs[i].vy)**2);
            explode(cannonballs[i].x,cannonballs[i].y,cannonballs[i].explosionRadius,power*cannonballs[i].powerFactor);
            cannonballs[i].destroy();
            break;
        }
    }
    building.update();
    building.draw();
    for(var i=0;i<explosions.length;i++){
        explosions[i].draw();
    }
    for(var i=0;i<explosions.length;i++){
        if(explosions[i].radius<=0){
            explosions[i].destroy();
        }
    }
    for(var i=0;i<explosions.length;i++){
        if(explosions[i].radius<=0){
            explosions[i].destroy();
        }
    }
    requestAnimationFrame(update);
}
requestAnimationFrame(update);

document.onmousemove=function move(e){
    cannonAngle=Math.atan2(e.clientY-height+100,e.clientX-100);
    launchDist=getDistance(new Point(100,height-100),new Point(e.clientX,e.clientY));
    launchDist=Math.max(launchDist,100);
    launchDist=Math.min(launchDist,300);
}
document.onmousedown=function shoot(e){
    cannonballs.push(new Cannonball(100+Math.cos(cannonAngle)*150,height-100+Math.sin(cannonAngle)*150,Math.cos(cannonAngle)*launchDist/15,Math.sin(cannonAngle)*launchDist/15))
}
