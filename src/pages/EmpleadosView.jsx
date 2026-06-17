import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GridEmpleados from '../components/empleados/GridEmpleados'
import { eliminar } from '../services/usuarios.service'
import { consultarEstados, consultarCiudades, consultarSucursales } from '../services/sucursales.service'
import Loading from '../components/common/Loading'

export default function EmpleadosView() {
    const navigate = useNavigate()

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

    // ── Acciones ─────────────────────────────────────────────────────────
    const nuevoEmpleado = () => navigate('/empleados/nuevo')

    const eliminarEmpleado = async (idEmpleado) => {
        if (!window.confirm('¿Desea eliminar este empleado?')) return
        try {
            await eliminar(idEmpleado)
        } catch (error) {
            console.error(error)
            alert('No fue posible eliminar el empleado.')
        }
    }

    if (loading) return <Loading message="Cargando empleados..." fullPage={true} />

    return (
        <>
            <div className="ev-wrapper">
                {/* ── Encabezado ── */}
                <div className="ev-topbar">
                    <div>
                        <h1 className="ev-titulo">Empleados</h1>
                        <p className="ev-subtitulo">Gestiona el personal registrado en el sistema.</p>
                    </div>
                    <button className="ev-btn-nuevo" onClick={nuevoEmpleado}>
                        <span className="ev-btn-nuevo-icon">+</span>
                        Nuevo empleado
                    </button>
                </div>

                {/* ── Filtros ── */}
                <div className="ev-filtros">
                    <div className="ev-filtro-grupo">
                        <label className="ev-filtro-label">Estado</label>
                        <div className="ev-select-wrapper">
                            <select
                                className="ev-select"
                                value={estado}
                                onChange={e => setEstado(e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                {estados.map(e => (
                                    <option key={e.id} value={e.id}>{e.nombreEstado}</option>
                                ))}
                            </select>
                            <span className="ev-select-arrow">▾</span>
                        </div>
                    </div>

                    <div className="ev-filtro-grupo">
                        <label className="ev-filtro-label">Ciudad</label>
                        <div className="ev-select-wrapper">
                            <select
                                className="ev-select"
                                value={ciudad}
                                onChange={e => setCiudad(e.target.value)}
                                disabled={!estado}
                            >
                                <option value="">Todas las ciudades</option>
                                {ciudades.map(c => (
                                    <option key={c.id} value={c.id}>{c.nombreCiudad}</option>
                                ))}
                            </select>
                            <span className="ev-select-arrow">▾</span>
                        </div>
                    </div>

                    <div className="ev-filtro-grupo">
                        <label className="ev-filtro-label">Sucursal</label>
                        <div className="ev-select-wrapper">
                            <select
                                className="ev-select"
                                value={sucursal}
                                onChange={e => setSucursal(e.target.value)}
                                disabled={!ciudad}
                            >
                                <option value="">Todas las sucursales</option>
                                {sucursales.map(s => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                            <span className="ev-select-arrow">▾</span>
                        </div>
                    </div>
                </div>

                {/* ── Grid ── */}
                <GridEmpleados
                    idsucursal={sucursal}
                    sucursales={sucursales}
                    onEliminar={eliminarEmpleado}
                />
            </div>

            <style>{`
                .ev-wrapper {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 2rem 1.5rem;
                    font-family: system-ui, -apple-system, sans-serif;
                }

                /* ── Topbar ── */
                .ev-topbar {
                    display: flex;
                    align-items: flex-end;
                    justify-content: space-between;
                    gap: 1rem;
                    margin-bottom: 1.75rem;
                    flex-wrap: wrap;
                }

                .ev-titulo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: #111827;
                    margin: 0 0 4px;
                }

                .ev-subtitulo {
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin: 0;
                }

                .ev-btn-nuevo {
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

                .ev-btn-nuevo:hover { background: #4338ca; }

                .ev-btn-nuevo-icon {
                    font-size: 1.1rem;
                    font-weight: 400;
                    line-height: 1;
                }

                /* ── Filtros ── */
                .ev-filtros {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1.5rem;
                    flex-wrap: wrap;
                }

                .ev-filtro-grupo {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                    min-width: 180px;
                    flex: 1;
                }

                .ev-filtro-label {
                    font-size: 0.72rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    color: #6b7280;
                }

                .ev-select-wrapper {
                    position: relative;
                }

                .ev-select {
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

                .ev-select:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,.12);
                }

                .ev-select:disabled {
                    background: #f3f4f6;
                    color: #9ca3af;
                    cursor: not-allowed;
                }

                .ev-select-arrow {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: #6b7280;
                    font-size: 0.75rem;
                    pointer-events: none;
                }

                @media (max-width: 600px) {
                    .ev-filtros { flex-direction: column; }
                    .ev-filtro-grupo { min-width: unset; }
                    .ev-topbar { flex-direction: column; align-items: flex-start; }
                }
            `}</style>
        </>
    )
}