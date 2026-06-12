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

    const guardar = async () => {
        try {
            console.log({
                idEmpleado: empleado.id,
                idsucursal
            })

            await cambiarSucursal(empleado.usuario, idsucursal)
            onClose()
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="modal-backdrop">
            <div className="modal">

                <h2>Perfil del empleado</h2>

                <div>
                    <label>Usuario</label>
                    <input
                        value={empleado.usuario}
                        disabled
                    />
                </div>

                <div>
                    <label>Nombre</label>
                    <input
                        value={empleado.nombre}
                        disabled
                    />
                </div>

                <div>
                    <label>Sucursal</label>

                    <select
                        value={idsucursal}
                        onChange={(e) =>
                            setIdSucursal(e.target.value)
                        }
                    >
                        {sucursales.map(sucursal => (
                            <option
                                key={sucursal.id}
                                value={sucursal.id}
                            >
                                {sucursal.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="acciones">
                    <button onClick={guardar}>
                        Guardar
                    </button>

                    <button onClick={onClose}>
                        Cerrar
                    </button>
                </div>

            </div>
        </div>
    )
}