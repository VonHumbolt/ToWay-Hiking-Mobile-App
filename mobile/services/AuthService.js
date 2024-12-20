import axios from "axios"
import {API_URL} from "@env"

export default class AuthService {
    
    apiUrl = API_URL + "user/";

    register(data) {
        return axios.post(this.apiUrl + "register", data)
    }
}