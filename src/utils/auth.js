import { jwtDecode } from "jwt-decode";

const TOKEN_KEY = "jwt";

export const guardarToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const obtenerToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

export const eliminarToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};

export const estaAutenticado = () => {
    return !!obtenerToken();
};

export const obtenerDatosToken = () => {

    const token = obtenerToken();

    if (!token)
        return null;

    try {

        const decoded = jwtDecode(token);
        
        return {
            username:
                decoded.unique_name ||
                decoded.name ||
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],

            fullName:
                decoded.given_name ||
                decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname"],

            role:
                decoded.role ||
                decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
        };

    } catch {

        return null;
    }
};

export const esAdmin = () => {
    const user = obtenerDatosToken();

    return user?.role === "Administrador";
};

export const esSuperAdmin = () => {
    const user = obtenerDatosToken();

    return user?.role === "S_Administrador";
};

export const esCliente = () => {
    const user = obtenerDatosToken();

    return user?.role === "Cliente";
};

export const obtenerUsuario = () => {
    const user = obtenerDatosToken();
    return user?.username
}