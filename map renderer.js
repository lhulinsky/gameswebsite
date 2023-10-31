//data from https://public.opendatasoft.com/
var canvas=document.getElementById("mapCanvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight;
var width=canvas.width;
var height=canvas.height-5;
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
    var value = await LoadTextResource(url);
    return new Promise(function(myResolve){
        try {
			myResolve(JSON.parse(value));
		} catch (e) {
			alert(e);
		}
    });
}
async function loadMap(){
    var mapData=await LoadJSONResource("world borders simple.geojson");
    drawMap(mapData);
}

function drawMap(mapData){
    for(var c=0;c<mapData.features.length;c++){
        alert(mapData.features[c].properties.NAME);
        var coords=mapData.features[c].properties.geometry.coordinates;
        if(mapData.features[c].properties.geometry.type=="Polygon"){
            //convert polygons into multipolygons
            coords=[coords];
        }
        for(var i=0;i<coords.length;i++){
            var polygon=coords[i][0];
            alert(polygon.length);
            ctx.beginPath();
            ctx.moveTo(polygon[0][0]+180,polygon[0][1]+90);
            for(var p=0;p<polygon.length;p++){
                if(p<polygon.length-1){
                    ctx.lineTo(polygon[i+1][0]+180,polygon[i+1][1]+90);
                }
                else{
                    ctx.lineTo(polygon[0][0]+180,polygon[0][1]+90);
                }
            }
        }
        ctx.strokeStyle = "#000000";
        ctx.lineWidth=1;
        ctx.stroke();
    }
    alert("done");
}