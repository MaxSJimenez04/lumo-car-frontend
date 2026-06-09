import { useEffect, useState } from "react";
import { consultarPerfil, actualizar, consultarFoto ,asociarFoto } from "../../services/usuarios.service";
import { subirArchivo } from "../../services/archivos.service";
import { obtenerUsuario } from "../../utils/auth";

export default function PerfilClienteForm(){
    const [datosUsuario, setDatos] = useState({
        nombre: "",
        apellidos: "",
        correo: "",
        telefono:"",
        usuario: "",
        fecha:"",
    })

    const [imagenPerfil, setFoto] = useState(null);
    const [archivoFoto, setArchivoFoto] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [loading, setLoading] = useState(true);

   useEffect(() => {

    const cargarPerfil = async () => {

        try {

            const usuario = obtenerUsuario();

            const [respuesta, respuestaFoto] = await Promise.all([
                consultarPerfil(usuario),
                consultarFoto(usuario)
            ]);

            const imagenURL = URL.createObjectURL(respuestaFoto)

            setDatos({
                nombre: respuesta.nombre,
                apellidos: respuesta.apellidos,
                correo: respuesta.correo,
                telefono: respuesta.telefono,
                fecha: respuesta.fecha_nacimiento,
                usuario
            })

            setFoto(imagenURL)

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
            let fotoId = null
            if (archivoFoto) {

                const archivoRenombrado = crearArchivoRenombrado(
                datosUsuario.usuario,
                archivoFoto
                );

                formData.append("file", archivoRenombrado);

                const respuestaFoto = await subirArchivo(formData)

                // suponiendo que regresa id o url
                fotoId = respuestaFoto.id

                const usuarioActualizado = {
                    nombre: datosUsuario.nombre,
                    apellidos: datosUsuario.apellidos,
                    correo: datosUsuario.correo,
                    telefono: datosUsuario.telefono,
                    usuario: datosUsuario.usuario,
                    fecha: datosUsuario.fecha,
                    fotoId: fotoId // puede ser null si no cambió imagen 
                }
            }
            if (fotoId) {
                await asociarFoto(datosUsuario.usuario, fotoId);
            }

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

            <form className="perfil-form">

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
                        value={datosUsuario.nombre}
                        readOnly ={!modoEdicion}
                        onChange={(e) => {
                            setDatos({
                                nombre: e.target.value
                            })
                        }}
                    />
                </div>

                {/* Apellidos */}
                <div className="input-container">
                    <label>Apellidos</label>
                    <input
                        type="text"
                        value={datosUsuario.apellidos}
                        readOnly = {!modoEdicion}
                        onChange={(e) => {
                            setDatos({
                                apellidos: e.target.value
                            })
                        }}
                    />
                </div>

                {/* Usuario */}
                <div className="input-container">
                    <label>Usuario</label>
                    <input
                        type="text"
                        value={datosUsuario.usuario}
                        readOnly = {!modoEdicion}
                        onChange={(e) => {
                            setDatos({
                                usuario: e.target.value
                            })
                        }}
                    />
                </div>

                {/* Correo */}
                <div className="input-container">
                    <label>Correo</label>
                    <input
                        type="email"
                        value={datosUsuario.correo}
                        readOnly = {!modoEdicion}
                        onChange={(e) => {
                            setDatos({
                                correo: e.target.value
                            })
                        }}
                    />
                </div>

                {/* Teléfono */}
                <div className="input-container">
                    <label>Teléfono</label>
                    <input
                        type="tel"
                        value={datosUsuario.telefono}
                        readOnly = {!modoEdicion}
                        onChange={(e) => {
                            setDatos({
                                telefono: e.target.value
                            })
                        }}
                    />
                </div>

                {/* Fecha de nacimiento (siempre sólo lectura) */}
                <div className="input-container">
                    <label>Fecha de Nacimiento</label>
                    <input
                        type="date"
                        value={datosUsuario.fecha}
                        readOnly
                    />
                </div>

                <div className="perfil-actions">
                    <button type="submit"
                    onSubmit={handleSumbit}>
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