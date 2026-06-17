import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GridVehiculos from '../components/vehiculos/GridVehiculos'
import { eliminarVehiculo } from '../services/vehiculos.service'
import { consultarEstados, consultarCiudades, consultarSucursales } from '../services/sucursales.service'
import { esCliente } from '../utils/auth'
import Loading from '../components/common/Loading'

export default function VehiculosView() {
    const navigate = useNavigate()
    const modoCliente = esCliente()
    const vista = modoCliente ? 'cards' : 'tabla'

    const [loading, setLoading]       = useState(true)
    const [estados, setEstados]       = useState([])
    const [ciudades, setCiudades]     = useState([])
    const [sucursales, setSucursales] = useState([])
    const [estado, setEstado]         = useState('')
    const [ciudad, setCiudad]         = useState('')
    const [sucursal, setSucursal]     = useState('')

    // ── Carga inicial ────────────────────────────────────────────────────
    useEffect(() => {
        consultarEstados()
            .then(setEstados)
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [])

    // ── Al cambiar estado ────────────────────────────────────────────────
    useEffect(() => {
        if (!estado) {
            setCiudades([])
            setCiudad('')
            setSucursales([])
            setSucursal('')
            return
        }
        consultarCiudades(estado)
            .then(setCiudades)
            .catch(console.error)
        setCiudad('')
        setSucursales([])
        setSucursal('')
    }, [estado])

    // ── Al cambiar ciudad ────────────────────────────────────────────────
    useEffect(() => {
        if (!ciudad) {
            setSucursales([])
            setSucursal('')
            return
        }
        consultarSucursales(ciudad)
            .then(r => setSucursales(r.sucursales))
            .catch(console.error)
        setSucursal('')
    }, [ciudad])

    const handleEliminar = async (vehiculo) => {
        if (!window.confirm('¿Desea eliminar este vehículo?')) return
        try {
            await eliminarVehiculo(vehiculo.id)
        } catch (error) {
            console.error(error)
            alert('No fue posible eliminar el vehículo.')
        }
    }

    if (loading) return <Loading message="Cargando vehículos..." fullPage={true} />

    return (
        <>
            <div className="vv-wrapper">
                {/* ── Encabezado ── */}
                <div className="vv-topbar">
                    <div>
                        <h1 className="vv-titulo">Vehículos</h1>
                        <p className="vv-subtitulo">Consulta y administra el inventario de vehículos.</p>
                    </div>
                    {!modoCliente && (
                        <button
                            className="vv-btn-nuevo"
                            onClick={() => navigate('/vehiculos/nuevo')}
                        >
                            <span className="vv-btn-nuevo-icon">+</span>
                            Nuevo vehículo
                        </button>
                    )}
                </div>

                {/* ── Filtros ── */}
                <div className="vv-filtros">
                    <div className="vv-filtro-grupo">
                        <label className="vv-filtro-label">Estado</label>
                        <div className="vv-select-wrapper">
                            <select
                                className="vv-select"
                                value={estado}
                                onChange={e => setEstado(e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                {estados.map(e => (
                                    <option key={e.id} value={e.id}>{e.nombreEstado}</option>
                                ))}
                            </select>
                            <span className="vv-select-arrow">▾</span>
                        </div>
                    </div>

                    <div className="vv-filtro-grupo">
                        <label className="vv-filtro-label">Ciudad</label>
                        <div className="vv-select-wrapper">
                            <select
                                className="vv-select"
                                value={ciudad}
                                onChange={e => setCiudad(e.target.value)}
                                disabled={!estado}
                            >
                                <option value="">Todas las ciudades</option>
                                {ciudades.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombreCiudad}</option>
                                ))}
                            </select>
                            <span className="vv-select-arrow">▾</span>
                        </div>
                    </div>

                    <div className="vv-filtro-grupo">
                        <label className="vv-filtro-label">Sucursal</label>
                        <div className="vv-select-wrapper">
                            <select
                                className="vv-select"
                                value={sucursal}
                                onChange={e => setSucursal(e.target.value)}
                                disabled={!ciudad}
                            >
                                <option value="">Todas las sucursales</option>
                                {sucursales.map(s => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                            <span className="vv-select-arrow">▾</span>
                        </div>
                    </div>
                </div>

                {/* ── Grid ── */}
                {/* idSucursal vacío → el servicio omite el parámetro → backend retorna todos */}
                <GridVehiculos
                    idSucursal={sucursal}
                    vista={vista}
                    modoCliente={modoCliente}
                    onEliminar={handleEliminar}
                />
            </div>

            <style>{`
                .vv-wrapper {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 2rem 1.5rem;
                    font-family: system-ui, -apple-system, sans-serif;
                }

                /* ── Topbar ── */
                .vv-topbar {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 1rem;
                    margin-bottom: 1.75rem;
                    flex-wrap: wrap;
                }

                .vv-titulo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #111827;
                    margin: 0 0 4px;
                }

                .vv-subtitulo {
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin: 0;
                }

                .vv-btn-nuevo {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    height: 40px;
                    padding: 0 1.25rem;
                    background: #4f46e5;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background 0.14s;
                    white-space: nowrap;
                    font-family: inherit;
                }

                .vv-btn-nuevo:hover { background: #4338ca; }

                .vv-btn-nuevo-icon {
                    font-size: 1.1rem;
                    font-weight: 400;
                    line-height: 1;
                }

                /* ── Filtros ── */
                .vv-filtros {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                }

                .vv-filtro-grupo {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    min-width: 180px;
                    flex: 1;
                }

                .vv-filtro-label {
                    font-size: 0.72rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    color: #6b7280;
                }

                .vv-select-wrapper {
                    position: relative;
                }

                .vv-select {
                    width: 100%;
                    height: 40px;
                    padding: 0 36px 0 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    color: #111827;
                    background: #fff;
                    appearance: none;
                    -webkit-appearance: none;
                    cursor: pointer;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    font-family: inherit;
                }

                .vv-select:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,.12);
                }

                .vv-select:disabled {
                    background: #f3f4f6;
                    color: #9ca3af;
                    cursor: not-allowed;
                }

                .vv-select-arrow {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6b7280;
                    font-size: 0.75rem;
                    pointer-events: none;
                }

                @media (max-width: 600px) {
                    .vv-filtros { flex-direction: column; }
                    .vv-filtro-grupo { min-width: unset; }
                    .vv-topbar { flex-direction: column; align-items: flex-start; }
                }
            `}</style>
        </>
    )
}