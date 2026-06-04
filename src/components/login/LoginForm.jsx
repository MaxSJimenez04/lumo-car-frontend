import { useState } from "react";
import { login } from "../../services/auth.service";
import { guardarToken } from "../../utils/auth";

export default function LoginForm() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] =
        useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const response =
                await login(email, password);

            guardarToken(response.token);

            window.location.href =
                "/dashboard";

        } catch {

            alert(
                "Correo o contraseña incorrectos"
            );
        }
    };

    return (
        <form onSubmit={handleSubmit}>

            <div className="input-container">

                <input
                    type="text"
                    className="floating-input"
                    placeholder=" "
                    value={email}
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
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                    required
                />

                <label className="floating-label">
                    Contraseña
                </label>

                <button
                    type="button"
                    className="toggle-password"
                    onClick={() =>
                        setShowPassword(
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