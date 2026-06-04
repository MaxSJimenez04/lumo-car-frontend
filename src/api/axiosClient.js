import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_URL_API //API BASE
})

api.interceptors.request.use((config) =>{
    const token = localStorage.getItem("token") //Se consulta si el token ya está en el LocalStorage

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    console.log(baseURL);
    
    return config
})

export default api