import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { obtenerDatosToken } from "../utils/auth";
import cocheFondo from "../utils/images/coche-fondo.png";
import comoFunciona from "../utils/images/como-funciona.png";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import "../utils/style.css";

export default function DashboardView(){
    const [rolUsuario, setRolUsuario] = useState("");
    const [nombreUsuario, setNombreUsuario] = useState("");

    useEffect(() => {
        const datos = obtenerDatosToken();
        if (datos) {
            setRolUsuario(datos.role);
            setNombreUsuario(datos.fullName || datos.username);
        }
    }, []);

    // Si el usuario es Administrador o Súper Administrador, mostramos el panel de control administrativo
    if (rolUsuario === "Administrador" || rolUsuario === "S_Administrador") {
        return <AdminDashboard nombre={nombreUsuario} />;
    }
    
    // Si no (es Cliente), mostramos la página de inicio del cliente
    return (
        <div className="dashboard-container">
            <div className="dashboard-title-wrapper">
                <h2 className="dashboard-slogan">Ilumina tu camino</h2>
            </div>

            <img 
                src={cocheFondo} 
                alt="Lumo car background" 
                className="dashboard-car-bg" 
                style={{ zIndex: 1 }}
            />

            <div className="dashboard-bottom-section">
                <div className="dashboard-left-card">
                    <img 
                        src={comoFunciona} 
                        alt="Cómo funciona Lumo" 
                        className="dashboard-left-card-img" 
                    />
                </div>

                <div className="dashboard-center-text-box">
                    <p className="dashboard-center-desc">
                        Sin llaves. Sin complicaciones. Acceso instantáneo a la movilidad eléctrica. Reserva ahora tu coche, ábrelo con tu móvil y disfruta.
                    </p>
                </div>

                <Link to="/vehiculos" className="dashboard-reservar-link">
                    <button className="dashboard-reservar-btn">
                        Reservar
                    </button>
                </Link>
            </div>
        </div>
    );
}