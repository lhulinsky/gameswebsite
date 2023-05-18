var button=document.getElementById("click");
var clickText=document.getElementById("clickCount");
var canvas=document.getElementById("cursorCanvas");
canvas.width=window.innerWidth;
canvas.height=window.innerHeight-70;
var ctx=canvas.getContext("2d");
var cursorImage=new Image();
cursorImage.src="cursor.png";
var oldClicks=document.cookie.split("=")
var clicks=0;
if(oldClicks.length>0 && oldClicks[0]=="clicks"){
    clicks=parseInt(oldClicks[1]);
    cursorImage.onload=function(){
        for(var i=0;i<clicks;i++){
            ctx.drawImage(cursorImage,Math.random()*canvas.width,Math.random()*canvas.height);
        }
    }
}
clickText.innerHTML="You have clicked "+clicks+" times";
function clickCookie(){
    console.log("click");
    clicks+=1;
    document.cookie="clicks="+clicks;
    clickText.innerHTML="You have clicked "+clicks+" times";
    ctx.drawImage(cursorImage,Math.random()*canvas.width,Math.random()*canvas.height);
}
