import { Link } from "react-router-dom";
import cocheFondo from "../utils/images/coche-fondo.png";
import comoFunciona from "../utils/images/como-funciona.png";
import "../utils/style.css";

export default function DashboardView(){
    
    return (
        <div className="dashboard-container">
            <div className="dashboard-title-wrapper">
                <h2 className="dashboard-slogan">Ilumina tu camino</h2>
            </div>

            <img 
                src={cocheFondo} 
                alt="Lumo car background" 
                className="dashboard-car-bg" 
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
    )
}