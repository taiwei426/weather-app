import {elements, dayOfWeek, shortenLocationName, getReadableTime, showTodayOrTmrw} from './base'

function showLocationDate(time, locationName){
    
    // show location
    var location = shortenLocationName(locationName);

    document.querySelector(elements.bigLocation).innerHTML = location

    // show date
    var day = dayOfWeek(parseInt(time.day), 0, true);

    var date = time.date.substring(0, 10)
    
    var dateArr = date.split('-');
    
    var html = `
        <div class="today">${showTodayOrTmrw(time.day, time.usersDay)}</div>
        <div class="date">${day} | ${dateArr[1]}.${dateArr[2]}</div>
    `
    document.querySelector(elements.currentDate).insertAdjacentHTML('beforeend', html)
}

function showPrimaryWeather (current) {
    current.summary = current.summary.replace(' and', ',');

    var html = `
        <div class="temperature-holder">
            <div class="current-temperature">${Math.round(current.temperature)}</div><em>°</em>
        </div>
        <div class="temperature-right-holder">

            <svg id="weather-icon">
                <use href="img/_svgs.svg#${current.icon}"></use>
            </svg>
        
            <div class = "weather-description">${current.summary}</div>
            <div class = "temp-interval">
            </div>
        </div>
    `
    document.querySelector(elements.primaryWeatherHolder).insertAdjacentHTML('beforeend', html);
}

function prettifyTime(time, timezone){
    var prettyTime = getReadableTime(time, timezone, false);
    
    prettyTime = prettyTime.substring(11, 16); 
    
    var prettyTimeArr = prettyTime.split(':');
    if(parseInt(prettyTimeArr[0]) > 13){
        var hour = parseInt(prettyTimeArr[0]) - 12;
        if(hour < 10){
            hour = `0${hour}`
        }
        prettyTimeArr[0] = hour
    }
    return `${prettyTimeArr[0]}:${prettyTimeArr[1]}`
}

function showSecondaryWeather (current, daily, time){
    var html = `
        <div class="column">
            <div class="secondary-info"><span>${Math.round(daily.temperatureHigh)}°</span> High</div>
            <div class="secondary-info"><span>${Math.round(daily.temperatureLow)}°</span> Low</div>
        </div>
        <div class="column">
            <div class="secondary-info"><span>${prettifyTime(daily.sunriseTime, time.timezone)} AM</span> Sunrise</div>
            <div class="secondary-info"><span>${prettifyTime(daily.sunsetTime, time.timezone)} PM</span> Sunset</div>
        </div>
        <div class="column">
            <div class="secondary-info"><span>${Math.round(current.humidity * 100)}%</span> Humidity</div>
            <div class="secondary-info"><span>${Math.round(current.windSpeed )}mph</span> Wind </div>
        </div>
    `
    document.querySelector(elements.secondaryWeatherHolder).insertAdjacentHTML('beforeend', html);
}

export const showCurrentWeather = (current, daily, time, locationName) => {
    
    showLocationDate(time, locationName);
    showPrimaryWeather(current, daily);
    showSecondaryWeather (current, daily, time);
    
}


export const clearCurrentWeather = () => {
    document.querySelector(elements.bigLocation).innerHTML = '';
    document.querySelector(elements.currentDate).innerHTML = '';
    document.querySelector(elements.primaryWeatherHolder).innerHTML = '';  
    document.querySelector(elements.secondaryWeatherHolder).innerHTML = '';
}






// clear-day, clear-night, rain, snow, sleet, wind, fog, cloudy, partly-cloudy-day, or partly-cloudy-night. (Developers should ensure that a sensible default is defined, as additional values, such as hail, thunderstorm, or tornado