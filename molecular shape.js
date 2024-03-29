var canvas=document.getElementById("gameCanvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight-5;
var ctx=canvas.getContext("2d");
class Vector3{
    constructor(x,y,z){
        this.x=x;
        this.y=y;
        this.z=z;
    }
    subtract(vector){
        return new Vector3(this.x-vector.x,this.y-vector.y,this.z-vector.z);
    }
    add(vector){
        return new Vector3(this.x+vector.x,this.y+vector.y,this.z+vector.z);
    }
    scale(k){
        return new Vector3(this.x*k,this.y*k,this.z*k);
    }
    getLength(){
        return Math.sqrt(this.x**2+this.y**2+this.z**2);
    }
    limitDistance(maxDist){
        return this.scale(maxDist/this.getLength())
    }
    rotateY(angle){
        var x=this.x*Math.cos(angle)-this.z*Math.sin(angle);
        var z=this.x*Math.sin(angle)+this.z*Math.cos(angle);
        return new Vector3(x,this.y,z);
    }
}
class Atom{
    constructor(x,y,z){
        this.position=new Vector3(x,y,z);
        this.velocity=new Vector3(0,0,0);
    }
}
var atoms=[new Atom(1,0,0),new Atom(0,1,0),new Atom(0,0,1),new Atom(0,1,1),new Atom(-1,0,0)];
function applyForces(){
    for(var i=0;i<atoms.length;i++){
        for(var a=0;a<atoms.length;a++){
            if(a!=i){
                var direction=atoms[i].position.subtract(atoms[a].position);
                var dist=direction.getLength();
                atoms[a].velocity=atoms[a].velocity.subtract(direction.scale(.1/dist**2));
            }
        }
    }
    for(var i=0;i<atoms.length;i++){
        atoms[i].position=atoms[i].position.add(atoms[i].velocity);
        atoms[i].position=atoms[i].position.limitDistance(1);
        atoms[i].velocity=atoms[i].velocity.scale(.99);
    }
}
var animationAngle=0;
function draw(){
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle="blue";
    animationAngle+=.01;
    var sortedPositions=[];
    for(var i=0;i<atoms.length;i++){
        sortedPositions.push(atoms[i].position.rotateY(animationAngle));
    }
    for(var i=0;i<sortedPositions.length-1;i++){
        if(sortedPositions[i].z>sortedPositions[i+1].z){
            firstAtom=sortedPositions[i];
            sortedPositions[i]=sortedPositions[i+1];
            sortedPositions[i+1]=firstAtom;
            i=0;
        }
    }
    for(var i=0;i<sortedPositions.length;i++){
        ctx.beginPath();
        ctx.moveTo(canvas.width/2,canvas.height/2);
        ctx.lineTo(canvas.width/2+sortedPositions[i].x*100,canvas.height/2+sortedPositions[i].y*100);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(canvas.width/2+sortedPositions[i].x*100,canvas.height/2+sortedPositions[i].y*100,sortedPositions[i].z*3+10, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function update(){
    applyForces();
    draw();
    requestAnimationFrame(update);
}
document.onkeydown=(e) => {
    if(e.keyCode==189){
        atoms=atoms.slice(0,atoms.length-1);
    }
    else if(e.keyCode==187){
        atoms.push(new Atom(Math.random()*2-1,Math.random()*2-1,Math.random()*2-1))
    }
}
requestAnimationFrame(update);