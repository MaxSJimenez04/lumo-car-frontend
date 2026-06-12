import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";

export default function Header({rol, nombre, usuario, logout}){
    const menus = {
        Cliente: [
            {texto: "Inicio", ruta: "/dashboard"},
            {texto: "Mis viajes", ruta: "/"},
            {texto: "Vehículos", ruta: "/"}
        ],

        Administrador: [
            {texto: "Inicio", ruta:"/dashboard"},
            {texto: "Vehículos", ruta: "/"},
        ],

        S_Administrador:[
            {texto: "Inicio", ruta: "/dashboard"},
            {texto: "Estadisticas", ruta: "/"},
            {texto: "Vehículos", ruta: "/"},
            {texto: "Empleados", ruta: "/empleados"}
        ]
    }

    return(
        <header>
            <h1>LUMO CAR</h1>
            <nav>
                {menus[rol]?.map(opcion =>(
                    <Link
                        key={opcion.ruta}
                        to={opcion.ruta}
                    >
                        {opcion.texto}
                    </Link>

                    
                ))}
                
            </nav>
            <UserMenu
            usuario={usuario}
            onLogout={logout}>
                        
            </UserMenu>
            <h2>Hola {nombre}</h2>
        </header>
    )
}