import React, { useEffect, useState } from "react"
import SuscripcionCard from "./SuscripcionCard"
// Importaremos el Row y el Modal más adelante
// import RowSuscripcion from "./RowSuscripcion"
import ModalSuscripcion from "./ModalSuscripcion"
import { suscripcionesService } from "../../services/suscripciones.service"

export default function GridSuscripciones({ vista, modoCliente }) {
    const [planes, setPlanes]               = useState([])
    const [planSelec, setPlanSelec]         = useState(null)
    const [cargando, setCargando]           = useState(false)
    const [error, setError]                 = useState(null)

    // Cargar planes al montar el componente
    useEffect(() => {
        setCargando(true)
        setError(null)

        suscripcionesService.getPlanes()
            .then((data) => {
                // Ajustamos dependiendo de si la API devuelve el arreglo directo o dentro de una propiedad
                setPlanes(Array.isArray(data) ? data : data.planes || [])
            })
            .catch(() => setError("No se pudieron cargar los planes de suscripción."))
            .finally(() => setCargando(false))
    }, [])

    return (
        <div style={styles.wrapper}>
            {/* Estados de carga / error / vacío */}
            {cargando && <p style={styles.msg}>Cargando planes de suscripción…</p>}
            {error   && <p style={{ ...styles.msg, color: "#dc2626" }}>{error}</p>}
            {!cargando && !error && planes.length === 0 && (
                <p style={styles.msg}>No hay planes de suscripción disponibles en este momento.</p>
            )}

            {/* Vista: Cards */}
            {!cargando && !error && vista === "cards" && (
                <div style={styles.grid}>
                    {planes.map((plan) => (
                        <SuscripcionCard
                            key={plan.idSuscripcion || plan.id}
                            plan={plan}
                            onConsultar={setPlanSelec}
                        />
                    ))}
                </div>
            )}

            {/* Vista: Tabla (La implementaremos después) */}
            {!cargando && !error && vista === "tabla" && (
                <div style={styles.tableWrapper}>
                    <p style={styles.msg}>Vista de tabla en construcción...</p>
                </div>
            )}

            {/* Modal de detalle */}
            {planSelec && (
                <ModalSuscripcion
                    plan={planSelec}
                    onCerrar={() => setPlanSelec(null)}
                    onExito={() => {
                    // Aquí puedes poner lógica de recarga si lo necesitas
                    setPlanSelec(null)
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