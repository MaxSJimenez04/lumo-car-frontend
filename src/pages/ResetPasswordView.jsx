import { useState } from "react"
import "../utils/style.css"
import GlassCard from "../components/login/GlassCard"
import CodeInput from "../components/resetpassword/CodeInput"
import NewPasswordForm from "../components/resetpassword/NewPasswordForm"
import { resetPassword } from "../services/auth.service"

const PASO_USUARIO = "usuario"
const PASO_CODIGO = "codigo"
const PASO_CONTRASENA = "contrasena"

export default function ResetPasswordView() {
    const [paso, setPaso] = useState(PASO_USUARIO)
    const [usuario, setUsuario] = useState("")
    const [error, setError] = useState("")
    const [cargando, setCargando] = useState(false)

    const titulos = {
        [PASO_USUARIO]: "Recuperar contraseña",
        [PASO_CODIGO]: "Verificar identidad",
        [PASO_CONTRASENA]: "Nueva contraseña",
    }

    const handleEnviarCodigo = async (e) => {
        e.preventDefault()
        if (!usuario.trim()) {
            setError("Ingresa tu nombre de usuario")
            return
        }
        setCargando(true)
        setError("")
        try {
            await resetPassword(usuario)
            setPaso(PASO_CODIGO)
        } catch (err) {
            setError(err.response?.data?.mensaje || "No se encontró el usuario o no tiene correo asociado")
        } finally {
            setCargando(false)
        }
    }

    return (
        <>
            <div className="background-overlay"></div>

            <div className="main-wrapper">
                <GlassCard title={titulos[paso]}>

                    {paso === PASO_USUARIO && (
                        <>
                            <div className="input-container">
                                <input
                                    type="text"
                                    className="floating-input"
                                    placeholder=" "
                                    value={usuario}
                                    onChange={(e) => setUsuario(e.target.value)}
                                    required
                                />
                                <label className="floating-label">
                                    Ingresa tu usuario
                                </label>
                            </div>

                            {error && <p className="form-error">{error}</p>}

                            <button
                                className="login-btn"
                                onClick={handleEnviarCodigo}
                                disabled={cargando}
                            >
                                {cargando ? "Enviando..." : "Enviar código de recuperación"}
                            </button>
                        </>
                    )}

                    {paso === PASO_CODIGO && (
                        <CodeInput
                            usuario={usuario}
                            onSuccess={() => setPaso(PASO_CONTRASENA)}
                        />
                    )}

                    {paso === PASO_CONTRASENA && (
                        <NewPasswordForm usuario={usuario} />
                    )}

                </GlassCard>
            </div>
        </>
    )
}
