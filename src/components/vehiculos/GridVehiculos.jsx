import React, { useEffect, useState } from "react"
import VehiculoCard from "./VehiculoCard"
import RowVehiculo from "./RowVehiculo"
import ModalVehiculo from "./ModalVehiculo"
import { consultarPorSucursal } from "../../services/vehiculos.service"

export default function GridVehiculos({
    idSucursal,
    vista,
    modoCliente,
    onEliminar,
}) {
    const [vehiculos, setVehiculos]         = useState([])
    const [filtroMarca, setFiltroMarca]     = useState("")
    const [vehiculoSelec, setVehiculoSelec] = useState(null)
    const [cargando, setCargando]           = useState(false)
    const [error, setError]                 = useState(null)

    // Cargar vehículos al montar o cuando cambia la sucursal
    useEffect(() => {
        setCargando(true)
        setError(null)

        consultarPorSucursal(idSucursal)
            .then(setVehiculos)
            .catch(() => setError("No se pudieron cargar los vehículos."))
            .finally(() => setCargando(false))
    }, [idSucursal])

    // Marcas únicas para el combobox de filtro
    const marcas = [...new Set(vehiculos.map((v) => v.nombreMarca).filter(Boolean))]

    const vehiculosFiltrados = filtroMarca
        ? vehiculos.filter((v) => v.nombreMarca === filtroMarca)
        : vehiculos

    const handleEliminar = (vehiculo) => {
        if (onEliminar) onEliminar(vehiculo)
    }

    return (
        <div style={styles.wrapper}>
            {/* Barra de filtros */}
            <div style={styles.filtros}>
                <label style={styles.label}>
                    Filtrar por marca
                    <select
                        style={styles.select}
                        value={filtroMarca}
                        onChange={(e) => setFiltroMarca(e.target.value)}
                    >
                        <option value="">Todas las marcas</option>
                        {marcas.map((m) => (
                            <option key={m} value={m}>{m}</option>
                        ))}
                    </select>
                </label>

                {/* Espacio para agregar más filtros en el futuro */}
            </div>

            {/* Estados de carga / error / vacío */}
            {cargando && <p style={styles.msg}>Cargando vehículos…</p>}
            {error   && <p style={{ ...styles.msg, color: "#dc2626" }}>{error}</p>}
            {!cargando && !error && vehiculosFiltrados.length === 0 && (
                <p style={styles.msg}>No hay vehículos disponibles para esta sucursal.</p>
            )}

            {/* Vista: Cards */}
            {!cargando && !error && vista === "cards" && (
                <div style={styles.grid}>
                    {vehiculosFiltrados.map((v) => (
                        <VehiculoCard
                            key={v.id}
                            vehiculo={v}
                            onConsultar={setVehiculoSelec}
                        />
                    ))}
                </div>
            )}

            {/* Vista: Tabla */}
            {!cargando && !error && vista === "tabla" && (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                {["Foto","Placa", "Modelo", "Marca","Tamaño","Pasajeros","Combustible", "Acciones"].map((h) => (
                                    <th key={h} style={styles.th}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {vehiculosFiltrados.map((v) => (
                                <RowVehiculo
                                    key={v.id}
                                    vehiculo={v}
                                    onConsultar={setVehiculoSelec}
                                    onEliminar={handleEliminar}
                                />
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal de detalle */}
            {vehiculoSelec && (
                <ModalVehiculo
                    vehiculo={vehiculoSelec}
                    modoCliente={modoCliente}
                    onCerrar={() => setVehiculoSelec(null)}
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
    filtros: {
        display: "flex",
        flexWrap: "wrap",
        gap: 16,
        alignItems: "flex-end",
        padding: "14px 16px",
        background: "#f9fafb",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
    },
    label: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        fontSize: 13,
        fontWeight: 600,
        color: "#374151",
    },
    select: {
        padding: "7px 12px",
        fontSize: 14,
        borderRadius: 7,
        border: "1px solid #d1d5db",
        background: "#fff",
        color: "#111827",
        minWidth: 180,
        cursor: "pointer",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: 20,
    },
    tableWrapper: {
        overflowX: "auto",
        borderRadius: 10,
        border: "1px solid #e5e7eb",
        background: "#fff",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        padding: "12px 16px",
        textAlign: "left",
        fontSize: 12,
        fontWeight: 700,
        color: "#6b7280",
        textTransform: "uppercase",
        letterSpacing: 0.5,
        background: "#f9fafb",
        borderBottom: "1px solid #e5e7eb",
    },
    msg: {
        textAlign: "center",
        padding: "32px 0",
        fontSize: 14,
        color: "#6b7280",
    },
}