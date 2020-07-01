import axios from 'axios'




export default class GetLocation{
    // constructor(location){
    //     this.location = location
    // }
    constructor(city){
        this.display_name = city.display_name
        this.lon = city.lon
        this.lat = city.lat
    }
    async getLocationImg(){
        
        var unsplashAccessKey = 'uD185sXiVWuc0EcFV6srj-0_K736r2f_iBTfeQDoKyY' ;

        var queryNameArr =  this.display_name.split(',')

        // var randomNum = Math.floor(Math.random() * 2)
        var query = queryNameArr[0]
    
        var photos = await axios.get(`https://cors-anywhere.herokuapp.com/https://api.unsplash.com/search/photos/?page=1&per_page=10&query=${query}&client_id=${unsplashAccessKey}`)
        
        this.photo = photos.data.results[0].urls.small;

        return this.photo;
    }
}