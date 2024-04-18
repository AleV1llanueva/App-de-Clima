//Elementos HTML
let textHourAct = document.querySelector('.textHour');
let cloudy = document.querySelector('.cloudy');
let actualTemp = document.querySelector('.actualTemp');


//Variables internas
let tempDay;
let tempMaxDay;
let tempMinDay;
let cloudcoverDay;
let sunset;
let sunrise;
let rain;
let date = new Date();
let actualHour = date.getHours();
actualPost = actualHour-1;

const cloudTime = () => {
    if (cloudcoverDay[actualPost] < 50) return 'despejado';
    else if (cloudcoverDay[actualPost] >= 50) return 'parcialmente nublado';
}

const viewData = () => {
    textHourAct.innerHTML = `${actualHour}:00`;
    cloudy = cloudTime();
    actualTemp.innerHTML = tempDay[actualHour - 1] + '⁰C';
    for (let i = 1; i < 6; i++) {
      //No pasarse de las 24 horas
      if (actualHour+i > 24) break;
      //Horas Proximas
      document.querySelector(`.pt${i}`).innerHTML = `${actualHour+i}:00`
    }
    for (let i = 1; i < 6; i++) {
      if (actualHour+i > 24) break;
      //Proximas Temperaturas
      document.querySelector(`.pc${i}`).innerHTML = `${tempDay[actualHour+i-1]}⁰C`
    }
    console.log(tempDay);
}

const numberMonth = (num) => {
    if (num == 0) return 'Enero';
    else if (num == 1) return 'Febrero';
    else if (num == 2) return 'Marzo';
    else if (num == 3) return 'Abril';
    else if (num == 4) return 'Mayo';
    else if (num == 5) return 'Junio';
    else if (num == 6) return 'Julio';
    else if (num == 7) return 'Agosto';
    else if (num == 8) return 'Septiembre';
    else if (num == 9) return 'Octubre';
    else if (num == 10) return 'Noviembre';
    else if (num == 11) return 'Diciembre';
};

fetch("https://api.open-meteo.com/v1/forecast?latitude=13.96&longitude=-88.28&hourly=temperature_2m,rain,cloudcover,soil_temperature_0cm&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=America%2FDenver&past_days=1").then(response => response.json()).then(data => {
    let date = new Date();
    let horaActual = date.getHours();
    let fechaIsos = date.toISOString().slice(0, 11) + `${horaActual}:00`;
    let timePos = data.hourly.time;
    let actualPos;
    for (let i = 0; i < timePos.length; i++) {
        if (timePos[i] == fechaIsos) actualPos = i;
    }
    let posInitDay = actualPos - horaActual;
    let temps = data.hourly.temperature_2m;
    //Temperaturas de todo el día
    let allTempDay = temps.slice(posInitDay, posInitDay+24);
    tempDay = allTempDay;
    //Temperatura maxima
    maxTempDay = Math.max.apply(null, allTempDay);
    tempMaxDay = maxTempDay;
    //Temperatura minima
    minTempDay =  Math.min.apply(null, allTempDay);
    tempMinDay = minTempDay;
    //Amanecer
    sunrise = data.daily.sunrise[1].slice(11,17);
    //Atardecer
    sunset = data.daily.sunset[1].slice(11, 17);
    //nubosidad
    cloudcoverDay = data.hourly.cloudcover.slice(posInitDay, posInitDay+24);
    //Probabilidad de lluvia
    rain = data.hourly.rain.slice(posInitDay, posInitDay+24);
    console.log(data)
    viewData();
});
