import { useEffect, useState } from "react"
import { consultarPorSucursal } from "../../services/vehiculos.service"
import VehiculoCard from "../vehiculos/VehiculoCard"
import ModalVehiculo from "../vehiculos/ModalVehiculo"

export default function VehiculosSucursal({ sucursal, onCerrar }) {
    const [vehiculos, setVehiculos] = useState([])
    const [cargando, setCargando] = useState(true)
    const [error, setError] = useState("")
    const [vehiculoModal, setVehiculoModal] = useState(null)

    useEffect(() => {
        setCargando(true)
        setError("")
        consultarPorSucursal(sucursal.id)
            .then((data) => {
                console.log("Vehículos recibidos:", data)
                setVehiculos(data.filter(v => v.estado === 1))
            })
            .catch(() => setError("No se pudieron cargar los vehículos."))
            .finally(() => setCargando(false))
    }, [sucursal.id])

    return (
        <div className="vehiculos-sucursal-panel">
            <div className="vehiculos-sucursal-header">
                <div>
                    <h2 className="vehiculos-sucursal-titulo">{sucursal.nombre}</h2>
                    <p className="vehiculos-sucursal-dir">{sucursal.direccion}</p>
                </div>
                <button className="vehiculos-sucursal-cerrar" onClick={onCerrar}>✕</button>
            </div>

            {cargando && <p className="vehiculos-sucursal-msg">Cargando vehículos...</p>}
            {error && <p className="vehiculos-sucursal-msg error">{error}</p>}

            {!cargando && !error && vehiculos.length === 0 && (
                <p className="vehiculos-sucursal-msg">No hay vehículos disponibles en esta sucursal.</p>
            )}

            <div className="vehiculos-sucursal-grid">
                {vehiculos.map((v) => (
                    <VehiculoCard
                        key={v.id}
                        vehiculo={v}
                        onConsultar={setVehiculoModal}
                    />
                ))}
            </div>

            {vehiculoModal && (
                <ModalVehiculo
                    vehiculo={vehiculoModal}
                    modoCliente={true}
                    onCerrar={() => setVehiculoModal(null)}
                    onExito={() => {
                        setVehiculos((prev) => prev.filter((v) => v.id !== vehiculoModal.id))
                        setVehiculoModal(null)
                    }}
                />
            )}
        </div>
    )
}
