import axios from "axios"
import {API_URL} from "@env"

export default class CountryService {
    
    apiUrl = API_URL + "country/";

    getallCountries() {
        return axios.get(this.apiUrl + "getall")
    }
   
    getCitiesByCountryName(countryName) {
        return axios.get(this.apiUrl + "getCitiesByCountry/" + countryName)
    }
}