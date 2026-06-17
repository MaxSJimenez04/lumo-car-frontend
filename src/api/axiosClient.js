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

api.interceptors.response.use(
    (response) => {
        const newToken = response.data?.token
        if (newToken) localStorage.setItem("jwt", newToken)
        return response
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("jwt")
            window.location.replace("/login")
        }
        if (error.response?.status === 400) {
            console.error("400 Bad Request:", JSON.stringify(error.response.data, null, 2))
        }
        return Promise.reject(error)
    }
)

export default api