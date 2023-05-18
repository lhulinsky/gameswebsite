var button=document.getElementById("click");
console.log(document.cookie);
var clicks=0;
function clickCookie(){
    console.log("click");
    clicks+=1;
    document.cookie="clicks="+clicks+";expires="+(new Date().getTime()+24*60*60*1000);
}
