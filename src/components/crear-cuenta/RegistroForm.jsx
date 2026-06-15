import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registro } from "../../services/usuarios.service";

export default function RegistroForm({
    idRol
}){
    const navigate = useNavigate()
    const [nombre, setNombre] = useState("")
    const [usuario , setUsuario] = useState("")
    const [usuarioError, setUsuarioError] = useState("")
    const [correo, setCorreo] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [telefono, setTelefono] = useState("+52")
    const [telefonoError, setTelefonoError] = useState("")
    const[fecha, setFecha] = useState(new Date(2000,0,1))
    const [contrasena, setContrasena] = useState("")
    const [showPassword, setShowPassword] = useState("")
    const requisitos = [
        { label: "Mínimo 8 caracteres", cumplido: contrasena.length >= 8 },
        { label: "Al menos 1 número", cumplido: /\d/.test(contrasena) },
        { label: "Al menos 1 carácter especial", cumplido: /[^a-zA-Z0-9]/.test(contrasena) },
    ]
    const [error, setError] = useState("")
    

    const handleSubmit = async(e) => {
        e.preventDefault()
        const [ano,mes,dia] = fecha.split("-")
        const datosUsuario = {
            usuario,
            contrasena,
            nombre, 
            apellidos,
            correo,
            telefono,
            fecha:{
                ano: Number(ano),
                mes: Number(mes),
                dia: Number(dia)
            },
            idRol
        }
        try {
            setError("")
            await registro(datosUsuario)
            navigate("/login")
        } catch (err) {
            if (err.response) {
                setError(err.response.data?.mensaje || "Error al registrar al usuario")
            } else {
                setError("No se pudo conectar con el servidor. Intenta más tarde.")
            }
        }
    }

    return(
        <>
            <form onSubmit={handleSubmit}>
                <div className="registro-form">
                    <div className="input-container">
                    <input type="text"
                    className="floating-input"
                    placeholder=""
                    value={usuario}
                    onChange={(e) => {
                        const valor = e.target.value
                        setUsuario(valor)
                        if (valor && valor.length < 5) {
                            setUsuarioError("Mínimo 5 caracteres")
                        } else {
                            setUsuarioError("")
                        }
                    }}
                    maxLength={100}
                    minLength={5}
                    required/>

                    <label className="floating-label">
                        Usuario
                    </label>

                    {usuarioError && (
                        <span className="input-hint error">{usuarioError}</span>
                    )}
                </div>

                <div className="input-container">
                <div className="input-password-wrapper">
                <input
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    className="floating-input"
                    placeholder=" "
                    value={contrasena}
                    onChange={(e) =>
                        setContrasena(
                            e.target.value
                        )
                    }
                    required
                />

                <label className="floating-label">
                    Contraseña
                </label>

                <button
                    type="button"
                    className="toggle-password"
                    onClick={() =>
                        setShowPassword(
                            !showPassword
                        )
                    }
                >
                    👁
                </button>
                </div>

                {contrasena && (
                    <ul className="password-requisitos">
                        {requisitos.map((r) => (
                            <li key={r.label} className={r.cumplido ? "cumplido" : ""}>
                                {r.cumplido ? "✓" : "✗"} {r.label}
                            </li>
                        ))}
                    </ul>
                )}

            </div>

                <div className="input-container">
                    <input type="text"
                    className="floating-input"
                    placeholder=""
                    value={nombre}
                    onChange={(e) => 
                        setNombre(e.target.value)
                    }
                    maxLength={255}
                    required/>

                    <label className="floating-label">
                        Nombre
                    </label>
                </div>

                <div className="input-container">
                    <input type="text"
                    className="floating-input"
                    placeholder=""
                    value={apellidos}
                    onChange={(e) => 
                        setApellidos(e.target.value)
                    }
                    maxLength={255}
                    required/>

                    <label className="floating-label">
                        Apellido(s)
                    </label>
                </div>

                <div className="input-container">
                    <input type="tel"
                    className="floating-input"
                    placeholder=""
                    value={telefono}
                    onFocus={(e) => {
                        const len = e.target.value.length
                        e.target.setSelectionRange(len, len)
                    }}
                    onChange={(e) => {
                        const raw = e.target.value
                        if (!raw.startsWith("+52")) return
                        const valor = "+52" + raw.slice(3).replace(/\D/g, "")
                        setTelefono(valor)
                        if (!/^\+52\d{10}$/.test(valor)) {
                            setTelefonoError("Ej: +5214771234567")
                        } else {
                            setTelefonoError("")
                        }
                    }}
                    maxLength={13}
                    pattern="^\+52\d{10}$"
                    required
                    />

                    <label className="floating-label">
                        Teléfono
                    </label>

                    {telefonoError
                        ? <span className="input-hint error">{telefonoError}</span>
                        : <span className="input-hint">+52 seguido de 10 dígitos</span>
                    }
                </div>
                
                <div className="input-container">
                    <input type="email"
                    className="floating-input"
                    placeholder=""
                    value={correo}
                    onChange={(e) => 
                        setCorreo(e.target.value)
                    }
                    maxLength={255}
                    required/>

                    <label className="floating-label">
                        Correo
                    </label>
                </div>

                <div className="input-container">
                    <input type="date"
                    className="floating-input"
                    placeholder=""
                    value={fecha}
                    onChange={(e) => 
                        setFecha(e.target.value)
                    }
                    maxLength={255}
                    required
                    min={"1900-12-31"}
                    max={"2008-12-31"}/>

                    <label className="floating-label">
                        Fecha de Nacimiento
                    </label>
                </div>
                </div>
                

                {error && (
                    <p className="form-error">{error}</p>
                )}

                <button
                type="submit"
                className="login-btn"
                >
                Registrarme
            </button>

            </form>

             

            <div className="signup-link">
                <p>
                    ¿Ya tienes una cuenta?
                    {" "}
                    <Link to={"/login"}>
                    Inicia Sesión
                    </Link>
                </p>
            </div>
        </>
    )
}