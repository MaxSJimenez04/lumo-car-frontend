import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { consultarFoto } from "../../services/usuarios.service";

export default function UserMenu({ usuario, nombre, rol, onLogout }) {

    const [imagenPerfil, setFoto] = useState(null)

    useEffect(() => {

        if (!usuario) return;

        const cargarFoto = async () => {
            try {
                const respuestaFoto = await consultarFoto(usuario);

                const imagenURL = URL.createObjectURL(respuestaFoto);

                setFoto(imagenURL);
            } catch (error) {
                console.error(error);
            }
        };

        cargarFoto();

    }, [usuario]);

    return (
        <div className="header-user-menu">
            <span className="header-username">Hola, {nombre || usuario}</span>
            <div className="header-avatar-wrapper">
                <img
                    src={imagenPerfil || "https://via.placeholder.com/150"}
                    alt="Perfil"
                    className="header-avatar"
                />
            </div>
            <span className="dropdown-arrow">▼</span>

            <div className="header-dropdown-menu">
                <Link to="/perfil">
                    Mi cuenta
                </Link>

                {rol === "Cliente" && (
                    <>
                        <Link to="/">
                            Historial
                        </Link>

                        <Link to="/">
                            Suscripciones
                        </Link>
                    </>
                )}

                <button onClick={onLogout}>
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
}
