export default class SaveLocation{
    constructor(){
        this.locations = []
    }
    saveLocation(location){
        console.log(location)

        var location = {
            display_name: location.display_name,
            lat: location.lat,
            lon: location.lon, 
            timezone: location.time.timezone,
            photo: location.photo
        }
        // push to array
        this.locations.push(location);

    }

    deleteLocation(locationInd){
        // delete location card
        this.locations.splice(locationInd,1);

        // get next location card
        if(this.locations[locationInd]){
            return locationInd
        } else if(this.locations[locationInd - 1]){
            return locationInd - 1
        } else{
            return -1
        }
    }

    setLocalStorage(){
        // save to localStorage
        localStorage.setItem('savedLocations', JSON.stringify(this.locations))
    }

    getLocalStorage(){
        return JSON.parse(localStorage.getItem('savedLocations'))
    }

    clearLocalStorage(){
        localStorage.removeItem('savedLocations')
    }
}