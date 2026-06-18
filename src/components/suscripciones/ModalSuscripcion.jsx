import React, { useState } from "react"
import { suscripcionesService } from "../../services/suscripciones.service"

export default function ModalSuscripcion({ plan, onCerrar, onExito }) {
    const [cargando, setCargando] = useState(false)
    const [error, setError] = useState(null)

    const handleSuscribirse = async () => {
        setCargando(true)
        setError(null)
        try {
            await suscripcionesService.suscribirseAlPlan(plan.idSuscripcion || plan.id)
            if (onExito) onExito()
            onCerrar()
            alert("¡Suscripción realizada con éxito!")
        } catch (err) {
            setError("No se pudo procesar la suscripción. Intenta de nuevo.")
        } finally {
            setCargando(false)
        }
    }

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>Confirmar Suscripción</h2>
                <p style={styles.text}>¿Deseas suscribirte al plan <strong>{plan.nombre}</strong>?</p>
                
                {error && <p style={styles.error}>{error}</p>}

                <div style={styles.actions}>
                    <button style={styles.btnCancelar} onClick={onCerrar} disabled={cargando}>
                        Cancelar
                    </button>
                    <button style={styles.btnConfirmar} onClick={handleSuscribirse} disabled={cargando}>
                        {cargando ? "Procesando..." : "Confirmar Suscripción"}
                    </button>
                </div>
            </div>
        </div>
    )
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    modal: {
        background: "#fff",
        padding: "24px",
        borderRadius: 12,
        width: "90%",
        maxWidth: 400,
        boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
    },
    title: { margin: "0 0 16px 0", fontSize: 20 },
    text: { margin: "0 0 20px 0", color: "#4b5563" },
    error: { color: "#dc2626", marginBottom: 16, fontSize: 13 },
    actions: { display: "flex", gap: 10, justifyContent: "flex-end" },
    btnCancelar: { padding: "8px 16px", border: "1px solid #d1d5db", borderRadius: 6, cursor: "pointer" },
    btnConfirmar: { padding: "8px 16px", background: "#10b981", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }
}