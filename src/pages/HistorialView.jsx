import { useEffect, useState } from "react"
import { obtenerHistorial, cancelarRenta } from "../services/rentas.service"
import { consultarPerfil } from "../services/usuarios.service"
import { obtenerDatosToken } from "../utils/auth"
import Loading from "../components/common/Loading"

const ESTADO = {
    0: { label: "Creada",     color: "#16a34a", bg: "#dcfce7" },
    2: { label: "Finalizada", color: "#2563eb", bg: "#dbeafe" },
    3: { label: "Cancelada",  color: "#dc2626", bg: "#fee2e2" },
    4: { label: "Finalizada fuera de tiempo",  color: "#dc2626", bg: "#fee2e2" },
}

const estadoConfig = (e) =>
    ESTADO[e] ?? { label: `Estado ${e}`, color: "#6b7280", bg: "#f3f4f6" }

const formatFecha = (iso) => {
    if (!iso) return "—"
    return new Date(iso).toLocaleString("es-MX", {
        day: "2-digit", month: "short", year: "numeric",
        hour: "2-digit", minute: "2-digit",
    })
}

const formatMonto = (n) =>
    Number(n).toLocaleString("es-MX", { style: "currency", currency: "MXN" })

export default function HistorialView() {
    const [rentas, setRentas]     = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError]       = useState("")

    useEffect(() => {
        const { username } = obtenerDatosToken() ?? {}
        if (!username) { setCargando(false); return }

        consultarPerfil(username)
            .then((data) => {
                const idUsuario = data?.id ?? data?.usuario?.id
                return obtenerHistorial(idUsuario)
            })
            .then(setRentas)
            .catch(() => setError("No se pudo cargar el historial."))
            .finally(() => setCargando(false))
    }, [])

    const handleCancelada = (idRenta) => {
        setRentas((prev) =>
            prev.map((r) => r.id === idRenta ? { ...r, estadoRenta: 3 } : r)
        )
    }

    if (cargando) return <Loading message="Cargando historial..." fullPage />

    return (
        <div className="seccion">
            <h1 style={s.titulo}>Mis viajes</h1>

            {error && <p style={s.error}>{error}</p>}

            {!error && rentas.length === 0 && (
                <div style={s.vacio}>
                    <p style={s.vacioTexto}>Aún no tienes viajes registrados.</p>
                </div>
            )}

            <div style={s.lista}>
                {rentas.map((r, i) => (
                    <RentaCard key={r.id ?? i} renta={r} onCancelada={handleCancelada} />
                ))}
            </div>
        </div>
    )
}

