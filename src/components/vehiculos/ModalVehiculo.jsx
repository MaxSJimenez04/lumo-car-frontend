import React, { useEffect, useState } from "react"
import { consultarVehiculo } from "../../services/vehiculos.service"
import { consultarFotosSecundarias } from "../../services/vehiculos.service"

const COMBUSTIBLE_LABEL = {
    0: { label: "Gasolina",  icon: "⛽" },
    1: { label: "Híbrido",   icon: "🔋" },
    2: { label: "Eléctrico", icon: "⚡" },
}

const TAMANO_LABEL = {
    A: "Mini",
    B: "Compacto",
    C: "Mediano",
    D: "Grande",
    E: "Premium",
    F: "SUV",
    S: "Deportivo",
}

export default function ModalVehiculo({ vehiculo, modoCliente = false, onCerrar }) {
    const [detalle, setDetalle]           = useState(null)
    const [fotosSecundarias, setFotos]    = useState([])
    const [fotoActiva, setFotoActiva]     = useState(null)
    const [cargando, setCargando]         = useState(true)

    useEffect(() => {
        if (!vehiculo) return
        setCargando(true)

        // Cargar detalle completo del vehículo
        Promise.all([
            consultarVehiculo(vehiculo.id),
            fetchFotosSecundarias(vehiculo.id),
        ]).then(([datos, fotos]) => {
            setDetalle(datos)
            setFotos(fotos)
            setFotoActiva(null)
        }).catch(console.error)
          .finally(() => setCargando(false))
    }, [vehiculo])

    // Las fotos secundarias vienen como multipart/form-data → las convertimos a Object URLs
    const fetchFotosSecundarias = async (idVehiculo) => {
        try {
            const resp = await consultarFotosSecundarias(idVehiculo)
            // Si el servicio devuelve un array de blobs (depende de la implementación del cliente)
            // Este bloque admite tanto un array de URLs como una respuesta binaria
            if (Array.isArray(resp)) return resp
            return []
        } catch {
            return []
        }
    }

    if (!vehiculo) return null

    const combustible  = COMBUSTIBLE_LABEL[detalle?.tipo_combustible] ?? { label: "—", icon: "" }
    const transmision  = detalle?.transmision ? "Automático" : "Estándar"
    const tamano       = TAMANO_LABEL[detalle?.tamano] ?? detalle?.tamano ?? "—"
    const fotoPrincipal = `${import.meta.env.VITE_URL_API}/vehiculos/${vehiculo.id}/main-picture`

    return (
        <div style={styles.overlay} onClick={(e) => e.target === e.currentTarget && onCerrar()}>
            <div style={styles.modal}>
                {/* Header */}
                <div style={styles.header}>
                    <div>
                        <p style={styles.headerMarca}>{detalle?.nombreMarca ?? vehiculo.nombreMarca}</p>
                        <h2 style={styles.headerModelo}>{detalle?.modelo ?? vehiculo.modelo}</h2>
                    </div>
                    <button style={styles.closeBtn} onClick={onCerrar}>✕</button>
                </div>

                {cargando ? (
                    <div style={styles.loading}>Cargando información…</div>
                ) : (
                    <div style={styles.content}>
                        {/* Galería */}
                        <div style={styles.gallery}>
                            <img
                                src={fotoActiva ?? fotoPrincipal}
                                alt="Foto del vehículo"
                                style={styles.fotoMain}
                            />
                            {fotosSecundarias.length > 0 && (
                                <div style={styles.thumbnails}>
                                    <img
                                        src={fotoPrincipal}
                                        alt="Principal"
                                        style={{
                                            ...styles.thumb,
                                            ...(fotoActiva === null ? styles.thumbActiva : {}),
                                        }}
                                        onClick={() => setFotoActiva(null)}
                                    />
                                    {fotosSecundarias.map((url, i) => (
                                        <img
                                            key={i}
                                            src={url}
                                            alt={`Foto ${i + 1}`}
                                            style={{
                                                ...styles.thumb,
                                                ...(fotoActiva === url ? styles.thumbActiva : {}),
                                            }}
                                            onClick={() => setFotoActiva(url)}
                                            onError={(e) => { e.target.style.display = "none" }}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Datos del vehículo */}
                        <div style={styles.info}>
                            <div style={styles.infoGrid}>
                                <Dato etiqueta="Placa"        valor={detalle?.placa} />
                                <Dato etiqueta="Marca"        valor={detalle?.nombreMarca} />
                                <Dato etiqueta="Modelo"       valor={detalle?.modelo} />
                                <Dato etiqueta="Tamaño"       valor={tamano} />
                                <Dato etiqueta="Pasajeros"    valor={detalle?.pasajeros} />
                                <Dato etiqueta="Transmisión"  valor={transmision} />
                                <Dato etiqueta="Combustible"  valor={`${combustible.icon} ${combustible.label}`} />
                                <Dato
                                    etiqueta="Aire acondicionado"
                                    valor={detalle?.aire_acondicionado ? "Sí" : "No"}
                                />
                                <Dato
                                    etiqueta="Color"
                                    valor={
                                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                            <span style={{
                                                display: "inline-block",
                                                width: 14, height: 14,
                                                borderRadius: "50%",
                                                background: `${detalle?.codigoHex}`,
                                                border: "1px solid #d1d5db",
                                            }} />
                                            {detalle?.color}
                                        </span>
                                    }
                                />
                            </div>

                            {/* Footer del modal */}
                            <div style={styles.footer}>
                                {modoCliente ? (
                                    <>
                                        {/* TODO: navegar a la página de renta del vehículo (por definir) */}
                                        <button
                                            style={styles.btnRentar}
                                            onClick={() => {
                                                /* TODO: reemplazar con navigate('/rentar/' + vehiculo.id) o similar */
                                                alert("Redirigir a página de renta — por definir")
                                            }}
                                        >
                                            Rentar vehículo
                                        </button>
                                    </>
                                ) : null}
                                <button style={styles.btnCerrar} onClick={onCerrar}>
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

function Dato({ etiqueta, valor }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5 }}>
                {etiqueta}
            </span>
            <span style={{ fontSize: 14, color: "#111827", fontWeight: 500 }}>
                {valor ?? "—"}
            </span>
        </div>
    )
}

const styles = {
    overlay: {
        position: "fixed", inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 1000,
        padding: 16,
    },
    modal: {
        background: "#fff",
        borderRadius: 16,
        width: "100%",
        maxWidth: 780,
        maxHeight: "90vh",
        overflowY: "auto",
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        padding: "20px 24px 16px",
        borderBottom: "1px solid #e5e7eb",
    },
    headerMarca: {
        margin: 0, fontSize: 12, fontWeight: 600,
        color: "#6b7280", textTransform: "uppercase", letterSpacing: 1,
    },
    headerModelo: {
        margin: "4px 0 0", fontSize: 22, fontWeight: 700, color: "#111827",
    },
    closeBtn: {
        background: "none", border: "none",
        fontSize: 18, color: "#9ca3af", cursor: "pointer", padding: 4,
    },
    loading: {
        padding: 48, textAlign: "center", color: "#6b7280", fontSize: 14,
    },
    content: {
        display: "flex",
        flexDirection: "column",
        gap: 0,
    },
    gallery: {
        padding: "16px 24px 0",
    },
    fotoMain: {
        width: "100%",
        height: 260,
        objectFit: "cover",
        borderRadius: 10,
        background: "#f3f4f6",
    },
    thumbnails: {
        display: "flex",
        gap: 8,
        marginTop: 10,
        overflowX: "auto",
        paddingBottom: 4,
    },
    thumb: {
        width: 72, height: 52,
        objectFit: "cover",
        borderRadius: 6,
        cursor: "pointer",
        border: "2px solid transparent",
        flexShrink: 0,
    },
    thumbActiva: {
        border: "2px solid #2563eb",
    },
    info: {
        padding: "20px 24px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    infoGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
        gap: "16px 24px",
    },
    footer: {
        display: "flex",
        gap: 10,
        justifyContent: "flex-end",
        paddingTop: 8,
        borderTop: "1px solid #e5e7eb",
    },
    btnRentar: {
        padding: "10px 24px",
        background: "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
    },
    btnCerrar: {
        padding: "10px 20px",
        background: "#f3f4f6",
        color: "#374151",
        border: "none",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 14,
        cursor: "pointer",
    },
}