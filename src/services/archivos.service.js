import api from "../api/axiosClient"
 
const API_BASE_URL = "/archivos"
 
export const subirFotoPerfil = async function(archivo) {
    const respuesta = await api.post(API_BASE_URL + "/usuarios", archivo)
    return respuesta.data
}
 
export const subirFotoVehiculo = async function(archivo) {
    const respuesta = await api.post(API_BASE_URL + "/vehiculos", archivo)
    return respuesta.data
}
 
export const eliminarArchivo = async function(id) {
    const respuesta = await api.delete(API_BASE_URL + "/" + id)
    return respuesta.data
}