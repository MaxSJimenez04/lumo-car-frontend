import React from "react"

const COMBUSTIBLE_LABEL = {
    1: { label: "Gasolina", icon: "⛽" },
    2: { label: "Híbrido",  icon: "🔋" },
    0: { label: "Eléctrico", icon: "⚡" },
}

export default function VehiculoCard({ vehiculo, onConsultar }) {
    const combustible = COMBUSTIBLE_LABEL[vehiculo.tipo_combustible] ?? { label: "Desconocido", icon: "❓" }
    const transmision = vehiculo.transmision ? "Automático" : "Estándar"

    return (
        <div style={styles.card}>
            {/* Foto principal */}
            <div style={styles.imgWrapper}>
                <img
                    src={`${import.meta.env.VITE_URL_API}/vehiculos/${vehiculo.id}/main-picture`}
                    alt={`Foto de ${vehiculo.nombreMarca} ${vehiculo.modelo}`}
                    style={styles.img}
                />
                <span style={{ ...styles.badge, backgroundColor: `${vehiculo.codigoHex ?? "#888"}` }}>
                    {vehiculo.color}
                </span>
            </div>

            {/* Info */}
            <div style={styles.body}>
                <p style={styles.marca}>{vehiculo.nombreMarca}</p>
                <p style={styles.modelo}>{vehiculo.modelo}</p>

                <div style={styles.chips}>
                    <span style={styles.chip}>👥 {vehiculo.pasajeros} pasajeros</span>
                    <span style={styles.chip}>{combustible.icon} {combustible.label}</span>
                    <span style={styles.chip}>⚙️ {transmision}</span>
                </div>

                <button style={styles.btn} onClick={() => onConsultar(vehiculo)}>
                    Consultar
                </button>
            </div>
        </div>
    )
}

const styles = {
    card: {
        borderRadius: 12,
        overflow: "hidden",
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.09)",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s",
    },
    imgWrapper: {
        position: "relative",
        width: "100%",
        height: 180,
        background: "#f3f4f6",
        overflow: "hidden",
    },
    img: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    badge: {
        position: "absolute",
        top: 10,
        right: 10,
        color: "#fff",
        fontSize: 11,
        fontWeight: 600,
        padding: "3px 10px",
        borderRadius: 20,
        textShadow: "0 1px 2px rgba(0,0,0,0.4)",
    },
    body: {
        padding: "14px 16px 16px",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        flex: 1,
    },
    marca: {
        margin: 0,
        fontSize: 12,
        fontWeight: 600,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: 1,
    },
    modelo: {
        margin: 0,
        fontSize: 17,
        fontWeight: 700,
        color: "#111827",
    },
    chips: {
        display: "flex",
        flexWrap: "wrap",
        gap: 6,
        marginTop: 4,
    },
    chip: {
        fontSize: 12,
        background: "#f3f4f6",
        color: "#374151",
        borderRadius: 20,
        padding: "3px 10px",
    },
    btn: {
        marginTop: 10,
        width: "100%",
        padding: "9px 0",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
    },
}