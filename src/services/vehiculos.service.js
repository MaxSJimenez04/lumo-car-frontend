import api from "../api/axiosClient"

const API_BASE_URL = "/vehiculos"

export const consultarColor = async function(idColor) {
    const respuesta = await api.get(API_BASE_URL + "/color", { params: { idColor } })
    return respuesta.data
}

export const consultarColores = async function() {
    const respuesta = await api.get(API_BASE_URL + "/colores")
    return respuesta.data
}

export const registrarColor = async function(datosColor) {
    const respuesta = await api.post(API_BASE_URL + "/colores/", datosColor)
    return respuesta.data
}

export const registrarVehiculo = async function(datosVehiculo) {
    const respuesta = await api.post(API_BASE_URL + "/", datosVehiculo)
    return respuesta.data
}

export const consultarPorSucursal = async function(idSucursal) {
    const respuesta = await api.get(API_BASE_URL + "/", { params: { idSucursal } })
    return respuesta.data
}

export const consultarVehiculo = async function(idVehiculo) {
    const respuesta = await api.get(API_BASE_URL + "/" + idVehiculo)
    return respuesta.data
}

export const eliminarVehiculo = async function(idVehiculo) {
    const respuesta = await api.delete(API_BASE_URL + "/" + idVehiculo)
    return respuesta.data
}

export const actualizarVehiculo = async function(datosVehiculo, idVehiculo) {
    const respuesta = await api.put(API_BASE_URL + "/" + idVehiculo, datosVehiculo)
    return respuesta.data
}

export const consultarFotoPrincipal = async function(idVehiculo) {
    const respuesta = await api.get(API_BASE_URL + "/" + idVehiculo + "/main-picture")
    return respuesta.data
}

export const consultarFotosSecundarias = async function(idVehiculo) {
    const respuesta = await api.get(API_BASE_URL + "/" + idVehiculo + "/secondary-pictures")
    return respuesta.data
}

export const asociarFotoPrincipal = async function(idVehiculo, idArchivo) {
    const respuesta = await api.put(API_BASE_URL + "/" + idVehiculo + "/foto-principal", { idArchivo })
    return respuesta.data
}

export const asociarFotoSecundaria = async function(idVehiculo, idArchivo) {
    const respuesta = await api.put(API_BASE_URL + "/" + idVehiculo + "/fotos-secundarias", { idArchivo })
    return respuesta.data
}