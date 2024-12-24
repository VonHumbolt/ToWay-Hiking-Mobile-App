import axios from "axios"
import {API_URL} from "@env"

export default class StartedRoutesService {
    
    apiUrl = API_URL + "startedRoutes/";

    startTracking(data, token) {
        return axios.post(this.apiUrl + "startTracking", data, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
    }

    updateTracking(data, token) {
        return axios.post(this.apiUrl + "updateTracking", data, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
    }
}