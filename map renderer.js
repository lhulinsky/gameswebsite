//data from https://public.opendatasoft.com/
var canvas=document.getElementById("mapCanvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
var width=canvas.width;
var height=canvas.height;
var ctx=canvas.getContext("2d");
function LoadTextResource(url){
    return new Promise(function(myResolve,myReject){
        var request = new XMLHttpRequest();
    	request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
    	request.onload = function () {
    		if (request.status < 200 || request.status > 299) {
    			myReject('Error: HTTP Status ' + request.status + ' on resource ' + url);
    		} else {
    			myResolve(request.responseText);
    		}
    	};
    	request.send();
    });
}

async function LoadJSONResource(url){
    var value = await NewLoadTextResource(url);
    return new Promise(function(myResolve){
        try {
			myResolve(JSON.parse(value));
		} catch (e) {
			alert(e);
		}
    });
}
async function loadMap(){
    var mapData=await LoadJSONResource("world-administrative-boundaries-americas.json");
    drawMap(mapData);
}

function drawMap(mapData){
    var canada=mapData[0];
    var points=canada.geo_shape.geometry.coordinates[0][0];
    ctx.beginPath();
    ctx.moveTo(points[0][0]+180,points[0][1]+90);
    for(var i=0;i<points.length;i++){
        if(i<points.length-1){
            ctx.lineTo(points[i+1][0]+180,points[i+1][1]+90);
        }
        else{
            ctx.lineTo(points[0][0]+180,points[0][1]+90);
        }
    }
    ctx.strokeStyle = "#000000";
    ctx.lineWidth=1;
    ctx.stroke();
}