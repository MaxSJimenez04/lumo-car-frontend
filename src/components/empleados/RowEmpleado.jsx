export default function RowEmpleado({
    empleado,
    onConsultar,
    onEliminar
}) {
    return (
        <tr className="rv-row">
            <td className="rv-td">{empleado.usuario}</td>

            <td className="rv-td">
                {empleado.nombre}
            </td>

            <td className="rv-td">
                {empleado.sucursal}
            </td>

            <td className="rv-td">
                <button
                    className="rv-btn rv-btn-editar"
                    onClick={() => onConsultar(empleado)}
                >
                    Consultar
                </button>

                <button 
                    className="rv-btn rv-btn-editar"
                    onClick={() => onEliminar(empleado.id)}
                >
                    Eliminar
                </button>
            </td>
        </tr>
    )
}