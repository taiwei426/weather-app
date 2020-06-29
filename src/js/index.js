import {elements, loader} from './views/base'
import Weather from './models/Weather'
import GetDate from './models/GetDate'
import SearchLocation from './models/SearchLocation'
import GetLocation from './models/GetLocation'
import SaveLocation from './models/SaveLocation'
import * as locationsView from './views/locationsView'
import * as currentWeatherView from './views/currentWeatherView'
import * as weeklyWeatherView from './views/weeklyWeatherView'
import * as searchLocationView from './views/searchLocationView'
import * as dailyTempView from './views/dailyTempView'





const state = {}

////////////////
// GET LOCAL STORAGE

window.addEventListener('load', () => {
    console.log(state)
    // if saved locations in localStorage
    if(localStorage.savedLocations){
        
        state.savedLocations = new SaveLocation();
        
        // get localStorage
        state.savedLocations.locations = state.savedLocations.getLocalStorage();

        // show saved locations in UI
        locationsView.showLocations(state.savedLocations.locations)

        // set activeLocation
        state.activeLocation = new GetLocation(state.savedLocations.locations[0])

        // get weather of location
        weatherController(state.activeLocation)
    
    // else show search page
    } else {
        // searchLocationView.openSearchOverlay();
        document.querySelector(elements.rightContainer).classList.add('empty');

        document.querySelector(elements.weeklyTableContainer).classList.add('empty');
    }
   
    console.log(state);
});


////////////////
// LOCATION SEARCH

// open search overlay
document.querySelector(elements.addNewLocation).addEventListener('click', searchLocationView.openSearchOverlay)


// searching location
window.addEventListener('submit', async (event) => {
    event.preventDefault();

    loader('form')

    var query = document.querySelector(elements.locationSearch).value;
    
    state.locationSearch = new SearchLocation(query)
    
    // get location search results array
    await state.locationSearch.getLocation();

    document.querySelector('form .loader').remove();
    
    // show query results in UI
    searchLocationView.showLocationQueryResults(state.locationSearch.queryResults);
})


// closing search overlay
window.addEventListener('keydown', event =>{
    // if "escape" button
    if(event.keyCode === 27 && document.querySelector(elements.overlay).classList.contains('active')){
        searchLocationView.closeSearchOverlay();
    }
})
// closing search overlay by close button
document.querySelector(elements.overlayCloseButton).addEventListener('click', () => {
    if(document.querySelector(elements.overlay).classList.contains('active')){
        searchLocationView.closeSearchOverlay();
    }
})

// clicking on search item
document.querySelector(elements.locationSearchResultsContainer).addEventListener('click', async  (event) => {
    
    // index of clicked element
    var selectedLocationIndex = searchLocationView.selectFromLocationQuery(event);

    // close overlay
    searchLocationView.closeSearchOverlay();

    // update state.activeLocation
    state.activeLocation = new GetLocation(state.locationSearch.queryResults[selectedLocationIndex])

    await state.activeLocation.getLocationImg();
    console.log(state.activeLocation)

    // get weather of location
    await weatherController(state.activeLocation)
    
    // add to savedLocations data & UI
    addToSavedLocationsData();

    console.log(state)
})



//////////////////

// deleting or clicking on location cards
document.querySelector(elements.locationsHolder).addEventListener('click', event => {
    
    // get index of clicked location card    
    var location = event.target.closest('.location-item');

    var locationsArr = locationsView.getArrOfCards();

    var savedLocationsInd;
    if(location){
        savedLocationsInd = locationsArr.findIndex(el => {    
            return el === location
        })
    };
  
    // delete
    if(event.target.closest('.delete-location')){

        var deleteActiveCard = state.savedLocations.locations[savedLocationsInd].display_name === state.activeLocation.display_name

        deleteLocation(savedLocationsInd, deleteActiveCard);

    // show selected location card
    } else if(location){

        // show active card
        locationsView.clickingLocations(locationsArr[savedLocationsInd]);

        // update state.activeLocation
        state.activeLocation = new GetLocation(state.savedLocations.locations[savedLocationsInd]);


        // get weather of location
        weatherController(state.activeLocation)
    }

    console.log(state)
})

