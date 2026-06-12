import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { consultarFoto } from "../../services/usuarios.service";

export default function UserMenu({ usuario, onLogout }) {

    const [open, setOpen] = useState(false);
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
        <div className="user-menu">
            <div className="profile-photo-wrapper">
                <img
                src={imagenPerfil}
                alt="Perfil"
                className="perfil-image"
                onClick={() => setOpen(!open)}
                />
            </div>
            

            {open && (
                <div className="dropdown">

                    <Link to="/perfil">
                        Mi Perfil
                    </Link>

                    <button onClick={onLogout}>
                        Cerrar Sesión
                    </button>

                </div>
            )}

        </div>
    );
}
