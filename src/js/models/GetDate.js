// import moment from 'moment-timezone'
import axios from 'axios'

export default class GetDate{
    constructor(timezone){
        this.timezone = timezone
    }
    // getDate(){
    //     let newDate = new Date(utc + (3600000* offset));
    // }
    async getDay(){
        var usersDay = new Date();
        this.usersDay  = usersDay.getDay();
        
        var day = await axios(`https://cors-anywhere.herokuapp.com/http://worldtimeapi.org/api/timezone/${this.timezone}`)
        
        this.day = day.data.day_of_week;
        this.date = day.data.datetime;
        
    }
}
