//debug
var solutionText=document.getElementById("solutionText");
var numbers=[2,3,4,9,25,120];
var target=906;
function findSolution(){
    for(var c=0;c<100;c++){
        var equation="";
        for(var i=0;i<numbers.length;i++){
            equation+=numbers[i];
            if(i<numbers.length-1){
                var index=Math.floor(Math.random()*5);
                equation+=["+","-","*","/"][index];
            }
        }
        if(eval(equation)==target){
            solutionText.innerHTML+=equation+"<br/>";
        }
    }
    requestAnimationFrame(findSolution);
}
requestAnimationFrame(findSolution);