import api from "../api/axiosClient"

const API_BASE_URL = "/tarjetas"

export const obtenerTarjetas = async function() {
    const respuesta = await api.get(API_BASE_URL + "/")
    return respuesta.data.tarjetas ?? respuesta.data
}

export const agregarTarjeta = async function(datosTarjeta) {
    const respuesta = await api.post(API_BASE_URL + "/", datosTarjeta)
    return respuesta.data
}
