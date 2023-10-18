function getSchoolBellOffset(){
    var startDate=new Date("August 24, 2023 0:00:00")
    var millisecondsPassed=new Date().getTime()-startDate.getTime();
    const originalOffset=38;
    const offsetPerDay=.25;
    return originalOffset+Math.floor(offsetPerDay*millisecondsPassed/(1000*60*60*24));
}