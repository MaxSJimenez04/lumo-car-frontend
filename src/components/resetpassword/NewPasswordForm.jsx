import { useState } from "react"
import { restablecerContrasena } from "../../services/auth.service"
import { useNavigate } from "react-router-dom"

export default function NewPasswordForm({ usuario }) {
    const [contrasena, setContrasena] = useState("")
    const [confirmar, setConfirmar] = useState("")
    const [error, setError] = useState("")
    const [exito, setExito] = useState(false)
    const [cargando, setCargando] = useState(false)
    const navigate = useNavigate()

    const handleSubmit = async () => {
        setError("")

        if (contrasena.length < 8) {
            setError("La contraseña debe tener al menos 8 caracteres")
            return
        }
        if (contrasena !== confirmar) {
            setError("Las contraseñas no coinciden")
            return
        }

        setCargando(true)
        try {
            await restablecerContrasena(usuario, contrasena)
            setExito(true)
            setTimeout(() => navigate("/login"), 2500)
        } catch (err) {
            setError(err.response?.data?.mensaje || "Error al restablecer la contraseña")
        } finally {
            setCargando(false)
        }
    }

    if (exito) {
        return (
            <div className="info-card success-card">
                <h3>¡Contraseña restablecida correctamente!</h3>
                <p>Serás redirigido al inicio de sesión en un momento...</p>
            </div>
        )
    }

    return (
        <>
            <div className="info-card">
                <h3>Ingresa tu nueva contraseña</h3>
            </div>

            <div className="input-container">
                <input
                    type="password"
                    className="floating-input"
                    placeholder=" "
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    required
                />
                <label className="floating-label">Nueva contraseña</label>
            </div>

            <div className="input-container">
                <input
                    type="password"
                    className="floating-input"
                    placeholder=" "
                    value={confirmar}
                    onChange={(e) => setConfirmar(e.target.value)}
                    required
                />
                <label className="floating-label">Confirmar contraseña</label>
            </div>

            {error && <p className="form-error">{error}</p>}

            <button
                className="login-btn"
                onClick={handleSubmit}
                disabled={cargando}
            >
                {cargando ? "Guardando..." : "Restablecer contraseña"}
            </button>
        </>
    )
}