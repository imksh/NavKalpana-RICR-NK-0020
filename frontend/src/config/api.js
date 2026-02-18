import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "https://maa-baglamukhi-mandir.onrender.com/api",
  withCredentials: true,
});

export default api;