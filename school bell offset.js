function getSchoolBellOffset(){
    var startDate=new Date("Jan 16, 2024 0:00:00")
    var millisecondsPassed=new Date().getTime()-startDate.getTime();
    const originalOffset=-4;
    const offsetPerDay=.28;
    return originalOffset+Math.floor(offsetPerDay*millisecondsPassed/(1000*60*60*24));
}