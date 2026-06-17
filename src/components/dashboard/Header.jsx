import { Link, useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";
import NotificacionesPanel from "./NotificacionesPanel";

export default function Header({rol, nombre, usuario, idUsuario, logout}){
    const location = useLocation();

    // Estructura de menús por rol (se simplifican los menús removiendo desplegables y opciones extra)
    const menus = {
        Cliente: [
            { texto: "Inicio", ruta: "/dashboard" },
            { texto: "Sucursales", ruta: "/sucursales" },
            { texto: "Vehículos", ruta: "/vehiculos" },
            { texto: "Historial", ruta: "/historial" }
        ],

        Administrador: [
            { texto: "Inicio", ruta: "/dashboard" },
            { texto: "Vehículos", ruta: "/vehiculos" }
        ],

        S_Administrador: [
            { texto: "Inicio", ruta: "/dashboard" },
            { texto: "Estadisticas", ruta: "/" },
            { texto: "Vehículos", ruta: "/vehiculos" },
            { texto: "Empleados", ruta: "/empleados" }
        ]
    };

    const isActive = (ruta) => {
        return location.pathname === ruta;
    };

    return (
        <header className="app-header">
            <Link to="/dashboard" className="logo-link">
                <h1 className="lumo-header-logo">LUMO</h1>
            </Link>
            
            <nav className="header-nav">
                {menus[rol]?.map((opcion) => (
                    <Link
                        key={opcion.ruta}
                        to={opcion.ruta}
                        className={`nav-link ${isActive(opcion.ruta) ? 'active' : ''}`}
                    >
                        {opcion.texto}
                    </Link>
                ))}
            </nav>

            <div className="header-right">
                <NotificacionesPanel idUsuario={idUsuario} />
                <UserMenu
                    usuario={usuario}
                    nombre={nombre}
                    rol={rol}
                    onLogout={logout}
                />
            </div>
        </header>
    );
}