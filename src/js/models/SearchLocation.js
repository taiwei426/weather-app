import axios from 'axios';

var locationIQToken = '90d237fda6b9cc'

export default  class SearchLocation{
    constructor(query) {
        this.query = query
    }
    async getLocation(){
        var query = await axios(`https://us1.locationiq.com/v1/search.php?key=${locationIQToken}&q=${this.query}&format=json`)
        this.queryResults = query.data
    }
}

