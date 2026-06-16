import { useState, useRef, useEffect } from "react"
import { useNotificaciones } from "../../hooks/useNotificaciones"

function formatFecha(fecha) {
    if (!fecha) return ""
    return new Date(fecha).toLocaleString("es-MX", {
        day: "2-digit", month: "short",
        hour: "2-digit", minute: "2-digit",
    })
}

export default function NotificacionesPanel({ idUsuario }) {
    const [abierto, setAbierto] = useState(false)
    const { notificaciones, noLeidas, leerUna, leerTodas } = useNotificaciones(idUsuario)
    const panelRef = useRef(null)

    // Cierra el panel al hacer click fuera
    useEffect(() => {
        const handler = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setAbierto(false)
            }
        }
        document.addEventListener("mousedown", handler)
        return () => document.removeEventListener("mousedown", handler)
    }, [])

    return (
        <div className="notif-wrapper" ref={panelRef}>
            <button className="notif-btn" onClick={() => setAbierto((v) => !v)}>
                🔔
                {noLeidas > 0 && (
                    <span className="notif-badge">{noLeidas > 99 ? "99+" : noLeidas}</span>
                )}
            </button>

            {abierto && (
                <div className="notif-panel">
                    <div className="notif-panel-header">
                        <span>Notificaciones</span>
                        {noLeidas > 0 && (
                            <button className="notif-leer-todas" onClick={leerTodas}>
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>

                    <div className="notif-lista">
                        {notificaciones.length === 0 ? (
                            <p className="notif-vacia">Sin notificaciones</p>
                        ) : (
                            notificaciones.map((n) => (
                                <div
                                    key={n.id}
                                    className={`notif-item ${!n.leida ? "no-leida" : ""}`}
                                    onClick={() => !n.leida && leerUna(n.id)}
                                >
                                    <div className="notif-item-titulo">{n.titulo}</div>
                                    <div className="notif-item-mensaje">{n.mensaje}</div>
                                    <div className="notif-item-fecha">{formatFecha(n.fecha_envio)}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
