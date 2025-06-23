import axios from "axios";

const api = axios.create({
  baseURL: "https://collaborative-candidate-notes.onrender.com/api",
  withCredentials: true,
});

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers["authorization"] = token;
//   return config;
// });

export default api;
