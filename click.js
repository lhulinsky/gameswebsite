var button=document.getElementById("click");
var clickText=document.getElementById("clickCount");
var oldClicks=document.cookie.split("=")
var clicks=0;
if(len(oldClicks)>0){
    clicks=parseInt(oldClicks[1]);
}
clickText.innerHTML="You have clicked "+clicks+" times";
function clickCookie(){
    console.log("click");
    clicks+=1;
    document.cookie="clicks="+clicks+";expires="+(new Date().getTime()+24*60*60*1000);
    clickText.innerHTML="You have clicked "+clicks+" times";
}
