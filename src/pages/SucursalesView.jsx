import { useEffect, useState } from "react"
import { consultaGeneralSucursales } from "../services/sucursales.service"
import MapaSucursales from "../components/sucursales/MapaSucursales"
import comoFunciona from "../utils/images/como-funciona.png"
import "../utils/style.css"

export default function SucursalesView() {
    const [sucursales, setSucursales] = useState([])
    const [seleccionada, setSeleccionada] = useState(null)
    const [error, setError] = useState("")

    useEffect(() => {
        consultaGeneralSucursales()
            .then(setSucursales)
            .catch(() => setError("No se pudieron cargar las sucursales."))
    }, [])

    return (
        <div className="sucursales-container">
            <div className="sucursales-mapa-wrapper">
                {error && <p className="form-error">{error}</p>}

                {sucursales.length > 0 && (
                    <MapaSucursales
                        sucursales={sucursales}
                        onSeleccionar={setSeleccionada}
                        seleccionada={seleccionada}
                    />
                )}

                {seleccionada && (
                    <div className="sucursal-info-card">
                        <strong>{seleccionada.nombre}</strong>
                        <span>Ubicación: {seleccionada.direccion}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
