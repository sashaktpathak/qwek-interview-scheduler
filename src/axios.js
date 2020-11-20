import axios from 'axios';

const instance = axios.create({
    baseURL: "http://13.234.231.225:1337/"
    // baseURL: "http://127.0.0.1:1337/"
});

export default instance;