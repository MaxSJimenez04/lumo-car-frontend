import { Outlet } from "react-router-dom";
import Header from "../components/dashboard/Header";
import { useEffect, useState } from "react"
import { eliminarToken, obtenerDatosToken } from '../utils/auth'
import { useNavigate } from "react-router-dom"


function MainLayout() {
    const [rolUsuario, setRol] = useState("")
    const [nombre, setNombre] = useState("")
    const [usuario, setUsuario] = useState("")
    const navigate = useNavigate();

    const logout = () => {
            eliminarToken();

            navigate("/login");
        };

    useEffect(() => {
        const respuesta = obtenerDatosToken()
        
        if (respuesta) {
            setRol(respuesta.role)
            setNombre(respuesta.fullName)
            setUsuario(respuesta.username)
        }
        
        document.body.classList.add("dashboard-body");
        return () => {
            document.body.classList.remove("dashboard-body");
        };
    },[])

    useEffect(() => {
    }, [rolUsuario]);
    return (
        <>
            <Header 
                rol={rolUsuario}
                nombre={nombre}
                usuario={usuario}
                logout={logout}
            />
            <Outlet />
        </>
    );
}

export default MainLayout;