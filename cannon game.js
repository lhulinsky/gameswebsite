var canvas=document.getElementById("gameCanvas");
var width=window.innerWidth;
var height=window.innerHeight-5;
canvas.width=width;
canvas.height=height;
var ctx=canvas.getContext("2d");
class Cannonball{
    constructor(x,y,vx,vy){
        this.x=x;
        this.y=y;
        this.vx=vx;
        this.vy=vy;
        this.radius=explosionRadius/5;
        this.powerFactor=powerLevel;
        this.explosionRadius=explosionRadius;
    }
    update(){
        this.vy+=gravity;
        this.x+=this.vx;
        this.y+=this.vy;
    }
    draw(){
        ctx.fillStyle="black";
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
    destroy(){
        var index=cannonballs.indexOf(this);
        cannonballs.splice(index,1);
    }
}

class Explosion{
    constructor(x,y,radius){
        this.x=x;
        this.y=y;
        this.radius=radius;
    }
    draw(){
        ctx.fillStyle="rgba(255,160,0,.5)";
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();
        this.radius-=5;
    }
    destroy(){
        var index=explosions.indexOf(this);
        explosions.splice(index,1);
    }
}

function getDistance(point1,point2){
    return Math.sqrt((point1.x-point2.x)**2+(point1.y-point2.y)**2);
}
function getAngle(point1,point2){
    return Math.atan2(point1.y-point2.y,point1.x-point2.x);
}

class Point{
    constructor(x,y,vx=0,vy=0){
        this.x=x;
        this.y=y;
        this.vx=vx;
        this.vy=vy;
    }
}

class Building{
    constructor(){
        this.points=[];
        this.lines=[];
        this.connectedPoints=[];
        for(var y=0;y<12;y++){
            for(var x=0;x<12;x++){
                this.points.push(new Point(600+x*lineLength,height-50-y*lineLength));
            }
        }
        for(var layer=0;layer<3;layer+=1){
            for(var i=0;i<3;i++){
                var index=Math.floor(Math.random()*11)+layer*36;
                this.lines.push([index,index+1]);
                this.lines.push([index,index+12]);
                this.lines.push([index+1,index+13]);
                this.lines.push([index+12,index+13]);
                this.lines.push([index+12,index+24]);
                this.lines.push([index+13,index+25]);
            }
            for(var i=24+layer*36;i<36+layer*36;i++){
                this.lines.push([i,i+12]);
                if(i<36+layer*36-1){
                    this.lines.push([i,i+1]);
                    this.lines.push([i+12,i+13]);
                }
            }
        }
        this.getConnectedPoints();
        this.distances=[];
        for(var i=0;i<this.points.length;i++){
            this.distances.push([]);
        }
        for(var i=0;i<this.points.length;i++){
            for(var j=0;j<this.points.length;j++){
                this.distances[i].push(getDistance(this.points[i],this.points[j]));
            }
        }
    }
    update(){
        for(var i=0;i<this.points.length;i++){
            this.points[i].vy+=gravity;
            this.points[i].vx*=.98;
            this.points[i].vy*=.98;
            if(this.points[i].y>=height-50){
                this.points[i].vy=0;
                this.points[i].y=height-50;
                this.points[i].vx*=.1;
            }
            if(this.points[i].x>=width){
                this.points[i].vx=0;
                this.points[i].x=width;
            }
            if(this.points[i].x<=0){
                this.points[i].vx=0;
                this.points[i].x=0;
            }
            for(var j=0;j<this.connectedPoints[i].length;j++){
                var connectedIndex=this.connectedPoints[i][j];
                var distDiff=getDistance(this.points[i],this.points[connectedIndex])-this.distances[i][connectedIndex];
                if(i!=j && distDiff!=0){
                    var angle=getAngle(this.points[i],this.points[connectedIndex]);
                    this.points[i].vx+=Math.cos(angle+Math.PI)*distDiff*.2;
                    this.points[i].vy+=Math.sin(angle+Math.PI)*distDiff*.2;
                    this.points[connectedIndex].vx+=Math.cos(angle)*distDiff*.2;
                    this.points[connectedIndex].vy+=Math.sin(angle)*distDiff*.2;
                }
            }
            this.points[i].x+=this.points[i].vx;
            this.points[i].y+=this.points[i].vy;
        }
    }
    getConnectedPoints(){
        this.connectedPoints=[];
        for(var i=0;i<this.points.length;i++){
            this.connectedPoints.push([]);
            var skipBranchSearch=false;
            for(var j=0;j<i;j++){
                if(this.connectedPoints[j].includes(j)){
                    //use pre-existing list of connected points
                    var newConnectedPoints=this.connectedPoints[j].slice();
                    newConnectedPoints.splice(i,1);
                    newConnectedPoints.push(j);
                    this.connectedPoints[i]=newConnectedPoints;
                    skipBranchSearch=true;
                    break;
                }
            }
            if(!skipBranchSearch){
                //do the long branch search thing
                var edgePoints=[i];
                while(true){
                    var newEdgePoints=[];
                    for(var j=0;j<edgePoints.length;j++){
                        for(var l=0;l<this.lines.length;l++){
                            if(this.lines[l][0]==edgePoints[j]){
                                if(!this.connectedPoints[i].includes(this.lines[l][1]) && !edgePoints.includes(this.lines[l][1]) && !newEdgePoints.includes(this.lines[l][1])){
                                    newEdgePoints.push(this.lines[l][1]);
                                }
                            }
                            else if(this.lines[l][1]==edgePoints[j]){
                                if(!this.connectedPoints[i].includes(this.lines[l][0]) && !edgePoints.includes(this.lines[l][0]) && !newEdgePoints.includes(this.lines[l][0])){
                                    newEdgePoints.push(this.lines[l][0]);
                                }
                            }
                        }
                    }
                    this.connectedPoints[i]=this.connectedPoints[i].concat(edgePoints);
                    if(newEdgePoints.length==0){
                        break;
                    }
                    edgePoints=newEdgePoints.slice();
                }
                this.connectedPoints[i].splice(0,1);
            }
        }
    }
    draw(){
        for(var i=0;i<this.lines.length;i++){
            var indexOne=this.lines[i][0];
            var indexTwo=this.lines[i][1];
            ctx.lineWidth=5;
            ctx.strokeStyle="brown";
            ctx.beginPath();
            ctx.moveTo(this.points[indexOne].x,this.points[indexOne].y);
            ctx.lineTo(this.points[indexTwo].x,this.points[indexTwo].y);
            ctx.stroke();
        }
    }
}

function explode(x,y,radius,power){
    var center=new Point(x,y);
    for(var i=0;i<building.points.length;i++){
        var point=building.points[i];
        var dist=getDistance(point,center);
        if(dist<radius){
            //destruction
            for(var l=0;l<building.lines.length;l++){
                if(building.lines[l][0]==i){
                    building.lines.splice(l,1);
                }
                else if(building.lines[l][1]==i){
                    building.lines.splice(l,1);
                }
            }
        }
        else if(dist<radius*2){
            var angle=getAngle(point,center);
            //yeeting
            point.vx+=Math.cos(angle)*100*power/dist;
            point.vy+=Math.sin(angle)*100*power/dist;
        }
    }
    building.getConnectedPoints();
    explosions.push(new Explosion(x,y,radius));
}

const gravity=.2;
const lineLength=50;
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
    cannonballs.push(new Cannonball(100+Math.cos(cannonAngle)*150,height-100+Math.sin(cannonAngle)*150,Math.cos(cannonAngle)*launchDist/10,Math.sin(cannonAngle)*launchDist/10))
}
