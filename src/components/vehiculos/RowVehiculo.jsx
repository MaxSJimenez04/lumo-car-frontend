import React from "react"

export default function VehiculoRow({ vehiculo, onConsultar, onEliminar }) {
    return (
        <tr style={styles.row}>
            <td style={styles.td}>{vehiculo.placa}</td>
            <td style={styles.td}>{vehiculo.modelo}</td>
            <td style={styles.td}>{vehiculo.nombreMarca}</td>
            <td style={{ ...styles.td, ...styles.actions }}>
                <button
                    style={styles.btnConsultar}
                    onClick={() => onConsultar(vehiculo)}
                >
                    Consultar
                </button>
                <button
                    style={styles.btnEliminar}
                    onClick={() => onEliminar(vehiculo)}
                >
                    Eliminar
                </button>
            </td>
        </tr>
    )
}

const styles = {
    row: {
        borderBottom: "1px solid #e5e7eb",
        transition: "background 0.15s",
    },
    td: {
        padding: "12px 16px",
        fontSize: 14,
        color: "#111827",
        verticalAlign: "middle",
    },
    actions: {
        display: "flex",
        gap: 8,
        alignItems: "center",
    },
    btnConsultar: {
        padding: "6px 16px",
        background: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: 6,
        fontWeight: 600,
        fontSize: 13,
        cursor: "pointer",
    },
    btnEliminar: {
        padding: "6px 16px",
        background: "#fff",
        color: "#dc2626",
        border: "1px solid #dc2626",
        borderRadius: 6,
        fontWeight: 600,
        fontSize: 13,
        cursor: "pointer",
    },
}