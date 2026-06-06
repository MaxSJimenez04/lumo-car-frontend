import { useState } from "react";
import { login } from "../../services/auth.service";
import { guardarToken } from "../../utils/auth";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
    const navigate = useNavigate()
    const [usuario, setUsuario] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [showPassword, setMostrarContrasena] =
        useState(false);
    const [error, setError] = useState("")

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response =
                await login(usuario, contrasena);

            guardarToken(response.token);

            navigate("/login")
        } catch(err) {
            console.log(err);
            
            setError(
                err.response?.data?.mensaje || "Usuario o contraseña incorrectos" //Muestra el mensaje de la API
            )
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <div className="input-container">

                <input
                    type="text"
                    className="floating-input"
                    placeholder=" "
                    value={usuario}
                    onChange={(e) =>
                        setUsuario(
                            e.target.value
                        )
                    }
                    required
                />

                <label className="floating-label">
                    Usuario
                </label>

            </div>

            <div className="input-container">

                <input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    className="floating-input"
                    placeholder=" "
                    value={contrasena}
                    onChange={(e) =>
                        setContrasena(
                            e.target.value
                        )
                    }
                    required
                />

                <label className="floating-label">
                    Contraseña
                </label>

               {
                error && (
                    <p style={{color:"white"}}>{error}</p>
                )
               } 
                <button
                    type="button"
                    className="toggle-password"
                    onClick={() =>
                        setMostrarContrasena(
                            !showPassword
                        )
                    }
                >
                    👁
                </button>

            </div>

            <button
                type="submit"
                className="login-btn"
            >
                Iniciar sesión
            </button>

            <div className="forgot-pwd">
                <a href="#">
                    ¿Olvidaste la contraseña?
                </a>
            </div>

            <div className="divider">
                <span>O</span>
            </div>

            <div className="signup-link">
                <p>
                    ¿No tienes una cuenta?
                    {" "}
                    <a href="#">
                        Regístrate
                    </a>
                </p>
            </div>

        </form>
    );
}