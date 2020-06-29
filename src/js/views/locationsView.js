import {elements, shortenLocationName} from './base'

// render location card
const renderLocationCard = (location) => {

    var html = `
        <div class="location-item active" >
            <div class="delete-location">
                <svg id="trash">
                    <use href="img/_svgs.svg#trash"></use>
                </svg>
            </div>
            <div class="image-holder" style="background-image: url('${location.photo}')"></div>
            <div class="location-info">
                <div class="location-name">
                    ${shortenLocationName(location.display_name)}
                </div>
            </div>
        </div>
    `
    document.querySelector(elements.locationsHolder).insertAdjacentHTML('beforeend', html);
}


const removeActiveClass = () => {
    var locationsArr = getArrOfCards()

    locationsArr.forEach(el => {
        el.classList.remove('active');
    })
}

export const getArrOfCards = () => {
    return Array.from(document.querySelectorAll(elements.locationCards)) 
}

// upon load, show cards of saved locations
export const showLocations = (locations) => {
    locations.forEach( (el) => {
        console.log(el)
        renderLocationCard(el)
    });

    removeActiveClass();

    var locationsArr = getArrOfCards();
    
    locationsArr[0].classList.add('active');

    calcLocationContainerWidth();
}

//  show active card when clicking
export const clickingLocations = (location) => {
    
    // remove/add '.active' class
    removeActiveClass(location)
    location.classList.add('active');
    
}

// adding 1 location card
export const addLocationCard = (location) => {
    
    removeActiveClass();

    renderLocationCard(location);

    calcLocationContainerWidth();

    var locationsArr = getArrOfCards();
    locationsArr[locationsArr.length-1].classList.add('active');
}


export const deleteLocation = (oldIndex, newIndex = -1) => {
    var locationsArr = getArrOfCards();

    locationsArr[oldIndex].parentNode.removeChild(locationsArr[oldIndex]);

    calcLocationContainerWidth();

    if(newIndex !== -1){
        var newLocationsArr = getArrOfCards();
    
        newLocationsArr[newIndex].classList.add('active');
    }
}


// width of container-location
const calcLocationContainerWidth = () => {
    var locationsArr = getArrOfCards();
    var width = (locationsArr.length * 12) + 14 + 4;

    document.querySelector(elements.locationsContainer).style.width = `${width}rem`

}
