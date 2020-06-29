import moment from 'moment-timezone'

export const elements = {
    wrapper: '.wrapper',
    overlay: '.overlay',
    overlayCloseButton: '.overlay-close-button',
    rightContainer: '.right',
    currentTemp : '.current-temperature',
    weeklyTableContainer: '.weekly-container',
    weeklyTable : '.weekly-table',
    currentDate: '.date-holder',
    primaryWeatherHolder : '.important-weather-container', 
    secondaryWeatherHolder: '.secondary-weather-container',
    tempChartHolder: '.temp-chart-holder',
    locationsContainer: '.location-container',
    locationsHolder: '.location-holder',
    deleteLocation: '.delete-location',
    bigLocation: '.big-location',
    locationName: '.location-name', 
    locationCards: '.location-item',
    locationSearch: '.location-search',
    locationSearchResultsContainer: '.location-search-results-container',
    addNewLocation: '.add-new-location',
}


export const dayOfWeek = (day, i=0, shorten=false) => {

    var date = day + i;
    
    // if date > 7, then start over in counting
    date > 6  ? date = date - 7 :  date = date
    
    var days;
    if(shorten===true){
        days = ['Sun', 'Mon', 'Tues', 'Wednesday', 'Thurs', 'Fri', 'Sat']
    } else{
        days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    }
    
    
    return days[date];
}


export function showTodayOrTmrw(day, localDay){
    if(day === localDay){
        return 'Today'
    } else {
        return 'Tomorrow'
    }
}

export function shortenLocationName(name){
    var nameArr = name.split(',');
    return nameArr[0]
}


export function getReadableTime(time, timezone, format){
    // var date = new Date(el.time)// returns date in 1970s

    // today's date
    var date = new Date( (time  * 1000)+ (3600000)); // returns current date/year of timezone i'm in

    // format time
    var momentDate = moment(date);
    if(format === true){
        momentDate = momentDate.tz(timezone).format('ha'); 
    } else if(format === false){
        momentDate = momentDate.tz(timezone).format(); 
    }
    return momentDate;
}



export const loader = (insertLoaderHere) => {
    var html = `
        <div class="loader"></div>
    `
    document.querySelector(insertLoaderHere).insertAdjacentHTML('afterBegin', html)
}