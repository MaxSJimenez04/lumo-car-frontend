import api from "../api/axiosClient"

const API_BASE_URL = "/usuarios"

export const registro = async function(datosUsuario) {
    const respuesta = await api.post(API_BASE_URL+"/", datosUsuario) //Si se colocan los datos en un objeto, se manda el objeto sin llaves
    //Para que no se reciba un objeto en el req.body

    return respuesta.data
}

