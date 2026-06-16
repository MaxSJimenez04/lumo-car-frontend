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
            {/* Usamos 'glass-card' que es el estilo aplicado en tus otros modales */}
            <div className="glass-card" style={{ width: '100%', maxWidth: '450px', padding: '24px' }}>
                <h2 style={{ marginBottom: '20px' }}>Perfil del empleado</h2>

                <div className="input-container">
                    <label>Usuario</label>
                    <input className="floating-input" value={empleado.usuario} disabled />
                </div>

                <div className="input-container">
                    <label>Nombre</label>
                    <input className="floating-input" value={empleado.nombre} disabled />
                </div>

                <div className="input-container">
                    <label>Sucursal</label>
                    <select 
                        className="floating-input"
                        value={idsucursal}
                        onChange={(e) => setIdSucursal(e.target.value)}
                    >
                        {sucursales.map(sucursal => (
                            <option key={sucursal.id} value={sucursal.id}>
                                {sucursal.nombre}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="acciones" style={{ marginTop: '20px', gap: '10px' }}>
                    <button className="login-btn" onClick={guardar}>Guardar</button>
                    <button className="rv-btn rv-btn-eliminar" onClick={onClose}>Cerrar</button>
                </div>
            </div>
        </div>
    )
}