import api from "../api/axiosClient"

const API_BASE_URL = "/marcas"

export const consultarMarcas = async function() {
    const respuesta = await api.get(API_BASE_URL + "/")
    return respuesta.data
}