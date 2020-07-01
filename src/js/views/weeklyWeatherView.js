import {elements, dayOfWeek, showTodayOrTmrw} from './base'

function showHighestWeekTemp (daily){
    
    // create array of week's high temperatures
    var weekTemp = []
    daily.data.forEach(el => {
        weekTemp.push(el.temperatureHigh)
    })

    // find highest within week's array
    var highestTemp = Math.max(...weekTemp);

    // find the width % for each temp
    var percTemp = []
    weekTemp.forEach(el => {
        percTemp.push( Math.round(el / (highestTemp) * 100) )
    })

    return percTemp
}
 
function showLowestWeekTemp (daily){
    
    // create array of week's high temperatures
    var weekTemp = []
    daily.data.forEach(el => {
        weekTemp.push(el.temperatureLow)
    })

    // find highest within week's array
    var lowestTemp = Math.min(...weekTemp);

    // find the width % for each temp
    var percTemp = []
    weekTemp.forEach(el => {
        percTemp.push( Math.round( (lowestTemp - (el - lowestTemp) ) / (lowestTemp) * 100) )
    })

    return percTemp
}



export const showWeekWeather = (daily, day, localDay) => {
    
    var percHighTemp = showHighestWeekTemp(daily);
    var percLowTemp = showLowestWeekTemp(daily);

    // row for each day of week
    daily.data.forEach( (el, i) =>  {
        
        var html = `
            <li class="date-line">
                <div class="date">${i === 0 ? showTodayOrTmrw(day, localDay) : dayOfWeek(day, i)}</div>
                <div class="weather">
                    <svg id="${el.icon}">
                        <use href="img/svgs.svg#${el.icon}"></use>
                    </svg>
                    
                </div>
                <div class="precipitation">
                    <svg>
                        <use href="img/svgs.svg#raindrop"></use>
                    </svg>

                    ${Math.round(el.precipProbability * 100)}%
                </div>
                <div class="temp-low">${Math.round(el.temperatureLow)}°</div>
                <div class="temp-bar-container">
                    <div class="temp-low-bar-holder">
                        <div class="bar" style="width: ${percLowTemp[i]}%"></div>
                    </div>
                    <div class="temp-high-bar-holder">
                        <div class="bar" style="width: ${percHighTemp[i]}%"></div>
                    </div>    
                </div>
                <div class="temp-high">${Math.round(el.temperatureHigh)}°</div>
            </li>
        `
        document.querySelector(elements.weeklyTable).insertAdjacentHTML('beforeend', html)
    })
}
