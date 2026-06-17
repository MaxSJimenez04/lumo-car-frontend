import { useEffect, useState } from 'react'
import RowEmpleado from './RowEmpleado'
import ModalEmpleado from './ModalEmpleado'
import { consultarEmpleados } from '../../services/usuarios.service'

export default function GridEmpleados({
    idsucursal,
    sucursales = [],
    onEliminar
}) {
    const [empleados, setEmpleados] = useState([])
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null)
    const [mostrarModal, setMostrarModal] = useState(false)

    useEffect(() => {
        cargarEmpleados()
    }, [idsucursal])

    const cargarEmpleados = async () => {
        try {
            const respuesta = await consultarEmpleados(idsucursal)
            setEmpleados(respuesta)
        } catch (error) {
            console.error(error)
        }
    }

    const consultar = (empleado) => {
        setEmpleadoSeleccionado(empleado)
        setMostrarModal(true)
    }

    return (
        <>
            <div className="ge-table-wrapper">
                {empleados.length === 0 ? (
                    <div className="ge-empty">
                        <span className="ge-empty-icon">👤</span>
                        <p>No hay empleados para mostrar.</p>
                    </div>
                ) : (
                    <table className="ge-table">
                        <thead className="ge-thead">
                            <tr>
                                <th className="ge-th">Usuario</th>
                                <th className="ge-th">Nombre</th>
                                <th className="ge-th">Sucursal</th>
                                <th className="ge-th ge-th-actions">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empleados.map(empleado => (
                                <RowEmpleado
                                    key={empleado.id}
                                    empleado={empleado}
                                    onConsultar={consultar}
                                    onEliminar={onEliminar}
                                />
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {mostrarModal && (
                <ModalEmpleado
                    empleado={empleadoSeleccionado}
                    sucursales={sucursales}
                    onClose={() => setMostrarModal(false)}
                />
            )}

            <style>{`
                .ge-table-wrapper {
                    width: 100%;
                    overflow-x: auto;
                    border-radius: 12px;
                    border: 1px solid #e5e7eb;
                    background: #fff;
                    box-shadow: 0 1px 4px rgba(0,0,0,.06);
                }

                .ge-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-family: system-ui, -apple-system, sans-serif;
                    font-size: 0.875rem;
                    color: #111827;
                }

                .ge-thead {
                    background: #f9fafb;
                    border-bottom: 1px solid #e5e7eb;
                }

                .ge-th {
                    padding: 12px 16px;
                    text-align: left;
                    font-size: 0.72rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    color: #6b7280;
                    white-space: nowrap;
                }

                .ge-th-actions {
                    text-align: center;
                }

                .ge-empty {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 1rem;
                    color: #9ca3af;
                    gap: 10px;
                    font-size: 0.9rem;
                    font-family: system-ui, -apple-system, sans-serif;
                }

                .ge-empty-icon {
                    font-size: 2.5rem;
                    opacity: .5;
                }
            `}</style>
        </>
    )
}