function deleteLocation(savedLocationsInd, deleteActiveCard){
    
    // if trying to delete currently active card, delete card & get new active card
    if(deleteActiveCard === true){

        // delete card & get new card index
        var nextActiveLocationInd = state.savedLocations.deleteLocation(savedLocationsInd);

        // if no more cards
        if(nextActiveLocationInd === -1){

            // update UI
            document.querySelector(elements.weeklyTable).innerHTML = '';
            currentWeatherView.clearCurrentWeather(); 
            document.querySelector(elements.tempChartHolder).style.display = 'none';

            // clear local storage
            state.savedLocations.clearLocalStorage();

            // add empty class
            document.querySelector(elements.rightContainer).classList.add('empty');
            document.querySelector(elements.weeklyTableContainer).classList.add('empty');

        // if there are still cards left        
        } else{

            // new activeLocation
            state.activeLocation = new GetLocation(state.savedLocations.locations[nextActiveLocationInd]);

            // get weather of new location
            weatherController(state.activeLocation)
            
            // update localStorage
            state.savedLocations.setLocalStorage();
        }
       

    // if trying to delete card that's currently not active, then just delete card. same active card
    } else if(deleteActiveCard === false){

        // delete card
        state.savedLocations.deleteLocation(savedLocationsInd);

        // update localStorage
        state.savedLocations.setLocalStorage();

    }    
            
    // update saved locations cards UI
    locationsView.deleteLocation(savedLocationsInd, nextActiveLocationInd)
}

//////////////////
// GET WEATHER

const weatherController = async (city) => {
   
    // if weekly or right containers were empty
    var weeklyTableContainer = document.querySelector(elements.weeklyTableContainer); 
    var rightContainer = document.querySelector(elements.rightContainer)
    if(weeklyTableContainer.classList.contains('empty') || rightContainer.classList.contains('empty')){
        weeklyTableContainer.classList.remove('empty');
        rightContainer.classList.remove('empty');
    }


    // prepare UI
    document.querySelector(elements.weeklyTable).innerHTML = '';
    currentWeatherView.clearCurrentWeather(); 
    document.querySelector(elements.tempChartHolder).style.display = 'none';


    // loader in UI
    loader(elements.weeklyTable);
    loader(elements.rightContainer);



    state.activeLocation.weather = new Weather();

    // get weather data from api
    await state.activeLocation.weather.getWeather(city.lat, city.lon);

    // get day of week
    await dateController(state.activeLocation.weather.weather.timezone);
    // STILL NEED THIS AWAIT
    

    // clear loader
    document.querySelector(elements.weeklyTable).innerHTML = '';
    document.querySelector('.right .loader').remove();


    // show current weather
    currentWeatherView.showCurrentWeather(
        state.activeLocation.weather.weather.currently, state.activeLocation.weather.weather.daily.data[0],
        state.activeLocation.time, 
        state.activeLocation.display_name
        )
    document.querySelector(elements.tempChartHolder).style.display = 'block';
    
    // show week's weather
    weeklyWeatherView.showWeekWeather(state.activeLocation.weather.weather.daily, state.activeLocation.time.day, state.activeLocation.time.usersDay)   
    
    // show next 48 hours temp graph
    state.dailyTempChart =  
    dailyTempView.createChart(state.activeLocation.weather.weather, state.dailyTempChart, state.activeLocation.time);
    // saved under new property instead of under activeLocation b/c need it to not disappear when clicking on another location
    // is it weird that this data is coming from view, not from model?
    console.log(state)

}

const dateController = async (timezone) => {
    state.activeLocation.time = new GetDate(timezone);
    await state.activeLocation.time.getDay();
}


const addToSavedLocationsData = () => {
    if (!state.savedLocations) {
        state.savedLocations = new SaveLocation();
    }
    
    var index = state.savedLocations.locations.findIndex(el => {
        return el.display_name === state.activeLocation.display_name
    }) 

    // if it's not already in the data, then add
    if (index === -1){
        // add to state/data
        state.savedLocations.saveLocation(state.activeLocation);

        // add to localStorage
        state.savedLocations.setLocalStorage();

        // add to UI
        var savedLocationsArr = state.savedLocations.locations;

        locationsView.addLocationCard(savedLocationsArr[savedLocationsArr.length - 1])
    }

}








//////////////////
//////////////////

// THINGS TO DO
// loader for UI
// then catch on axios
// searching "taiwei". has location, but can't find picture so won't load

// SAVED LOCATIONS
// ellipsis
// country, state


// WEEKLY FORECAST 
// icons need color
// take out vertical line


// SEARCH
// up/down arrow to go through results
// autofocus not working
// long search results list

// CURRENT WEATHER
// icons getting clipped
// add chance of precipitation 
// on graph, have date in hover

// OVERALL
// different screen sizes
// when hover, can see scroll

// THINGS LEARNED
// using several APIs
// should have a design first. it's difficult to design while writing JS and also figuring out where to put all the code and how to organize it
// might also be smart to actually think through how to organize the code before starting to type
// event listener is added to the window, not the element

// if i haven't created a new property, then i can't save more to that property. 
// ie: if i haven't created 'state.location' yet, then i can't automaticlaly create 'state.location.name'


// QUESTIONS
// is it possible to get the current temp without having to run everything
// do i save all the data that comes back from the api?
// do views and models have to match?
// how do i stop a click from executing. clicked bville, then clicked sf, but don't need bville to execute