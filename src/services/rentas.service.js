import api from "../api/axiosClient"

const API_BASE_URL = "/rentas"

export const crearRenta = async function(datosRenta) {
    const respuesta = await api.post(API_BASE_URL+"/", datosRenta)

    return respuesta.data
}

export const obtenerHistorial = async function(idUsuario) {
    const respuesta = await api.get(API_BASE_URL + "/historial/" + idUsuario)
    return respuesta.data
}

export const finalizarRenta = async function(idRenta) {
    const respuesta = await api.put(API_BASE_URL + "/" + idRenta + "/finalizar")

    return respuesta.data
}

export const cancelarRenta = async function(idRenta) {
    const respuesta = await api.put(API_BASE_URL + "/" + idRenta + "/cancelar")

    return respuesta.data
}