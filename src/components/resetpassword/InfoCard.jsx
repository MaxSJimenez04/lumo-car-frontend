import { useEffect, useState } from "react"
import { resetPassword, verificar, restablecerContrasena } from "../../services/auth.service"
import { useNavigate } from "react-router-dom"

export default function InfoCard({
    usuario,
    children
}) 
{
    const navigate = useNavigate() //Se declara para navegar entre páginas
    const [error, setError] = useState("") 
    useEffect(() => {
        try {
            const response = resetPassword(usuario)
        } catch (err) {
            console.log(error)
            setError(
                error.response?.data?.mensaje || "Error al enviar el correo"
            )
        }
    })
    return (
        <>
            <div className="info-card">
                <h3>Se ha enviado un código de recuperación al correo asociado al usuario</h3>
            </div>
            {children}
            {
            error && (
                <p style={{color: "black"}}>{error}</p>
            )
            }
        </>
    )
}