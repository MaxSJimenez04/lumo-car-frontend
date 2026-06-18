import React from "react"

export default function SuscripcionCard({ plan, onConsultar }) {
    return (
        <div style={styles.card}>
            <div style={styles.header}>
                <h3 style={styles.title}>{plan.nombre}</h3>
                <p style={styles.price}>${plan.costo} <span style={styles.period}>/ mes</span></p>
            </div>
            
            <div style={styles.body}>
                <p style={styles.description}>{plan.descripcion || 'Sin descripción disponible.'}</p>
                
                {/* Puedes ajustar estos campos según lo que devuelva tu API */}
                <ul style={styles.list}>
                    <li style={styles.listItem}>✓ Máximo {plan.limiteVehiculos} vehículos</li>
                    <li style={styles.listItem}>✓ {plan.descuentoRenta}% descuento en rentas</li>
                </ul>
            </div>

            <div style={styles.footer}>
                <button 
                    style={styles.btnAccion} 
                    onClick={() => onConsultar(plan)}
                >
                    Ver detalles
                </button>
            </div>
        </div>
    )
}

const styles = {
    card: {
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
    },
    header: {
        padding: "20px 20px 10px 20px",
        borderBottom: "1px solid #f3f4f6",
        background: "#f9fafb",
        textAlign: "center"
    },
    title: {
        margin: "0 0 10px 0",
        fontSize: 18,
        fontWeight: 700,
        color: "#1f2937",
    },
    price: {
        margin: 0,
        fontSize: 28,
        fontWeight: 800,
        color: "#10b981", // Un tono verde para el precio
    },
    period: {
        fontSize: 14,
        fontWeight: 500,
        color: "#6b7280",
    },
    body: {
        padding: 20,
        flex: 1,
    },
    description: {
        margin: "0 0 16px 0",
        fontSize: 14,
        color: "#4b5563",
        lineHeight: 1.5,
    },
    list: {
        listStyle: "none",
        padding: 0,
        margin: 0,
        fontSize: 13,
        color: "#374151",
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    listItem: {
        display: "flex",
        alignItems: "center",
    },
    footer: {
        padding: "16px 20px",
        background: "#f9fafb",
        borderTop: "1px solid #f3f4f6",
    },
    btnAccion: {
        width: "100%",
        padding: "10px 16px",
        background: "#1f2937",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
    },
}