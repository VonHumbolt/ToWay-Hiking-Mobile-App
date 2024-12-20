import axios from "axios"
import {API_URL} from "@env"

export default class UserService {

    apiUrl = API_URL + "user/"

    getUserById(userId) {
        return axios.get(this.apiUrl + "getById/" + userId)
    }
}