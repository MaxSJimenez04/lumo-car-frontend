import { useEffect, useState } from 'react'
import RowEmpleado from './RowEmpleado'
import ModalEmpleado from './ModalEmpleado'
import {consultarEmpleados} from '../../services/usuarios.service'

export default function GridEmpleados({
    idsucursal,
    sucursales = [],
    onNuevo,
    onEliminar
}) {

    const [empleados, setEmpleados] = useState([])
    const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null)
    const [mostrarModal, setMostrarModal] = useState(false)

    useEffect(() => {
        cargarEmpleados();
    }, [idsucursal]);

    const cargarEmpleados = async () => {
        try {
            console.log(idsucursal);
            
            const respuesta = await consultarEmpleados(idsucursal);
            console.log(respuesta);
            
            setEmpleados(respuesta);

        } catch (error) {
            console.error(error);
        }
    };

    const consultar = (empleado) => {
        setEmpleadoSeleccionado(empleado)
        setMostrarModal(true)
    }


    return (
        <>
            <div className="toolbar">
                <button onClick={onNuevo}>
                    Nuevo
                </button>

            </div>

            <table className="table">
                <thead>
                    <tr>
                        <th>Usuario</th>
                        <th>Nombre</th>
                        <th>Sucursal</th>
                        <th>Acciones</th>
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

            {mostrarModal && (
                <ModalEmpleado
                    empleado={empleadoSeleccionado}
                    sucursales={sucursales}
                    onClose={() => setMostrarModal(false)}
                />
            )}
        </>
    )
}