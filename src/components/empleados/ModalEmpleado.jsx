import { useState } from 'react'
import { cambiarSucursal } from '../../services/usuarios.service'

export default function ModalEmpleado({
    empleado,
    sucursales,
    onClose
}) {
    const [idsucursal, setIdSucursal] = useState(
        empleado?.idSucursal || ''
    )
    const [guardando, setGuardando] = useState(false)
    const [error, setError] = useState(null)

    const guardar = async () => {
        setError(null)
        setGuardando(true)
        try {
            await cambiarSucursal(empleado.usuario, idsucursal)
            onClose()
        } catch (error) {
            console.error(error)
            setError('No se pudo actualizar la sucursal.')
        } finally {
            setGuardando(false)
        }
    }

    return (
        <>
            <div className="me-backdrop" onClick={onClose}>
                <div
                    className="me-card"
                    onClick={e => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="me-header">
                        <div>
                            <p className="me-eyebrow">Empleado</p>
                            <h2 className="me-titulo">{empleado.nombre}</h2>
                        </div>
                        <button
                            className="me-btn-cerrar"
                            onClick={onClose}
                            aria-label="Cerrar"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Alerta */}
                    {error && (
                        <div className="me-alerta">
                            <span>✕</span> {error}
                        </div>
                    )}

                    {/* Campos */}
                    <div className="me-campo">
                        <label className="me-label">Usuario</label>
                        <input
                            className="me-input"
                            value={empleado.usuario}
                            disabled
                        />
                    </div>

                    <div className="me-campo">
                        <label className="me-label">Nombre completo</label>
                        <input
                            className="me-input"
                            value={empleado.nombre}
                            disabled
                        />
                    </div>

                    <div className="me-campo">
                        <label className="me-label">Sucursal asignada</label>
                        <select
                            className="me-select"
                            value={idsucursal}
                            onChange={e => setIdSucursal(e.target.value)}
                        >
                            <option value="">Seleccionar sucursal…</option>
                            {sucursales.map(sucursal => (
                                <option key={sucursal.id} value={sucursal.id}>
                                    {sucursal.nombre}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Acciones */}
                    <div className="me-acciones">
                        <button
                            className="me-btn me-btn-sec"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="me-btn me-btn-pri"
                            onClick={guardar}
                            disabled={guardando}
                        >
                            {guardando ? 'Guardando…' : 'Guardar'}
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
                .me-backdrop {
                    position: fixed;
                    inset: 0;
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(3px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 1rem;
                }

                .me-card {
                    background: #fff;
                    border-radius: 14px;
                    padding: 1.75rem;
                    width: 100%;
                    max-width: 440px;
                    box-shadow: 0 20px 60px rgba(0,0,0,.18);
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }

                .me-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid #f3f4f6;
                }

                .me-eyebrow {
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #6366f1;
                    margin: 0 0 4px;
                }

                .me-titulo {
                    font-size: 1.15rem;
                    font-weight: 700;
                    margin: 0;
                    color: #111827;
                }

                .me-btn-cerrar {
                    background: none;
                    border: none;
                    font-size: 1rem;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 6px;
                    transition: background 0.12s, color 0.12s;
                    line-height: 1;
                }

                .me-btn-cerrar:hover {
                    background: #f3f4f6;
                    color: #374151;
                }

                .me-alerta {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 0.65rem 1rem;
                    background: #fef2f2;
                    color: #991b1b;
                    border: 1px solid #fecaca;
                    border-radius: 8px;
                    font-size: 0.85rem;
                }

                .me-campo {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }

                .me-label {
                    font-size: 0.78rem;
                    font-weight: 500;
                    color: #374151;
                }

                .me-input,
                .me-select {
                    height: 40px;
                    padding: 0 12px;
                    border: 1px solid #d1d5db;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    color: #111827;
                    background: #f9fafb;
                    transition: border-color 0.15s, box-shadow 0.15s;
                    font-family: inherit;
                    appearance: none;
                    -webkit-appearance: none;
                }

                .me-input:disabled {
                    background: #f3f4f6;
                    color: #6b7280;
                    cursor: not-allowed;
                }

                .me-select {
                    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
                    background-repeat: no-repeat;
                    background-position: right 12px center;
                    padding-right: 36px;
                    cursor: pointer;
                }

                .me-select:focus,
                .me-input:focus {
                    outline: none;
                    border-color: #63f189;
                    box-shadow: 0 0 0 3px rgba(99,102,241,.12);
                    background: #fff;
                }

                .me-acciones {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding-top: 0.5rem;
                    border-top: 1px solid #f3f4f6;
                }

                .me-btn {
                    height: 38px;
                    padding: 0 1.25rem;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.13s, opacity 0.13s;
                    font-family: inherit;
                }

                .me-btn-pri {
                    background: #46e583;
                    color: #fff;
                    border: none;
                }

                .me-btn-pri:hover    { background: #38ca5f; }
                .me-btn-pri:disabled { opacity: .6; cursor: not-allowed; }

                .me-btn-sec {
                    background: #fff;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }

                .me-btn-sec:hover { background: #f9fafb; }
            `}</style>
        </>
    )
}