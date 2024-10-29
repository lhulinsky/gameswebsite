function getSchoolBellOffset(){
    var startDate=new Date("Aug 30, 2024 0:00:00")
    var millisecondsPassed=new Date().getTime()-startDate.getTime();
    const originalOffset=-4;
    const offsetPerDay=.365;
    return originalOffset+Math.floor(offsetPerDay*millisecondsPassed/(1000*60*60*24));
}