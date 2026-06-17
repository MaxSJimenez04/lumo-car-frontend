import { Outlet } from "react-router-dom";
import Header from "../components/dashboard/Header";
import { useEffect, useState } from "react"
import { eliminarToken, obtenerDatosToken } from '../utils/auth'
import { useNavigate } from "react-router-dom"
import { consultarPerfil } from "../services/usuarios.service"


function MainLayout() {
    const [rolUsuario, setRol] = useState("")
    const [nombre, setNombre] = useState("")
    const [usuario, setUsuario] = useState("")
    const [idUsuario, setIdUsuario] = useState(null)
    const navigate = useNavigate();

    const logout = () => {
            eliminarToken();
            navigate("/login");
        };

    useEffect(() => {
        const respuesta = obtenerDatosToken()
        if (!respuesta) return

        setRol(respuesta.role)
        setNombre(respuesta.fullName)
        setUsuario(respuesta.username)

        // El token no incluye el UUID, lo obtenemos del perfil
        consultarPerfil(respuesta.username)
            .then((data) => {
                const id = data?.id ?? data?.usuario?.id
                setIdUsuario(id)
            })
            .catch(console.error)

        document.body.classList.add("dashboard-body");
        return () => {
            document.body.classList.remove("dashboard-body");
        };
    }, [])

    return (
        <>
            <Header
                rol={rolUsuario}
                nombre={nombre}
                usuario={usuario}
                idUsuario={idUsuario}
                logout={logout}
            />
            <Outlet />
        </>
    );
}

export default MainLayout;
