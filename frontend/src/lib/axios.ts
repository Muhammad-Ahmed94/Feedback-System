import axios from "axios";


const axiosInst = axios.create({
    baseURL: "http://localhost:5000/api",
    withCredentials: true,
    timeout: 60000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default axiosInst;