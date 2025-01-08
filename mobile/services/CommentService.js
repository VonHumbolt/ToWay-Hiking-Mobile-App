import axios from "axios";
import { API_URL } from "@env";

export default class CommentService {
  apiUrl = API_URL + "comment/";

  addComment(formData, token) {
    return axios.post(this.apiUrl + "addComment", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${token}`,
      },
    });
  }

  getCommentsByRouteId(routeId, token) {
    return axios.get(this.apiUrl + "getCommentsByRouteId/" + routeId, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  }

  getCommentsThatIncludesImage(routeId, token) {
    return axios.get(this.apiUrl + "getIllustratedComments/" + routeId, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  }
 
  numberOfComments(routeId, token) {
    return axios.get(this.apiUrl + "numberOfComments/" + routeId, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  }
  
  numberOfIllustratedComments(routeId, token) {
    return axios.get(this.apiUrl + "numberOfIllustratedComments/" + routeId, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
  }

}
