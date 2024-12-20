import axios from "axios"
import {GEONAME_USERNAME} from "@env"

export default class GeoNameService {
    
    apiUrl = "http://api.geonames.org/countryCodeJSON?"

    getCountryFromCoordinate(latitude, longitude) {
        return axios.post(this.apiUrl + "lat="+ latitude + "&lng=" + longitude + "&username=" + GEONAME_USERNAME)
    }
}