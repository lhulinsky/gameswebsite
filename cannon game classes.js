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
        this.lineDurabilities=[];
        this.connectedPoints=[];
        for(var y=0;y<10;y++){
            for(var x=0;x<8;x++){
                this.points.push(new Point(600+x*lineLength,height-50-y*lineLength));
            }
        }
        for(var layer=0;layer<3;layer+=1){
            for(var i=0;i<3;i++){
                var index=Math.floor(Math.random()*7)+layer*24;
                this.lines.push([index,index+1]);
                this.lines.push([index,index+8]);
                this.lines.push([index+1,index+9]);
                this.lines.push([index+8,index+9]);
                this.lines.push([index+8,index+16]);
                this.lines.push([index+9,index+17]);
                this.lineDurabilities.push(1);
                this.lineDurabilities.push(1);
                this.lineDurabilities.push(1);
                this.lineDurabilities.push(1);
                this.lineDurabilities.push(1);
                this.lineDurabilities.push(1);
            }
            for(var i=16+layer*24;i<24+layer*24;i++){
                this.lines.push([i,i+8]);
                this.lineDurabilities.push(3);
                if(i<24+layer*24-1){
                    this.lines.push([i,i+1]);
                    this.lines.push([i+8,i+9]);
                    this.lineDurabilities.push(3);
                    this.lineDurabilities.push(3);
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
            this.points[i].vx*=.97;
            this.points[i].vy*=.97;
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
                    this.points[i].vx+=Math.cos(angle+Math.PI)*distDiff*2/this.points.length;
                    this.points[i].vy+=Math.sin(angle+Math.PI)*distDiff*2/this.points.length;
                    this.points[connectedIndex].vx+=Math.cos(angle)*distDiff*2/this.points.length;
                    this.points[connectedIndex].vy+=Math.sin(angle)*distDiff*2/this.points.length;
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
            ctx.strokeStyle="rgb(158, 77, 36)";
            if(this.lineDurabilities[i]>1){
                ctx.strokeStyle="rgba(136,136,136)";
            }
            ctx.beginPath();
            ctx.moveTo(this.points[indexOne].x,this.points[indexOne].y);
            ctx.lineTo(this.points[indexTwo].x,this.points[indexTwo].y);
            ctx.stroke();
        }
    }
}
