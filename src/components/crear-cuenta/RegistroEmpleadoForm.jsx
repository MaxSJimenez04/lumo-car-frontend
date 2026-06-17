import { useEffect, useState } from "react"
import { registro } from "../../services/usuarios.service"
import { consultaGeneralSucursales } from "../../services/sucursales.service"



export default function RegistroEmpleadoForm({ idRol }) {
    const [nombre, setNombre] = useState("")
    const [usuario, setUsuario] = useState("")
    const [correo, setCorreo] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [telefono, setTelefono] = useState("")
    const [fecha, setFecha] = useState("2000-01-01")
    const [contrasena, setContrasena] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [sucursales, setSucursales] = useState([])
    const [idSucursal, setIdSucursal] = useState("")
    const [mensaje, setMensaje] = useState("")

    useEffect(() => {
        const cargarSucursales = async () => {
            try {
                const respuesta = await consultaGeneralSucursales()
                setSucursales(respuesta)
            } catch (err) {
                console.error(err)
            }
        }
        cargarSucursales()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        const [ano, mes, dia] = fecha.split("-")
        const datosUsuario = {
            usuario,
            contrasena,
            nombre,
            apellidos,
            correo,
            telefono,
            fecha: {
                ano: Number(ano),
                mes: Number(mes),
                dia: Number(dia),
            },
            idRol,
            idSucursal: Number(idSucursal),
        }
        try {
            await registro(datosUsuario)
            setMensaje("Empleado registrado correctamente.")
            setError("")
            setUsuario("")
            setContrasena("")
            setNombre("")
            setApellidos("")
            setTelefono("")
            setCorreo("")
            setFecha("2000-01-01")
            setIdSucursal("")
        } catch (err) {
            console.log(err)
            setMensaje("")
            setError(err?.response?.data?.mensaje || "Error al registrar al usuario.")
        }
    }

    return (
        <>
            <style>{styles}</style>
            <div className="reg-wrapper">
                <div className="reg-card">
                    <div className="reg-header">
                        <h2>Registro de Empleado</h2>
                        <p>Complete todos los campos requeridos</p>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="reg-row">
                            <div className="reg-field">
                                <label htmlFor="reg-nombre">Nombre</label>
                                <input
                                    id="reg-nombre"
                                    type="text"
                                    value={nombre}
                                    onChange={(e) => setNombre(e.target.value)}
                                    maxLength={255}
                                    required
                                />
                            </div>
                            <div className="reg-field">
                                <label htmlFor="reg-apellidos">Apellido(s)</label>
                                <input
                                    id="reg-apellidos"
                                    type="text"
                                    value={apellidos}
                                    onChange={(e) => setApellidos(e.target.value)}
                                    maxLength={255}
                                    required
                                />
                            </div>
                        </div>

                        <div className="reg-field">
                            <label htmlFor="reg-usuario">Usuario</label>
                            <input
                                id="reg-usuario"
                                type="text"
                                value={usuario}
                                onChange={(e) => setUsuario(e.target.value)}
                                maxLength={255}
                                required
                            />
                        </div>

                        <div className="reg-field">
                            <label htmlFor="reg-contrasena">Contraseña</label>
                            <div className="reg-password-wrap">
                                <input
                                    id="reg-contrasena"
                                    type={showPassword ? "text" : "password"}
                                    value={contrasena}
                                    onChange={(e) => setContrasena(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="reg-toggle-pw"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                                >
                                    {showPassword ? "🙈" : "👁"}
                                </button>
                            </div>
                        </div>

                        <div className="reg-divider" />

                        <div className="reg-row">
                            <div className="reg-field">
                                <label htmlFor="reg-telefono">Teléfono</label>
                                <input
                                    id="reg-telefono"
                                    type="tel"
                                    value={telefono}
                                    onChange={(e) => setTelefono(e.target.value)}
                                    pattern="^\+52\d{10}"
                                    placeholder="+52"
                                    required
                                />
                            </div>
                            <div className="reg-field">
                                <label htmlFor="reg-fecha">Fecha de Nacimiento</label>
                                <input
                                    id="reg-fecha"
                                    type="date"
                                    value={fecha}
                                    onChange={(e) => setFecha(e.target.value)}
                                    min="1900-12-31"
                                    max="2008-12-31"
                                    required
                                />
                            </div>
                        </div>

                        <div className="reg-field">
                            <label htmlFor="reg-correo">Correo electrónico</label>
                            <input
                                id="reg-correo"
                                type="email"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                maxLength={255}
                                required
                            />
                        </div>

                        <div className="reg-field">
                            <label htmlFor="reg-sucursal">Sucursal</label>
                            <select
                                id="reg-sucursal"
                                value={idSucursal}
                                onChange={(e) => setIdSucursal(e.target.value)}
                                required
                            >
                                <option value="">Seleccione una sucursal</option>
                                {sucursales.map((sucursal) => (
                                    <option key={sucursal.id} value={sucursal.id}>
                                        {sucursal.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {mensaje && <div className="reg-msg-success">{mensaje}</div>}
                        {error && <div className="reg-msg-error">{error}</div>}

                        <button type="submit" className="reg-submit">
                            Registrar Empleado
                        </button>
                    </form>
                </div>
            </div>
        </>
    )
}

const styles = `
  .reg-wrapper {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f4f1;
    font-family: 'Georgia', serif;
    padding: 2rem;
  }

  .reg-card {
    background: #ffffff;
    border: 1px solid #c4d9c8;
    border-radius: 2px;
    padding: 2.5rem 3rem;
    width: 100%;
    max-width: 520px;
    box-shadow: 0 2px 12px rgba(74, 130, 90, 0.08);
  }

  .reg-header {
    margin-bottom: 2rem;
    padding-bottom: 1.25rem;
    border-bottom: 2px solid #6aad7c;
  }

  .reg-header h2 {
    margin: 0 0 0.25rem 0;
    font-size: 1.4rem;
    font-weight: 700;
    color: #1e3d28;
    letter-spacing: 0.01em;
  }

  .reg-header p {
    margin: 0;
    font-size: 0.8rem;
    color: #6b8872;
    font-family: 'Arial', sans-serif;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .reg-field {
    margin-bottom: 1.25rem;
  }

  .reg-field label {
    display: block;
    font-size: 0.72rem;
    font-family: 'Arial', sans-serif;
    font-weight: 600;
    color: #3a5e45;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin-bottom: 0.4rem;
  }

  .reg-field input,
  .reg-field select {
    width: 100%;
    box-sizing: border-box;
    padding: 0.65rem 0.85rem;
    border: 1px solid #b8d4be;
    border-radius: 2px;
    font-size: 0.95rem;
    font-family: 'Arial', sans-serif;
    color: #1e3d28;
    background-color: #fafcfa;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    outline: none;
    appearance: none;
  }

  .reg-field input:focus,
  .reg-field select:focus {
    border-color: #6aad7c;
    box-shadow: 0 0 0 3px rgba(106, 173, 124, 0.15);
    background-color: #ffffff;
  }

  .reg-field select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236aad7c' d='M6 8L1 3h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.85rem center;
    padding-right: 2.25rem;
    cursor: pointer;
  }

  .reg-password-wrap {
    position: relative;
  }

  .reg-password-wrap input {
    padding-right: 2.75rem;
  }

  .reg-toggle-pw {
    position: absolute;
    right: 0.7rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    color: #6aad7c;
    padding: 0.2rem;
    line-height: 1;
  }

  .reg-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .reg-divider {
    height: 1px;
    background: #ddeee1;
    margin: 1.5rem 0;
  }

  .reg-submit {
    width: 100%;
    padding: 0.8rem;
    background-color: #4a9660;
    color: #ffffff;
    border: none;
    border-radius: 2px;
    font-size: 0.88rem;
    font-family: 'Arial', sans-serif;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: background-color 0.15s ease;
    margin-top: 0.5rem;
  }

  .reg-submit:hover {
    background-color: #3a7a4e;
  }

  .reg-submit:active {
    background-color: #2e6040;
  }

  .reg-msg-success {
    margin-top: 1rem;
    padding: 0.65rem 0.85rem;
    background: #eaf6ed;
    border-left: 3px solid #6aad7c;
    border-radius: 2px;
    font-size: 0.85rem;
    font-family: 'Arial', sans-serif;
    color: #2e6040;
  }

  .reg-msg-error {
    margin-top: 1rem;
    padding: 0.65rem 0.85rem;
    background: #fdf0f0;
    border-left: 3px solid #c0392b;
    border-radius: 2px;
    font-size: 0.85rem;
    font-family: 'Arial', sans-serif;
    color: #922b21;
  }
`