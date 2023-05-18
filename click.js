console.log(document.cookie);
function click(){
    document.cookie="clicks=1;expires="+(new Date().getTime()+24*60*60*1000);
}
