import api from "../api/axiosClient"

const API_BASE_URL = "/notificaciones"

export const obtenerNotificaciones = async function(idUsuario) {
    const respuesta = await api.get(`${API_BASE_URL}/${idUsuario}`)
    return respuesta.data
}

export const marcarLeida = async function(idNotificacion) {
    const respuesta = await api.put(`${API_BASE_URL}/${idNotificacion}/leida`)
    return respuesta.data
}

export const marcarTodasLeidas = async function(idUsuario) {
    const respuesta = await api.put(`${API_BASE_URL}/${idUsuario}/leidas`)
    return respuesta.data
}
