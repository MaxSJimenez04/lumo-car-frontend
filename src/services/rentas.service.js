import api from "../api/axiosClient"

const API_BASE_URL = "/rentas"

export const calcularRenta = async function(datos) {
    const respuesta = await api.post(API_BASE_URL + "/calcular", datos)
    return respuesta.data
}

export const crearRenta = async function(datosRenta) {
    const respuesta = await api.post(API_BASE_URL+"/", datosRenta)

    return respuesta.data
}

export const obtenerHistorial = async function(idUsuario) {
    const respuesta = await api.get(API_BASE_URL + "/historial/" + idUsuario)
    const data = respuesta.data
    const arr = Array.isArray(data) ? data : (data?.datos ?? data?.$values ?? [])
    const seen = new Set()
    return arr.filter((r) => {
        if (seen.has(r.id)) return false
        seen.add(r.id)
        return true
    })
}

export const finalizarRenta = async function(idRenta) {
    const respuesta = await api.put(API_BASE_URL + "/" + idRenta + "/finalizar")

    return respuesta.data
}

export const cancelarRenta = async function(idRenta) {
    const respuesta = await api.put(API_BASE_URL + "/" + idRenta + "/cancelar")

    return respuesta.data
}