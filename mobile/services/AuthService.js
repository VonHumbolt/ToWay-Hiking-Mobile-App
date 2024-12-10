import axios from "axios"

export default class AuthService {
    
    apiUrl = "http://192.168.1.206:5000/api/user/";

    register(data) {
        return axios.post(this.apiUrl + "register", data)
    }
}