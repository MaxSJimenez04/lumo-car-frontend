import { useEffect, useRef, useState } from "react"
import { consultaGeneralSucursales } from "../services/sucursales.service"
import MapaSucursales from "../components/sucursales/MapaSucursales"
import VehiculosSucursal from "../components/sucursales/VehiculosSucursal"
import "../utils/style.css"

export default function SucursalesView() {
    const [sucursales, setSucursales] = useState([])
    const [hover, setHover] = useState(null)
    const [seleccionada, setSeleccionada] = useState(null)
    const [error, setError] = useState("")
    const panelRef = useRef(null)

    useEffect(() => {
        consultaGeneralSucursales()
            .then(setSucursales)
            .catch(() => setError("No se pudieron cargar las sucursales."))
    }, [])

    useEffect(() => {
        if (seleccionada && panelRef.current) {
            panelRef.current.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }, [seleccionada])

    return (
        <div className="sucursales-container">
            <div className="sucursales-mapa-wrapper">
                {error && <p className="form-error">{error}</p>}

                {sucursales.length > 0 && (
                    <MapaSucursales
                        sucursales={sucursales}
                        onSeleccionar={setHover}
                        seleccionada={hover}
                        onClickSucursal={setSeleccionada}
                    />
                )}

                {hover && !seleccionada && (
                    <div className="sucursal-info-card">
                        <strong>{hover.nombre}</strong>
                        <span>Ubicación: {hover.direccion}</span>
                    </div>
                )}
            </div>

            {seleccionada && (
                <div ref={panelRef}>
                    <VehiculosSucursal
                        sucursal={seleccionada}
                        onCerrar={() => setSeleccionada(null)}
                    />
                </div>
            )}
        </div>
    )
}
