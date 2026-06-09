import api from "../api/axiosClient"

const API_BASE_URL = "/archivos"

export const subirArchivo = async function(archivo){
    const respuesta = api.post("/", archivo)
}

