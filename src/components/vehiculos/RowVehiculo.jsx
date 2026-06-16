import { useNavigate } from 'react-router-dom'

const COMBUSTIBLES = ['Electrico', 'Gasolina' , 'Híbrido']
const TAMANOS = { A:'Micro', B:'Subcompacto', C:'Compacto', D:'Mediano', E:'Grande', F:'Premium', S:'SUV' }

export default function RowVehiculo({ vehiculo, onEliminar }) {
    const navigate = useNavigate()

    const handleEditar = () => {
        navigate("/vehiculos/editar", {state: {id: vehiculo.id}})
    }

    return (
        <tr className="rv-row">
            {/* Foto miniatura */}
            <td className="rv-td rv-td-foto">
                <img
                    src={`${import.meta.env.VITE_URL_API}/vehiculos/${vehiculo.id}/main-picture`}
                    alt={vehiculo.modelo}
                    className="rv-thumb"
                    onError={e => { e.target.src = '/placeholder-car.png' }}
                />
            </td>

            {/* Placa */}
            <td className="rv-td">
                <span className="rv-placa">{vehiculo.placa}</span>
            </td>

            {/* Modelo */}
            <td className="rv-td">
                <span className="rv-modelo">{vehiculo.modelo}</span>
                {vehiculo.nombreMarca && (
                    <span className="rv-marca">{vehiculo.nombreMarca}</span>
                )}
            </td>

            {/* Color */}
            <td className="rv-td">
                <div className="rv-color-cell">
                    {vehiculo.codigoHex && (
                        <span
                            className="rv-color-dot"
                            style={{ background: vehiculo.codigoHex }}
                            title={vehiculo.codigoHex}
                        />
                    )}
                    <span>{vehiculo.color || '—'}</span>
                </div>
            </td>

            {/* Tamaño */}
            <td className="rv-td rv-td-center">
                <span className="rv-badge rv-badge-tamano" title={TAMANOS[vehiculo.tamano]}>
                    {vehiculo.tamano}
                </span>
            </td>

            {/* Pasajeros */}
            <td className="rv-td rv-td-center">
                <span className="rv-pasajeros">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                    {vehiculo.pasajeros}
                </span>
            </td>

            {/* Combustible */}
            <td className="rv-td rv-td-hide-sm">
                {COMBUSTIBLES[vehiculo.tipo_combustible] ?? '—'}
            </td>

            {/* Acciones */}
            <td className="rv-td rv-td-acciones">
                <button
                    className="rv-btn rv-btn-editar"
                    onClick={handleEditar}
                    title="Editar vehículo"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                    Editar
                </button>

                <button
                    className="rv-btn rv-btn-eliminar"
                    onClick={() => onEliminar?.(vehiculo)}
                    title="Eliminar vehículo"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                        <path d="M10 11v6M14 11v6"/>
                        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                    Eliminar
                </button>
            </td>
        </tr>
    )
}