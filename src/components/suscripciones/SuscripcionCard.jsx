import React from "react"
import { suscripcionesService } from "../../services/suscripciones.service"

export default function SuscripcionCard({ plan, onConsultar, esMiPlan }) {
    
    const handleCancelar = async () => {
        if (window.confirm("¿Estás seguro de que deseas cancelar tu suscripción?")) {
            try {
                await suscripcionesService.cancelarPlan();
                alert("Suscripción cancelada exitosamente.");
                window.location.reload();
            } catch (error) {
                alert("No se pudo cancelar la suscripción.");
            }
        }
    };

    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <h3 style={styles.title}>{plan.nombre}</h3>
                <p style={styles.price}>${plan.precio} <span style={styles.period}>/ mes</span></p>
            </div>
            
            <div style={styles.body}>
                <p style={styles.description}>{plan.descripcion || 'Sin descripción disponible.'}</p>
                <ul style={styles.list}>
                    <li style={styles.listItem}>✓ Máximo {plan.limiteVehiculos} vehículos</li>
                    <li style={styles.listItem}>✓ {plan.descuentoRenta}% descuento en rentas</li>
                </ul>
            </div>

            <div style={styles.footer}>
                {esMiPlan ? (
                    <>
                        <button 
                            style={{ ...styles.btnAccion, background: "#9ca3af", cursor: "not-allowed" }} 
                            disabled
                        >
                            ✓ Tu plan actual
                        </button>
                        <button 
                            onClick={handleCancelar}
                            style={styles.btnCancelar}
                        >
                            Cancelar suscripción
                        </button>
                    </>
                ) : (
                    <button 
                        style={styles.btnAccion} 
                        onClick={() => onConsultar(plan)}
                    >
                        Ver detalles
                    </button>
                )}
            </div>
        </div>
    )
}

const styles = {
    card: {
        background: "#fff",
        border: "none", 
        borderTop: "5px solid #10b981",
        borderRadius: "16px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
    },
    header: {
        padding: "24px 20px 10px 20px",
        background: "#fff",
        textAlign: "center"
    },
    title: {
        margin: "0 0 12px 0",
        fontSize: 20,
        fontWeight: 800,
        color: "#1f2937",
    },
    price: {
        margin: 0,
        fontSize: 32,
        fontWeight: 900,
        color: "#10b981", 
    },
    period: {
        fontSize: 14,
        fontWeight: 600,
        color: "#9ca3af",
    },
    body: {
        padding: "0 24px 24px 24px",
        flex: 1,
    },
    description: {
        margin: "0 0 20px 0",
        fontSize: 14,
        color: "#4b5563",
        lineHeight: 1.6,
        textAlign: "center"
    },
    list: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        fontSize: 13,
        color: "#374151",
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    listItem: {
        display: "flex",
        alignItems: "center",
        fontWeight: 500,
    },
    footer: {
        padding: "20px 24px",
        background: "#f9fafb",
        borderTop: "1px solid #f3f4f6",
        display: "flex",
        flexDirection: "column",
        gap: "10px"
    },
    btnAccion: {
        width: "100%",
        padding: "12px 16px",
        background: "#1f2937",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        fontSize: 15,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    },
    btnCancelar: {
        background: "transparent",
        border: "1px solid #ef4444",
        color: "#ef4444",
        padding: "8px 12px",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "600",
        marginTop: "5px"
    }
}