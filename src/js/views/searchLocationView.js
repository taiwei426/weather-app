import {elements} from './base'

export const showLocationQueryResults = (queryResults) => {

    // prepare UI
    document.querySelector(elements.locationSearchResultsContainer).innerHTML = ''

    // loader



    // render each result
    queryResults.forEach(el => {
        var html = `
        <li class="location-query-item">${el.display_name}</li>
        `
        document.querySelector(elements.locationSearchResultsContainer).insertAdjacentHTML('beforeend', html)
    })
}




export const selectFromLocationQuery = (event) => {
    var selectedLocation = event.target.closest('.location-query-item');

    var locationQueryArr = Array.from(document.querySelectorAll('.location-query-item'));

    var index = locationQueryArr.findIndex(el => {
        return el === selectedLocation
    })
    return index
}

export const openSearchOverlay = () => {
    document.getElementById('location-search').focus();
    document.getElementById('location-search').autofocus = true;

    document.querySelector(elements.overlay).classList.add('active')

    
}

export const closeSearchOverlay = () => {
    // clear form
    document.querySelector(elements.locationSearch).value = ''

    // clear search results
    document.querySelector(elements.locationSearchResultsContainer).innerHTML = ''

    // hide overlay
    document.querySelector(elements.overlay).classList.remove('active')
}