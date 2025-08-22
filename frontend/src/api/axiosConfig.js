import axios from 'axios';

const axiosConfig = axios.create({
  baseURL: process.env.REACT_APP_BASE_API_URL || 'http://localhost:5000/api',
  withCredentials: true, // allow sending cookies
});

export default axiosConfig;
