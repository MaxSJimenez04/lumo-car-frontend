import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { consultarFoto } from "../../services/usuarios.service";

const AVATAR_DEFAULT = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Ccircle cx='12' cy='12' r='12' fill='%23e5e7eb'/%3E%3Cpath d='M12 13c2.5 0 4.5-2 4.5-4.5S14.5 4 12 4 7.5 6 7.5 8.5 9.5 13 12 13zm0 2c-3 0-9 1.5-9 4.5V21h18v-1.5c0-3-6-4.5-9-4.5z' fill='%239ca3af'/%3E%3C/svg%3E"

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
                    src={imagenPerfil || AVATAR_DEFAULT}
                    alt="Perfil"
                    className="header-avatar"
                    onError={(e) => { e.target.src = AVATAR_DEFAULT }}
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
