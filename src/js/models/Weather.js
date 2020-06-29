import axios from 'axios';

export default  class Weather{
    constructor(){
        
    }
    async getWeather(lat, lon){
        var darkSkiesToken = '65999f4db90663bd844c532c6ed259c3';

        var weather;

        await axios.get(`https://api.darksky.net/forecast/${darkSkiesToken}/${lat}, ${lon}`, {
            crossDomain: true // doesn't do anything
        }).then(response => {
            weather = response.data
        }).catch(err => 
            console.log(err)
        )
        this.weather= weather
        
    }
    
    getNext48Hours(){
        console.log(this.weather.hourly.data)
    }
}