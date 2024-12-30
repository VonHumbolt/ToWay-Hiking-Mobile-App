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
}
