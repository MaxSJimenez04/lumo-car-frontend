import api from "../api/axiosClient"

const API_BASE_URL = "/estadisticas"

export const obtenerEstadisticasRentas = async function() {
    const respuesta = await api.get(API_BASE_URL+"/rentas")

    return respuesta.data
}

export const obtenerEstadisticasSuscripciones = async function() {
    const respuesta = await api.get(API_BASE_URL+"/suscripciones")

    return respuesta.data
}

export const obtenerEstadisticasUsuarios = async function() {
    const respuesta = await api.get(API_BASE_URL+"/usuarios")

    return respuesta.data
}
export const obtenerEstadisticasVehiculos = async function() {
    const respuesta = await api.get(API_BASE_URL+"/uso-vehiculos")

    return respuesta.data
}
export const obtenerEstadisticasIngresos = async function() {
    const respuesta = await api.get(API_BASE_URL+"/ingresos")

    return respuesta.data
}