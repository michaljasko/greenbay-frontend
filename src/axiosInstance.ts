import axios from "axios";
import settings from "./settings";

const axiosInstance = axios.create({
  baseURL: settings.baseApiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
