console.log(document.cookie);
var clicks=0;
function click(){
    clicks+=1;
    document.cookie="clicks="+clicks+";expires="+(new Date().getTime()-1);
    //document.cookie="clicks="+clicks+";expires="+(new Date().getTime()+24*60*60*1000);
}