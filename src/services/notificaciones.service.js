import api from "../api/axiosClient"

const API_BASE_URL = "/notificaciones"

export const obtenerNotificaciones = async function() {
    const respuesta = await api.get(`${API_BASE_URL}/`)
    const data = respuesta.data
    return Array.isArray(data) ? data : (data?.notificaciones ?? data?.$values ?? [])
}

export const marcarLeida = async function(idNotificacion) {
    const respuesta = await api.patch(`${API_BASE_URL}/${idNotificacion}/leida`)
    return respuesta.data
}

export const marcarTodasLeidas = async function() {
    const respuesta = await api.patch(`${API_BASE_URL}/leidas`)
    return respuesta.data
}
