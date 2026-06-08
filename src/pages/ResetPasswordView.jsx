import { useEffect, useState } from "react"
import "../utils/style.css"
import { obtenerUsuario } from "../utils/auth"
import InfoCard from "../components/resetpassword/InfoCard"
import GlassCard from "../components/login/GlassCard"
import { resetPassword } from "../services/auth.service"

export default function ResetPasswordView(){
    const [usuario, setUsuario] = useState("")
    const [error, setError] = useState("")
    const handleSubmit = async(e) => {
        e.preventDefault()

        try {
            console.log(usuario);
            
            const response = await resetPassword(usuario)
            console.log("CORREO ENVIADO");
            
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.mensaje || "Hubo un error al enviar el correo")
        }
    }
    return(
        <>
            <div className="background-overlay"></div>

            <div className="main-wrapper">
                <GlassCard 
                    title={"Recuperar Contraseña"}
                    >
                    <div className="input-container">

                        <input
                            type="text"
                            className="floating-input"
                            placeholder=" "
                            value={usuario} //La variable que se usa para obtener el valor del campo de texto
                            onChange={(e) => //Se parece a un txtCampo.value del JS normal
                                setUsuario(
                                    e.target.value
                                )
                            }
                            required
                        />

                        <label className="floating-label">
                            Ingresa tu usuario
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="login-btn"
                        >
                    Enviar código de recuperación
                    </button>
                </GlassCard>
            </div>
        </>
    )
}