function RentaCard({ renta, onCancelada }) {
    const [confirmando, setConfirmando] = useState(false)
    const [cancelando, setCancelando]   = useState(false)
    const [errorCancelar, setErrorCancelar] = useState("")

    const vehiculo = renta.Vehiculo ?? {}
    const marca    = vehiculo.Marca?.nombreMarca ?? "—"
    const modelo   = vehiculo.modelo ?? "—"
    const placa    = vehiculo.placa ?? ""
    const sucursal = vehiculo.Sucursal?.nombre ?? ""
    const cfg      = estadoConfig(renta.estadoRenta)
    const pago     = Array.isArray(renta.Pago) ? renta.Pago[0] : renta.Pago
    const monto    = pago?.monto
    const fotoUrl  = `${import.meta.env.VITE_URL_API}/vehiculos/${vehiculo.id}/main-picture`

    const puedeCancel = renta.estadoRenta === 0

    const handleCancelar = async () => {
        setCancelando(true)
        setErrorCancelar("")
        try {
            await cancelarRenta(renta.id)
            setConfirmando(false)
            onCancelada(renta.id)
        } catch (err) {
            setErrorCancelar(err.response?.data?.mensaje || "No se pudo cancelar la reserva.")
        } finally {
            setCancelando(false)
        }
    }

    return (
        <div style={s.card}>
            {/* Fila principal */}
            <div style={s.fila}>
                {/* Foto */}
                <div style={s.fotoWrap}>
                    <img
                        src={fotoUrl}
                        alt={modelo}
                        style={s.foto}
                        onError={(e) => { e.target.style.display = "none" }}
                    />
                </div>

                {/* Info central */}
                <div style={s.info}>
                    <div style={s.infoTop}>
                        <div>
                            <p style={s.marca}>{marca}</p>
                            <p style={s.modelo}>{modelo}</p>
                            {placa    && <p style={s.placa}>{placa}</p>}
                            {sucursal && <p style={s.sucursal}>📍 {sucursal}</p>}
                        </div>
                        <span style={{ ...s.badge, color: cfg.color, background: cfg.bg }}>
                            {cfg.label}
                        </span>
                    </div>

                    <div style={s.fechas}>
                        <FechaItem label="Inicio" valor={formatFecha(renta.fechaInicio)} />
                        <span style={s.arrow}>→</span>
                        <FechaItem label="Fin"    valor={formatFecha(renta.fechaFin)} />
                    </div>
                </div>

                {/* Monto */}
                {monto != null && (
                    <div style={s.monto}>
                        <p style={s.montoLabel}>Total</p>
                        <p style={s.montoValor}>{formatMonto(monto)}</p>
                    </div>
                )}
            </div>

            {/* Sección de cancelación */}
            {puedeCancel && !confirmando && (
                <div style={s.cancelarWrap}>
                    <button style={s.btnCancelar} onClick={() => setConfirmando(true)}>
                        Cancelar reserva
                    </button>
                </div>
            )}

            {puedeCancel && confirmando && (
                <div style={s.confirmBox}>
                    <div style={s.confirmIcono}>⚠️</div>
                    <div style={s.confirmTexto}>
                        <p style={s.confirmTitulo}>¿Cancelar esta reserva?</p>
                        {monto != null && (
                            <p style={s.confirmSub}>
                                Se realizará un reembolso de{" "}
                                <strong>{formatMonto(monto)}</strong> a tu tarjeta registrada.
                            </p>
                        )}
                        {errorCancelar && <p style={s.confirmError}>{errorCancelar}</p>}
                    </div>
                    <div style={s.confirmBotones}>
                        <button
                            style={s.btnConfirmarCancelar}
                            onClick={handleCancelar}
                            disabled={cancelando}
                        >
                            {cancelando ? "Cancelando…" : "Sí, cancelar"}
                        </button>
                        <button
                            style={s.btnVolver}
                            onClick={() => { setConfirmando(false); setErrorCancelar("") }}
                            disabled={cancelando}
                        >
                            Volver
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

function FechaItem({ label, valor }) {
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <span style={{ fontSize: 10, color: "#9ca3af", textTransform: "uppercase", fontWeight: 600 }}>
                {label}
            </span>
            <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{valor}</span>
        </div>
    )
}

const s = {
    titulo: {
        fontSize: 24, fontWeight: 700, color: "#111827", marginBottom: 24,
    },
    error: {
        color: "#dc2626", fontSize: 14, textAlign: "center", padding: "32px 0",
    },
    vacio: {
        display: "flex", flexDirection: "column", alignItems: "center",
        gap: 12, padding: "64px 0",
    },
    vacioTexto: { fontSize: 15, color: "#6b7280" },
    lista: {
        display: "flex", flexDirection: "column", gap: 14,
    },
    card: {
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 14,
        padding: "16px 20px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },
    fila: {
        display: "flex", alignItems: "center", gap: 16,
    },
    fotoWrap: {
        width: 100, height: 68, flexShrink: 0,
        background: "#f3f4f6", borderRadius: 8, overflow: "hidden",
        display: "flex", alignItems: "center", justifyContent: "center",
    },
    foto: {
        width: "100%", height: "100%", objectFit: "cover",
    },
    info: {
        flex: 1, display: "flex", flexDirection: "column", gap: 10, minWidth: 0,
    },
    infoTop: {
        display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8,
    },
    marca: {
        margin: 0, fontSize: 11, fontWeight: 700,
        color: "#6b7280", textTransform: "uppercase", letterSpacing: 0.5,
    },
    modelo: {
        margin: "2px 0 0", fontSize: 16, fontWeight: 700, color: "#111827",
    },
    placa: {
        margin: "2px 0 0", fontSize: 12, color: "#9ca3af", fontFamily: "monospace",
    },
    sucursal: {
        margin: "3px 0 0", fontSize: 12, color: "#6b7280",
    },
    badge: {
        flexShrink: 0, fontSize: 11, fontWeight: 700,
        padding: "3px 10px", borderRadius: 99, whiteSpace: "nowrap",
    },
    fechas: {
        display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap",
    },
    arrow: { color: "#d1d5db", fontSize: 14 },
    monto: {
        flexShrink: 0, textAlign: "right",
        paddingLeft: 20, borderLeft: "1px solid #f3f4f6",
    },
    montoLabel: {
        margin: 0, fontSize: 11, color: "#9ca3af",
        fontWeight: 600, textTransform: "uppercase",
    },
    montoValor: {
        margin: "4px 0 0", fontSize: 18, fontWeight: 700, color: "#111827",
    },
    cancelarWrap: {
        display: "flex", justifyContent: "flex-end",
        borderTop: "1px solid #f3f4f6", paddingTop: 10,
    },
    btnCancelar: {
        background: "none", border: "1.5px solid #fca5a5",
        color: "#dc2626", borderRadius: 8,
        padding: "6px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer",
    },
    confirmBox: {
        display: "flex", alignItems: "flex-start", gap: 14,
        background: "#fff7ed",
        border: "1px solid #fed7aa",
        borderRadius: 10,
        padding: "14px 16px",
    },
    confirmIcono: { fontSize: 22, flexShrink: 0, marginTop: 1 },
    confirmTexto: { flex: 1, display: "flex", flexDirection: "column", gap: 4 },
    confirmTitulo: {
        margin: 0, fontSize: 14, fontWeight: 700, color: "#92400e",
    },
    confirmSub: {
        margin: 0, fontSize: 13, color: "#78350f", lineHeight: 1.4,
    },
    confirmError: {
        margin: "4px 0 0", fontSize: 12, color: "#dc2626",
    },
    confirmBotones: {
        display: "flex", flexDirection: "column", gap: 6, flexShrink: 0,
    },
    btnConfirmarCancelar: {
        background: "#dc2626", color: "#fff", border: "none",
        borderRadius: 8, padding: "7px 16px",
        fontSize: 13, fontWeight: 600, cursor: "pointer",
    },
    btnVolver: {
        background: "#f3f4f6", color: "#374151", border: "none",
        borderRadius: 8, padding: "7px 16px",
        fontSize: 13, fontWeight: 600, cursor: "pointer",
    },
}
