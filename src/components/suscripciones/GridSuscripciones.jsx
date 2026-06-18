import React, { useEffect, useState } from "react"
import SuscripcionCard from "./SuscripcionCard"
import ModalSuscripcion from "./ModalSuscripcion"
import { suscripcionesService } from "../../services/suscripciones.service"

export default function GridSuscripciones({ vista, modoCliente }) {
    const [planes, setPlanes]               = useState([])
    const [planSelec, setPlanSelec]         = useState(null)
    const [cargando, setCargando]           = useState(false)
    const [error, setError]                 = useState(null)
    const [planActual, setPlanActual]       = useState(null)

    useEffect(() => {
        setCargando(true)
        setError(null)

        Promise.all([
            suscripcionesService.getPlanes(),
            modoCliente ? suscripcionesService.getMiSuscripcion() : Promise.resolve(null)
        ])
        .then(([dataPlanes, dataSuscripcion]) => {
            setPlanes(Array.isArray(dataPlanes) ? dataPlanes : dataPlanes.planes || [])
            
            if (dataSuscripcion && dataSuscripcion.idSuscripcion) {
                setPlanActual(dataSuscripcion.idSuscripcion);
            }
        })
        .catch(() => setError("No se pudieron cargar los datos. Revisa tu conexión."))
        .finally(() => setCargando(false))
    }, [modoCliente])

    return (
        <div style={styles.wrapper}>
            {cargando && <p style={styles.msg}>Cargando planes de suscripción…</p>}
            {error   && <p style={{ ...styles.msg, color: "#dc2626" }}>{error}</p>}
            {!cargando && !error && planes.length === 0 && (
                <p style={styles.msg}>No hay planes de suscripción disponibles en este momento.</p>
            )}

            {!cargando && !error && vista === "cards" && (
                <div style={styles.grid}>
                    {planes.map((plan) => (
                        <SuscripcionCard
                            key={plan.idSuscripcion || plan.id}
                            plan={plan}
                            onConsultar={setPlanSelec}
                            esMiPlan={planActual === (plan.idSuscripcion || plan.id)}
                        />
                    ))}
                </div>
            )}

            {!cargando && !error && vista === "tabla" && (
                <div style={styles.tableWrapper}>
                    <p style={styles.msg}>Vista de tabla en construcción...</p>
                </div>
            )}

            {planSelec && (
                <ModalSuscripcion
                plan={planSelec}
                esCambio={planActual !== null}
                onCerrar={() => setPlanSelec(null)}
                onExito={() => {
                    setPlanSelec(null);
                    window.location.reload(); 
            }}
        />
    )}
        </div>
    )
}

const styles = {
    wrapper: {
        display: "flex",
        flexDirection: "column",
        gap: 20,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 24,
    },
    tableWrapper: {
        overflowX: "auto",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        background: "#fff",
    },
    msg: {
        textAlign: "center",
        padding: "32px 0",
        fontSize: 14,
        color: "#6b7280",
    },
}