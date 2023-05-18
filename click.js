var button=document.getElementById("click");
var clickText=document.getElementById("clickCount");
var oldClicks=document.cookie.split("=")
var clicks=0;
if(oldClicks.length>0 && oldClicks[0]=="clicks"){
    clicks=parseInt(oldClicks[1]);
}
clickText.innerHTML="You have clicked "+clicks+" times";
function clickCookie(){
    console.log("click");
    clicks+=1;
    document.cookie="clicks="+clicks;
    clickText.innerHTML="You have clicked "+clicks+" times";
}
