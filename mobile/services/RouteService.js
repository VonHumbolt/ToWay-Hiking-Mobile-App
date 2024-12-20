import axios from "axios"
import {API_URL} from "@env"

export default class RouteService {

    apiUrl = API_URL + "route/"

    getFiveRoutesWithCityName(cityName) {
        return axios.get(this.apiUrl + "getFiveRoutesWithCityName/" + cityName)
    }

    createRoute(formData){
        return axios.post(this.apiUrl + "create", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        })
    }
}