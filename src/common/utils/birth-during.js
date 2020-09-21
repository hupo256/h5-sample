const birth={}
birth.isLeapYear=(first,end)=>{
    let length=0;
    for (let i=first;i<=end;i++) {
      if ((i%4==0&&i%100!=0)||(i%400==0)){
        length++;  
      }
    }
    return length;
}

birth.isBaby=(birthDay)=>{
    let date=new Date();
    leapYear1=birth.isLeapYear(date.getFullYear()-18,date.getFullYear());//闰年个数 -18-now
    let during = 18*365*24*60*60*1000+(leapYear1*24*60*60*1000);

    let currentDate= new Date(date.getTime()-during);//当前日期-18周岁
    let birth=new Date(birthDay);//出生日期
    if(currentDate<=birth)return true; //小于18
}
birth.isPeople=(birthDay)=>{
    let date=new Date();
    leapYear1=birth.isLeapYear(date.getFullYear()-18,date.getFullYear());//闰年个数 -18-now
    leapYear2=birth.isLeapYear(date.getFullYear()-150,date.getFullYear()-18);//闰年个数 -150-18
    let duringEnd = 18*365*24*60*60*1000+(leapYear1*24*60*60*1000);
    let duringStart = 150*365*24*60*60*1000+(leapYear2*24*60*60*1000);
    let preDate= new Date(date.getTime()-duringStart);//当前日期-150周岁
    let nextDate= new Date(date.getTime()-duringEnd);//当前日期-18周岁

    let birth=new Date(birthDay);
    if(preDate<birth&&birth<=nextDate)return true;
}


export default {
    ...birth
}

  