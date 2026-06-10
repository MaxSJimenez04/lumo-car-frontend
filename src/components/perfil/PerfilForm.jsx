import { useEffect, useState } from "react";
import { consultarPerfil, actualizar, consultarFoto ,asociarFoto } from "../../services/usuarios.service";
import { subirFotoPerfil } from "../../services/archivos.service";
import { obtenerUsuario } from "../../utils/auth";

export default function PerfilForm(){
    const [datosUsuario, setDatos] = useState({
        nombre: "",
        apellidos: "",
        correo: "",
        telefono:"",
        usuario: "",
        fecha:"",
    })
    const [idFoto, setIdFoto] = useState(null)
    const [imagenPerfil, setFoto] = useState(null);
    const [archivoFoto, setArchivoFoto] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [loading, setLoading] = useState(true);
    const [datosOriginales, setDatosOriginales] = useState(null);
    const [imagenOriginal, setImagenOriginal] = useState(null);

   useEffect(() => {

    const cargarPerfil = async () => {

        try {

            const usuario = obtenerUsuario();

            const [respuesta, respuestaFoto] = await Promise.all([
                consultarPerfil(usuario),
                consultarFoto(usuario)
            ]);

            const imagenURL = URL.createObjectURL(respuestaFoto)

            const datos = {
                nombre: respuesta.nombre ?? "",
                apellidos: respuesta.apellidos ?? "",
                correo: respuesta.correo ?? "",
                telefono: respuesta.telefono ?? "",
                fecha: respuesta.fecha_nacimiento ?? "",
                usuario: usuario ?? ""
            }

            setDatos(datos);
            setDatosOriginales(datos);

            setFoto(imagenURL);
            setImagenOriginal(imagenURL);

        }
        catch (error) {
            console.error(error)
        }
        finally {
            setLoading(false)
        }

    };

        cargarPerfil()

    }, [])

    useEffect(() => {
    return () => {
        if (imagenPerfil && imagenPerfil.startsWith("blob:")) {
            URL.revokeObjectURL(imagenPerfil)
        }
    };
    }, [imagenPerfil]);

    const handleSumbit = async (e) => {
        e.preventDefault()
        try {
            const formData = new FormData();
            if (archivoFoto) {

                const nuevoNombre = generarNombreArchivo(
                datosUsuario.usuario,
                archivoFoto
                );

                const archivoRenombrado = new File(
                    [archivoFoto],
                    nuevoNombre,
                    {
                        type: archivoFoto.type
                    }
                );

                formData.append(
                    "file",
                    archivoRenombrado
                );
                formData.append("carpeta", "usuarios");

                const respuestaFoto = await subirFotoPerfil(formData)

                // suponiendo que regresa id o url
                setIdFoto(respuestaFoto.detalles.id)

                const usuarioActualizado = {
                    nombre: datosUsuario.nombre,
                    apellidos: datosUsuario.apellidos,
                    correo: datosUsuario.correo,
                    telefono: datosUsuario.telefono,
                    usuario: datosUsuario.usuario,
                    fecha: datosUsuario.fecha, // puede ser null si no cambió imagen 
                }
            }
            if (idFoto) {
                await asociarFoto(datosUsuario.usuario, idFoto);
            }

            const respuestaUsuario = await actualizar(datosUsuario, datosUsuario.usuario)

            console.log("Perfil actualizado:", respuestaUsuario);

            setModoEdicion(false);
        } catch (error) {
            console.error(error);
            
        }
    }

    const handleCancelar = () => {
        setModoEdicion(false);

        // restaurar datos
        setDatos(datosOriginales);

        // restaurar imagen
        setFoto(imagenOriginal);

        // limpiar archivo nuevo seleccionado
        setArchivoFoto(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setDatos(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFotoChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        setArchivoFoto(file);

        const previewUrl = URL.createObjectURL(file);
        setFoto(previewUrl);
    };

    const generarNombreArchivo = (usuario, file) => {
    const extension = file.name.split('.').pop();

    const timestamp = new Date()
        .toISOString()
        .replace(/[-:.TZ]/g, ""); // limpio para filename

    return `${usuario}_${timestamp}.${extension}`;
};

    return (
        <div className="perfil-view">

            <div className="perfil-header">
                <h2>Mi Perfil</h2>

                <button type="button"
                 onClick={(e) =>setModoEdicion(true)}>
                    Editar Perfil
                </button>
            </div>

            <form className="perfil-form" onSubmit={handleSumbit}>

                {/* Foto de perfil */}
                <div className="profile-photo-wrapper">
                    <img
                        src={imagenPerfil || "/default-profile.png"}
                        alt="Foto de perfil"
                        className="perfil-image"
                    />

                    {modoEdicion && (
                        <>
                            <div className="photo-overlay"></div>

                            <label className="photo-edit-btn">
                                Cambiar
                                <input
                                    type="file"
                                    accept="image/*"
                                    hidden
                                    onChange={handleFotoChange}
                                />
                            </label>
                        </>
                    )}
                </div>

                {/* Nombre */}
                <div className="input-container">
                    <label>Nombre</label>
                    <input
                        type="text"
                        name="nombre"
                        value={datosUsuario.nombre}
                        readOnly ={!modoEdicion}
                        onChange={handleChange}
                    />
                </div>

                {/* Apellidos */}
                <div className="input-container">
                    <label>Apellidos</label>
                    <input
                        type="text"
                        name="apellidos"
                        value={datosUsuario.apellidos}
                        readOnly = {!modoEdicion}
                        onChange={handleChange}
                    />
                </div>

                {/* Usuario */}
                <div className="input-container">
                    <label>Usuario</label>
                    <input
                        type="text"
                        name="usuario"
                        value={datosUsuario.usuario}
                        readOnly = {!modoEdicion}
                        onChange={handleChange}
                    />
                </div>

                {/* Correo */}
                <div className="input-container">
                    <label>Correo</label>
                    <input
                        type="email"
                        name="correo"
                        value={datosUsuario.correo}
                        readOnly = {!modoEdicion}
                        onChange={handleChange}
                    />
                </div>

                {/* Teléfono */}
                <div className="input-container">
                    <label>Teléfono</label>
                    <input
                        type="tel"
                        name="telefono"
                        value={datosUsuario.telefono}
                        readOnly = {!modoEdicion}
                        onChange={handleChange}
                    />
                </div>

                {/* Fecha de nacimiento (siempre sólo lectura) */}
                <div className="input-container">
                    <label>Fecha de Nacimiento</label>
                    <input
                        type="date"
                        name="fecha"
                        value={datosUsuario.fecha}
                        readOnly
                    />
                </div>

                <div className="perfil-actions">
                    <button type="submit">
                        Guardar Cambios
                    </button>

                    <button type="button"
                    onClick={handleCancelar}>
                        Cancelar
                    </button>
                </div>

            </form>

        </div>
    )
}