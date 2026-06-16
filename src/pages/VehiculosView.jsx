import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import GridVehiculos from "../components/vehiculos/GridVehiculos"
import { eliminarVehiculo } from "../services/vehiculos.service"
import { consultarEstados, consultarCiudades, consultarSucursales } from "../services/sucursales.service"
import { esCliente } from "../utils/auth"


export default function VehiculosView() {

    const navigate = useNavigate()
    const modoCliente = esCliente()
    var vista = "cards"
    if (modoCliente) {
        vista = "cards"
    }else{
        vista = "tabla"
    }
    const [loading, setLoading]       = useState(true)
    const [estados, setEstados]       = useState([])
    const [ciudades, setCiudades]     = useState([])
    const [sucursales, setSucursales] = useState([])
    const [estado, setEstado]         = useState("")
    const [ciudad, setCiudad]         = useState("")
    const [sucursal, setSucursal]     = useState("")

    // Carga inicial de estados
    useEffect(() => {
        consultarEstados()
            .then(setEstados)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    // Al cambiar estado → cargar ciudades
    useEffect(() => {
        if (!estado) {
            setCiudades([])
            setCiudad("")
            setSucursales([])
            setSucursal("")
            return
        }

        consultarCiudades(estado)
            .then(setCiudades)
            .catch(console.error)

        setCiudad("")
        setSucursales([])
        setSucursal("")
    }, [estado])

    // Al cambiar ciudad → cargar sucursales
    useEffect(() => {
        if (!ciudad) {
            setSucursales([])
            setSucursal("")
            return
        }

        consultarSucursales(ciudad)
            .then((respuesta) => setSucursales(respuesta.sucursales))
            .catch(console.error)

        setSucursal("")
    }, [ciudad])

    const handleEliminar = async (vehiculo) => {
        const confirmar = window.confirm("¿Desea eliminar este vehículo?")
        if (!confirmar) return

        try {
            await eliminarVehiculo(vehiculo.id)
        } catch (error) {
            console.error(error)
            alert("No fue posible eliminar el vehículo.")
        }
    }

    if (loading) return <p>Cargando...</p>

    return (
        <div className="filtros">
            {!modoCliente && (
                <button
                    className="btn-nuevo-vehiculo"
                    onClick={() => navigate("/vehiculos/nuevo")}
                >
                    + Nuevo vehículo
                </button>
            )}

            <select
                value={estado}
                onChange={(e) => setEstado(e.target.value)}
            >
                <option value="">Estado</option>
                {estados.map((e) => (
                    <option key={e.id} value={e.id}>{e.nombreEstado}</option>
                ))}
            </select>

            <select
                value={ciudad}
                onChange={(e) => setCiudad(e.target.value)}
                disabled={!estado}
            >
                <option value="">Ciudad</option>
                {ciudades.map((c) => (
                    <option key={c.id} value={c.id}>{c.nombreCiudad}</option>
                ))}
            </select>

            <select
                value={sucursal}
                onChange={(e) => setSucursal(e.target.value)}
                disabled={!ciudad}
            >
                <option value="">Todas las sucursales</option>
                {sucursales.map((s) => (
                    <option key={s.id} value={s.id}>{s.nombre}</option>
                ))}
            </select>

            <GridVehiculos
                idSucursal={sucursal}
                vista={vista}
                modoCliente={modoCliente}
                onEliminar={handleEliminar}
            />
        </div>
    )
}