export default function RowEmpleado({
    empleado,
    onConsultar,
    onEliminar
}) {
    return (
        <>
            <tr className="re-row">
                <td className="re-td re-td-usuario">{empleado.usuario}</td>
                <td className="re-td">{empleado.nombre}</td>
                <td className="re-td">
                    <span className="re-badge-sucursal">{empleado.Sucursal}</span>
                </td>
                <td className="re-td re-td-acciones">
                    <button
                        className="re-btn re-btn-consultar"
                        onClick={() => onConsultar(empleado)}
                    >
                        Consultar
                    </button>
                    <button
                        className="re-btn re-btn-eliminar"
                        onClick={() => onEliminar(empleado.id)}
                    >
                        Eliminar
                    </button>
                </td>
            </tr>

            <style>{`
                .re-row {
                    border-bottom: 1px solid #f3f4f6;
                    transition: background 0.12s;
                }

                .re-row:last-child {
                    border-bottom: none;
                }

                .re-row:hover {
                    background: #f9fafb;
                }

                .re-td {
                    padding: 13px 16px;
                    font-size: 0.875rem;
                    color: #374151;
                    vertical-align: middle;
                }

                .re-td-usuario {
                    font-weight: 600;
                    color: #111827;
                    font-variant-numeric: tabular-nums;
                }

                .re-td-acciones {
                    text-align: center;
                    white-space: nowrap;
                }

                .re-badge-sucursal {
                    display: inline-block;
                    padding: 3px 10px;
                    background: #ede9fe;
                    color: #2821b6;
                    border-radius: 99px;
                    font-size: 0.75rem;
                    font-weight: 500;
                }

                .re-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    height: 32px;
                    padding: 0 14px;
                    border-radius: 6px;
                    font-size: 0.8rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.13s, opacity 0.13s;
                    border: none;
                }

                .re-btn + .re-btn {
                    margin-left: 8px;
                }

                .re-btn-consultar {
                    background: #effff4;
                    color: #127f20;
                    border: 1px solid #bffedb;
                }

                .re-btn-consultar:hover {
                    background: #dbfee7;
                }

                .re-btn-eliminar {
                    background: #fef2f2;
                    color: #b91c1c;
                    border: 1px solid #fecaca;
                }

                .re-btn-eliminar:hover {
                    background: #fee2e2;
                }
            `}</style>
        </>
    )
}