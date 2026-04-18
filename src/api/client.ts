import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials:true,
});

api.interceptors.response.use( // middleware
  (response) => response, // pass if sucess
  async (error) => {
    const originalRequest = error.config;

    // to prevent inf. loop
    if (originalRequest.url?.includes('/auth/token/refresh/') || originalRequest._retry) {
      if (window.location.pathname !== '/login') {
        window.location.href = '/login?reason=session_expired'; // if not in login so go there
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      originalRequest._retry = true; //flag

      try {
        await api.post('/auth/token/refresh/'); // try to get new silently without user know anything
        return api(originalRequest);
      } catch (refreshError) {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login?reason=session_expired';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// cookies are sent auto by browser no need to local storage
// backend sets cookies (access,refresh)
// every api call since withcred. is true so browser send cookies and backend reads cookies so auth the user
export default api;
