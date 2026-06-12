export default function RowEmpleado({
    empleado,
    onConsultar,
    onEliminar
}) {
    return (
        <tr>
            <td>{empleado.usuario}</td>

            <td>
                {empleado.nombre}
            </td>

            <td>
                {empleado.sucursal}
            </td>

            <td>
                <button
                    onClick={() => onConsultar(empleado)}
                >
                    Consultar
                </button>

                <button
                    onClick={() => onEliminar(empleado.id)}
                >
                    Eliminar
                </button>
            </td>
        </tr>
    )
}