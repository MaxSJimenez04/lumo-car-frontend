import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registro } from "../../services/usuarios.service";

export default function RegistroForm({
    idRol
}){
    const navigate = useNavigate()
    const [nombre, setNombre] = useState("")
    const [usuario , setUsuario] = useState("")
    const [correo, setCorreo] = useState("")
    const [apellidos, setApellidos] = useState("")
    const [telefono, setTelefono] = useState("")
    const[fecha, setFecha] = useState(new Date(2000,0,1))
    const [contrasena, setContrasena] = useState("")
    const [showPassword, setShowPassword] = useState("")
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
           const respuesta = registro(datosUsuario)

           navigate("/login")
        } catch (err) {
            console.log(err);
            setError(respuesta?.data?.mensaje || "Error al registrar al usuario")
            
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
                    onChange={(e) => 
                        setUsuario(e.target.value)
                    }
                    maxLength={255}
                    required/>

                    <label className="floating-label">
                        Usuario
                    </label>
                </div>

                <div className="input-container">

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

               {
                error && (
                    <p style={{color:"white"}}>{error}</p>
                )
               } 
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
                    onChange={(e) => 
                        setTelefono(e.target.value)
                    }
                    pattern="^\+52\d{10}"
                    required
                    />

                    <label className="floating-label">
                        Teléfono
                    </label>
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