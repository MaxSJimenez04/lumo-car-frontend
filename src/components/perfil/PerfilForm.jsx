import { useEffect, useState } from "react";
import { consultarPerfil, actualizar, consultarFoto ,asociarFoto } from "../../services/usuarios.service";
import { subirFotoPerfil } from "../../services/archivos.service";
import { obtenerUsuario } from "../../utils/auth";
import Loading from "../common/Loading";

export default function PerfilForm(){
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
                const idFoto = respuestaFoto.detalles.id;

                const usuarioActualizado = {
                    nombre: datosUsuario.nombre,
                    apellidos: datosUsuario.apellidos,
                    correo: datosUsuario.correo,
                    telefono: datosUsuario.telefono,
                    usuario: datosUsuario.usuario,
                    fecha: datosUsuario.fecha, // puede ser null si no cambió imagen 
                }

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

    if (loading) {
        return <Loading message="Cargando perfil..." />;
    }

    return (
        <div className="perfil-view">
            <div className="perfil-card">
                
                <div className="perfil-card-header">
                    <div className="header-title-section">
                        <h2>Mi Perfil</h2>
                        <p className="header-helper-text">Administra y actualiza la información personal de tu cuenta.</p>
                    </div>
                    {!modoEdicion && (
                        <button 
                            type="button" 
                            className="perfil-edit-trigger-btn"
                            onClick={() => setModoEdicion(true)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="btn-icon">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                            Editar Perfil
                        </button>
                    )}
                </div>

                <form className="perfil-form" onSubmit={handleSumbit}>
                    
                    {/* Sección Foto de perfil */}
                    <div className="perfil-photo-section">
                        <div className="profile-photo-wrapper">
                            <img
                                src={imagenPerfil || "https://via.placeholder.com/150"}
                                alt="Foto de perfil"
                                className="perfil-image"
                            />
                            {modoEdicion && (
                                <>
                                    <div className="photo-overlay"></div>
                                    <label className="photo-edit-btn">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="photo-cam-icon">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                                        </svg>
                                        <span>Cambiar</span>
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
                        <div className="perfil-photo-info">
                            <span className="profile-name-title">{datosUsuario.nombre || "Usuario"} {datosUsuario.apellidos}</span>
                            <span className="profile-role-subtitle">
                                <span className="tag-username">@{datosUsuario.usuario || "lumo"}</span>
                            </span>
                        </div>
                    </div>

                    {/* Grid de Campos de información */}
                    <div className="perfil-fields-grid">
                        
                        {/* Nombre */}
                        <div className="perfil-input-container">
                            <label>Nombre</label>
                            <div className="input-with-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="input-field-icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                <input
                                    type="text"
                                    name="nombre"
                                    value={datosUsuario.nombre}
                                    readOnly={!modoEdicion}
                                    onChange={handleChange}
                                    className={modoEdicion ? "editable" : "readonly"}
                                    placeholder="Nombre"
                                />
                            </div>
                        </div>

                        {/* Apellidos */}
                        <div className="perfil-input-container">
                            <label>Apellidos</label>
                            <div className="input-with-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="input-field-icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                                <input
                                    type="text"
                                    name="apellidos"
                                    value={datosUsuario.apellidos}
                                    readOnly={!modoEdicion}
                                    onChange={handleChange}
                                    className={modoEdicion ? "editable" : "readonly"}
                                    placeholder="Apellidos"
                                />
                            </div>
                        </div>

                        {/* Usuario */}
                        <div className="perfil-input-container">
                            <label>Nombre de Usuario</label>
                            <div className="input-with-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="input-field-icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 1 0-2.636 6.364M16.5 12V8.25" />
                                </svg>
                                <input
                                    type="text"
                                    name="usuario"
                                    value={datosUsuario.usuario}
                                    readOnly={!modoEdicion}
                                    onChange={handleChange}
                                    className={modoEdicion ? "editable" : "readonly"}
                                    placeholder="Usuario"
                                />
                            </div>
                        </div>

                        {/* Correo */}
                        <div className="perfil-input-container">
                            <label>Correo Electrónico</label>
                            <div className="input-with-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="input-field-icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                </svg>
                                <input
                                    type="email"
                                    name="correo"
                                    value={datosUsuario.correo}
                                    readOnly={!modoEdicion}
                                    onChange={handleChange}
                                    className={modoEdicion ? "editable" : "readonly"}
                                    placeholder="correo@ejemplo.com"
                                />
                            </div>
                        </div>

                        {/* Teléfono */}
                        <div className="perfil-input-container">
                            <label>Teléfono</label>
                            <div className="input-with-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="input-field-icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                </svg>
                                <input
                                    type="tel"
                                    name="telefono"
                                    value={datosUsuario.telefono}
                                    readOnly={!modoEdicion}
                                    onChange={handleChange}
                                    className={modoEdicion ? "editable" : "readonly"}
                                    placeholder="Número de Teléfono"
                                />
                            </div>
                        </div>

                        {/* Fecha de nacimiento (siempre sólo lectura) */}
                        <div className="perfil-input-container">
                            <label>Fecha de Nacimiento</label>
                            <div className="input-with-icon-wrapper">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="input-field-icon">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z" />
                                </svg>
                                <input
                                    type="date"
                                    name="fecha"
                                    value={datosUsuario.fecha}
                                    readOnly
                                    className="readonly permanent-readonly"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Botones de acción (solo si está en modo edición) */}
                    {modoEdicion && (
                        <div className="perfil-actions">
                            <button type="submit" className="perfil-save-btn">
                                Guardar Cambios
                            </button>
                            <button type="button" className="perfil-cancel-btn" onClick={handleCancelar}>
                                Cancelar
                            </button>
                        </div>
                    )}

                </form>
            </div>
        </div>
    );
}