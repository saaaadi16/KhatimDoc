import axios from "axios";

// export const BASE_URL = "https://pki.codegic.com";
export const BASE_URL = "http://192.168.18.53:8082";

const Auth = (): string => {
  let temp2 = localStorage.getItem("AuthToken");
  return temp2 ? temp2 : "";
};
let OAuth = localStorage.getItem("AuthToken");
const Axios = axios.create({
  baseURL: `${BASE_URL}/kdoc/v1/`,
  headers: {
    Authorization: `Bearer ${OAuth ? OAuth : ""}`,
  },
});

export default Axios;
