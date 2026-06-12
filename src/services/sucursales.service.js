import { data } from "react-router-dom";
import api from "../api/axiosClient";

const API_BASE_URL = "/sucursales"

export const registro = async function(datosSucursal) {
    const respuesta = await api.post(API_BASE_URL + "/", datosSucursal)
    return respuesta.data
}

export const consultarSucursales = async function(idCiudad) {
    const respuesta = await api.get(API_BASE_URL + "/", {params:{idCiudad: idCiudad}})
    return respuesta.data
}

export const consultarCiudades = async function(idEstado) {
    const respuesta = await api.get(API_BASE_URL + "/ciudades", {params:{idEstado: idEstado}})
    return respuesta.data
}

export const consultarEstados = async function() {
    const respuesta = await api.get(API_BASE_URL + "/estados")
    return respuesta.data
}

export const registrarCiudad = async function(datosSucursal) {
    const respuesta = await api.post(API_BASE_URL + "/ciudad", datosSucursal)
    return respuesta.data
}
 
