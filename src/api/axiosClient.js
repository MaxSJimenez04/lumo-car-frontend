import axios from 'axios'

console.log(import.meta.env.VITE_URL_API)
const api = axios.create({
    baseURL: import.meta.env.VITE_URL_API //API BASE
})

api.interceptors.request.use((config) =>{
    const token = localStorage.getItem("jwt") //Se consulta si el token ya está en el LocalStorage

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    
    return config
})

api.interceptors.response.use((response) => {
    const newToken = response.data?.token

    if (newToken) {
        localStorage.setItem("jwt", newToken)
    }

    return response
})

export default api