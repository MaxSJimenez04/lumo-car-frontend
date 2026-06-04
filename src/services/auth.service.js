import api from '../api/axiosClient'

const API_URL_BASE = "auth" //Aquí va la siguente palabra después del primer / en la liga de la API, si es auth, vehiculos, usuarios,etc.

//Este es un método de la API
export const login = async(usuario, contrasena) =>{
    const respuesta = await api.post( //Se ocupa el mismométodo HTTP que en la API
        API_URL_BASE + "/login", //La URL exacta que va a consumir
        {
            usuario, //Los parámetros (el body)
            contrasena
        }
    )

    return respuesta.data //Regresa el estado y el JSON de la consulta si hay
}



