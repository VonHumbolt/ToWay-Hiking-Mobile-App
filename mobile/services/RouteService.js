import axios from "axios";
import { API_URL } from "@env";

export default class RouteService {
  apiUrl = API_URL + "route/";

  getFiveRoutesWithCityName(cityName) {
    return axios.get(this.apiUrl + "getFiveRoutesWithCityName/" + cityName);
  }

  createRoute(formData, token) {
    return axios.post(this.apiUrl + "create", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
    });
  }
  
  addPointToRoute(formData, token) {
    return axios.post(this.apiUrl + "addPointToRoute", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
    });
  }

  searchRoutesByCityName(cityName) {
    return axios.get(this.apiUrl + "searchRoutesByCity/" + cityName)
  }
  
  getPopularRoutes() {
    return axios.get(this.apiUrl + "getRoutesByNumberOfCompletions")
  }
}
