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

            <style>{`
                .rv-row {
                    border-bottom: 1px solid #f3f4f6;
                    transition: background 0.1s;
                }
                .rv-row:hover { background: #fafafa; }

                .rv-td {
                    padding: 10px 12px;
                    font-size: 0.875rem;
                    color: #374151;
                    vertical-align: middle;
                    white-space: nowrap;
                }
                .rv-td-foto    { width: 56px; padding-right: 0; }
                .rv-td-center  { text-align: center; }
                .rv-td-acciones { text-align: right; }

                @media (max-width: 640px) {
                    .rv-td-hide-sm { display: none; }
                }

                .rv-thumb {
                    width: 48px;
                    height: 36px;
                    object-fit: cover;
                    border-radius: 5px;
                    border: 1px solid #e5e7eb;
                    background: #f3f4f6;
                    display: block;
                }

                .rv-placa {
                    font-family: monospace;
                    font-size: 0.8rem;
                    font-weight: 600;
                    letter-spacing: 0.04em;
                    color: #111827;
                    background: #f3f4f6;
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                .rv-modelo  { display: block; font-weight: 500; color: #111827; }
                .rv-marca   { display: block; font-size: 0.75rem; color: #9ca3af; margin-top: 1px; }

                .rv-color-cell {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                }
                .rv-color-dot {
                    width: 14px;
                    height: 14px;
                    border-radius: 50%;
                    border: 1px solid rgba(0,0,0,.1);
                    flex-shrink: 0;
                }

                .rv-badge {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 24px;
                    height: 24px;
                    border-radius: 5px;
                    font-size: 0.75rem;
                    font-weight: 700;
                    background: #ede9fe;
                    color: #5b21b6;
                }

                .rv-pasajeros {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    color: #6b7280;
                    font-size: 0.85rem;
                }

                /* Botones de acción */
                .rv-btn {
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    padding: 5px 10px;
                    border-radius: 6px;
                    font-size: 0.78rem;
                    font-weight: 500;
                    cursor: pointer;
                    border: 1px solid transparent;
                    transition: background 0.12s, border-color 0.12s, color 0.12s;
                    margin-left: 6px;
                }
                .rv-btn-editar {
                    background: #eff6ff;
                    color: #1d4ed8;
                    border-color: #bfdbfe;
                }
                .rv-btn-editar:hover {
                    background: #dbeafe;
                    border-color: #93c5fd;
                }
                .rv-btn-eliminar {
                    background: #fff;
                    color: #dc2626;
                    border-color: #fecaca;
                }
                .rv-btn-eliminar:hover {
                    background: #fef2f2;
                    border-color: #f87171;
                }
            `}</style>
        </tr>
    )
}