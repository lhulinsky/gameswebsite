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
}
class Atom{
    constructor(x,y,z){
        this.position=new Vector3(x,y,z);
        this.velocity=new Vector3(0,0,0);
    }
}
var atoms=[new Atom(1,0,0),new Atom(0,1,0)];
function applyForces(){
    for(var i=0;i<atoms.length;i++){
        atoms[i].position=atoms[i].position.add(atoms[i].velocity);
        for(var a=0;a<atoms.length;a++){
            if(a!=i){
                var direction=atoms[i].position.subtract(atoms[a]);
                var dist=direction.getLength();
                atoms[a].velocity=atoms[a].velocity.add(direction.scale(10/dist**2));
            }
        }
        atoms[i].velocity=atoms[i].velocity.scale(.99);
    }
}
function draw(){
    for(var i=0;i<atoms.length;i++){
        ctx.beginPath();
        ctx.moveTo(canvas.width/2,canvas.height/2);
        ctx.lineTo(canvas.width/2+atoms[i].position.x*100,canvas.height/2+atoms[i].position.y*100);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(canvas.width/2+atoms[i].position.x*100,canvas.height/2+atoms[i].position.y*100, 10, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function update(){
    applyForces();
    draw();
    requestAnimationFrame(update);
}
requestAnimationFrame(update);