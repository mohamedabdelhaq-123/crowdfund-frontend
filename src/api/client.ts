import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true,
});

// cookies are sent auto by browser no need to local storage
// backend sets cookies (access,refresh)
// every api call since withcred. is true so browser send cookies and backend reads cookies so auth the user
export default api;
