import axios from "axios";
import { API_URL } from "@env";

export default class UserService {
  apiUrl = API_URL + "user/";

  getUserById(userId) {
    return axios.get(this.apiUrl + "getById/" + userId);
  }

  isRouteSaved(routeId, userId, token) {
    return axios.post(
      this.apiUrl + "isRouteSaved/" + routeId + "/" + userId,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }
  
  saveRouteForUser(routeId, userId, token) {
    return axios.post(
      this.apiUrl + "saveRoute/" + routeId + "/" + userId,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  removeRouteFromUserSavedRoutes(routeId, userId, token) {
    return axios.post(
      this.apiUrl + "removeRouteFromSaved/" + routeId + "/" + userId,
      null,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  getUserSavedRoutes(userId, token) {
    return axios.get(
      this.apiUrl + "getSavedRoutes/" + userId,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  }

  searchUsersByName(name) {
    return axios.get(this.apiUrl + "searchUserByName/" + name)
  }
}
