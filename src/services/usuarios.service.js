import api from "../api/axiosClient"

const API_BASE_URL = "/usuarios"

export const registro = async function(datosUsuario) {
    const respuesta = await api.post(API_BASE_URL+"/", datosUsuario) //Si se colocan los datos en un objeto, se manda el objeto sin llaves
    //Para que no se reciba un sólo objeto en el req.body

    return respuesta.data
}

export const consultarPerfil = async function(usuario) {
    const respuesta = await api.get(API_BASE_URL + "/" + usuario)
    return respuesta.data
}

export const actualizar = async function(datosActualizados, usuario) {
    const respuesta = await api.put(API_BASE_URL + "/" + usuario, datosActualizados)

    return respuesta.data
}

export const consultarFoto = async function(usuario) {
    const respuesta = await api.get(API_BASE_URL + "/" + usuario + "/pfp",
        {responseType: "blob"}
    )
    return respuesta.data
}

export const asociarFoto = async function(usuario, idArchivo) {
    const respuesta = await api.post(API_BASE_URL + "/" +  usuario + "/pfp/", {idArchivo})
    return respuesta.data
}

export const consultarEmpleados = async function(idSucursal = null) {

    const respuesta = await api.get(API_BASE_URL + "/", {
        params: idSucursal ? { idSucursal } : {}
    });

    return respuesta.data;
}

export const eliminar = async function(id) {
    const respuesta = await api.delete(API_BASE_URL + "/" + id)
    return respuesta.data
}

export const cambiarSucursal = async function(usuario, idSucursal) {
    const respuesta = await api.put(API_BASE_URL + "/" + usuario + "/admin-sucursal", {idSucursal})
    return respuesta.data
}
