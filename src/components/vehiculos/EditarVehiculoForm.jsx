import { useEffect, useRef, useState } from 'react'
import {
    actualizarVehiculo,
    consultarVehiculo,
    consultarColores,
    consultarFotoPrincipal,
    consultarFotosSecundarias,
    asociarFotoPrincipal,
    asociarFotoSecundaria,
} from '../../services/vehiculos.service'
import { subirFotoVehiculo } from '../../services/archivos.service'
import api from '../../api/axiosClient'
import { consultarMarcas } from '../../services/marcas.service'
import { consultaGeneralSucursales } from '../../services/sucursales.service'

const TRANSMISION = [
    { value: 'true',  label: 'Automático' },
    { value: 'false', label: 'Manual' },
]

const TAMANOS = [
    { value: 'A', label: 'A – Micro' },
    { value: 'B', label: 'B – Subcompacto' },
    { value: 'C', label: 'C – Compacto' },
    { value: 'D', label: 'D – Mediano' },
    { value: 'E', label: 'E – Grande' },
    { value: 'F', label: 'F – Premium' },
    { value: 'S', label: 'S – SUV / Especial' },
]

const COMBUSTIBLES = [
    { value: 0, label: 'Gasolina' },
    { value: 1, label: 'Eléctrico' },
    { value: 2, label: 'Híbrido' },
]

const INITIAL_FORM = {
    pasajeros: '',
    aire_acondicionado: '',
    idColor: '',
    idSucursal: '',
}

/**
 * EditarVehiculoForm
 * Props:
 *   idVehiculo  – UUID del vehículo a editar (obligatorio)
 *   onGuardado  – callback(vehiculo) cuando se guarda correctamente
 *   onCancelar  – callback para cerrar/descartar el formulario
 */
export default function EditarVehiculoForm({ idVehiculo, onGuardado, onCancelar }) {
    // ── estado del formulario ──────────────────────────────────────────────
    const [form, setForm] = useState(INITIAL_FORM)
    const [vehiculoOriginal, setVehiculoOriginal] = useState(null)

    // ── catálogos ─────────────────────────────────────────────────────────
    const [colores,    setColores]    = useState([])
    const [marcas,     setMarcas]     = useState([])
    const [sucursales, setSucursales] = useState([])

    // ── fotos ─────────────────────────────────────────────────────────────
    const [urlFotoPrincipal,   setUrlFotoPrincipal]   = useState(null)   // URL actual (servidor)
    const [nuevaFotoPrincipal, setNuevaFotoPrincipal] = useState(null)   // File nuevo elegido
    const [previewPrincipal,   setPreviewPrincipal]   = useState(null)   // ObjectURL del nuevo

    // Secundarias existentes: [{ id, nombreArchivo, objectURL }]
    const [fotosSecundarias,   setFotosSecundarias]   = useState([])
    // Secundarias a eliminar (ids de Archivo)
    const [idsAEliminar,       setIdsAEliminar]       = useState([])
    // Secundarias nuevas: [File]
    const [nuevasSecundarias,  setNuevasSecundarias]  = useState([])
    const [previewsNuevas,     setPreviewsNuevas]     = useState([])

    // ── UI ────────────────────────────────────────────────────────────────
    const [cargandoDatos, setCargandoDatos] = useState(true)
    const [guardando,     setGuardando]     = useState(false)
    const [error,         setError]         = useState(null)
    const [exito,         setExito]         = useState(false)

    const refFotoPrincipal   = useRef(null)
    const refFotosSecundarias = useRef(null)

    // ── carga inicial ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!idVehiculo) return

        const cargar = async () => {
            setCargandoDatos(true)
            try {
                const [vehiculo, coloresData, marcasData, sucursalesData] = await Promise.all([
                    consultarVehiculo(idVehiculo),
                    consultarColores(),
                    consultarMarcas(),
                    consultaGeneralSucursales(),
                ])

                setVehiculoOriginal(vehiculo)
                setColores(coloresData)
                setMarcas(marcasData)
                setSucursales(sucursalesData)

                setForm({
                    pasajeros:        String(vehiculo.pasajeros ?? ''),
                    aire_acondicionado: String(vehiculo.aire_acondicionado ?? ''),
                    idColor:          String(vehiculo.idColor ?? ''),
                    idSucursal:       String(vehiculo.idSucursal ?? ''),
                })

                // Foto principal: construir URL de previsualización
                const baseURL = import.meta.env.VITE_URL_API || ''
                setUrlFotoPrincipal(`${baseURL}/vehiculos/${idVehiculo}/main-picture`)

                // Fotos secundarias
                try {
                    const respSecundarias = await consultarFotosSecundarias(idVehiculo)
                    if (Array.isArray(respSecundarias)) {
                        setFotosSecundarias(
                            respSecundarias.map(f => ({
                                id: f.id,
                                nombreArchivo: f.nombreArchivo,
                                objectURL: `${baseURL}/uploads/vehiculos/${f.nombreArchivo}`,
                            }))
                        )
                    }
                } catch {
                    // Sin fotos secundarias aún, no es un error crítico
                    setFotosSecundarias([])
                }

            } catch (err) {
                setError('No se pudieron cargar los datos del vehículo.')
            } finally {
                setCargandoDatos(false)
            }
        }

        cargar()
    }, [idVehiculo])

    // ── handlers genéricos ────────────────────────────────────────────────
    const handleChange = (e) => {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    // ── foto principal ────────────────────────────────────────────────────
    const handleNuevaFotoPrincipal = (e) => {
        const file = e.target.files[0]
        if (!file) return
        setNuevaFotoPrincipal(file)
        setPreviewPrincipal(URL.createObjectURL(file))
    }

    const descartarNuevaFotoPrincipal = () => {
        setNuevaFotoPrincipal(null)
        setPreviewPrincipal(null)
        if (refFotoPrincipal.current) refFotoPrincipal.current.value = ''
    }

    // ── fotos secundarias existentes ──────────────────────────────────────
    const marcarSecundariaParaEliminar = (id) => {
        setIdsAEliminar(prev => [...prev, id])
        setFotosSecundarias(prev => prev.filter(f => f.id !== id))
    }

    // ── fotos secundarias nuevas ──────────────────────────────────────────
    const handleNuevasSecundarias = (e) => {
        const archivos = Array.from(e.target.files)
        const ocupadas = fotosSecundarias.length + nuevasSecundarias.length
        const disponibles = 5 - ocupadas
        if (disponibles <= 0) return
        const nuevos = archivos.slice(0, disponibles)
        setNuevasSecundarias(prev => [...prev, ...nuevos])
        setPreviewsNuevas(prev => [...prev, ...nuevos.map(f => URL.createObjectURL(f))])
        if (refFotosSecundarias.current) refFotosSecundarias.current.value = ''
    }

    const eliminarNuevaSecundaria = (idx) => {
        setNuevasSecundarias(prev => prev.filter((_, i) => i !== idx))
        setPreviewsNuevas(prev => prev.filter((_, i) => i !== idx))
    }

    const totalFotos = fotosSecundarias.length + nuevasSecundarias.length

    // ── submit ────────────────────────────────────────────────────────────
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        setExito(false)
        setGuardando(true)

        // Capturar estado en variables locales para evitar el problema de closure con React
        const secundariasASubir = [...nuevasSecundarias]
        const secundariasAEliminar = [...idsAEliminar]

        try {
            // 1. Actualizar datos del vehículo
            const payload = {
                pasajeros:         Number(form.pasajeros),
                aire_acondicionado: form.aire_acondicionado === 'true',
                idColor:           Number(form.idColor),
                idSucursal:        Number(form.idSucursal),
            }
            await actualizarVehiculo(payload, idVehiculo)

            // 2. Nueva foto principal
            if (nuevaFotoPrincipal) {
                const fd = new FormData()
                fd.append('file', nuevaFotoPrincipal)
                const archivoResp = await subirFotoVehiculo(fd)
                const asociacionResp = await asociarFotoPrincipal(idVehiculo, archivoResp.detalles?.id)
            }

            // 3. Eliminar fotos secundarias marcadas
            for (const idArchivo of secundariasAEliminar) {
                await api.delete(`/archivos/${idArchivo}`)
            }

            // 4. Subir y asociar nuevas fotos secundarias
            for (const foto of secundariasASubir) {
                const fd = new FormData()
                fd.append('file', foto)
                const archivoResp = await subirFotoVehiculo(fd)
                const asociacionResp = await asociarFotoSecundaria(idVehiculo, archivoResp.detalles?.id)
            }

            setExito(true)
            setNuevaFotoPrincipal(null)
            setPreviewPrincipal(null)
            setNuevasSecundarias([])
            setPreviewsNuevas([])
            setIdsAEliminar([])

            // Refrescar URL de foto principal para forzar recarga
            setUrlFotoPrincipal(`${import.meta.env.VITE_URL_API || ''}/vehiculos/${idVehiculo}/main-picture?t=${Date.now()}`)

            if (onGuardado) onGuardado({ id: idVehiculo, ...payload })
        } catch (err) {
            setError(
                err?.response?.data?.mensaje ||
                err?.response?.data?.errores?.[0]?.msg ||
                err?.message ||
                'Ocurrió un error al actualizar el vehículo.'
            )
        } finally {
            setGuardando(false)
        }
    }

    // ── render ─────────────────────────────────────────────────────────────
    if (cargandoDatos) {
        return (
            <div className="evf-wrapper">
                <div className="evf-skeleton">
                    <div className="evf-skeleton-title" />
                    <div className="evf-skeleton-block" />
                    <div className="evf-skeleton-block" />
                    <div className="evf-skeleton-block evf-skeleton-short" />
                </div>
            </div>
        )
    }

    const colorSeleccionado = colores.find(c => String(c.id) === String(form.idColor))

    return (
        <div className="evf-wrapper">
            {/* Encabezado */}
            <div className="evf-header">
                <div>
                    <p className="evf-eyebrow">Editar vehículo</p>
                    <h2 className="evf-titulo">{vehiculoOriginal?.modelo || '—'}</h2>
                    <p className="evf-placa">{vehiculoOriginal?.placa}</p>
                </div>
                {onCancelar && (
                    <button className="evf-btn-cerrar" onClick={onCancelar} aria-label="Cancelar">
                        ✕
                    </button>
                )}
            </div>

            {/* Alertas */}
            {exito && (
                <div className="evf-alerta evf-alerta-exito">
                    <span className="evf-alerta-icon">✓</span>
                    Vehículo actualizado correctamente.
                </div>
            )}
            {error && (
                <div className="evf-alerta evf-alerta-error">
                    <span className="evf-alerta-icon">✕</span>
                    {error}
                </div>
            )}

            {/* Datos de solo lectura */}
            <section className="evf-seccion">
                <h3 className="evf-seccion-titulo">Datos del vehículo</h3>
                <div className="evf-readonly-grid">
                    <ReadonlyField label="Placa"        value={vehiculoOriginal?.placa} />
                    <ReadonlyField label="Modelo / Año" value={vehiculoOriginal?.modelo} />
                    <ReadonlyField label="Tamaño"
                        value={TAMANOS.find(t => t.value === vehiculoOriginal?.tamano)?.label} />
                    <ReadonlyField label="Transmisión"
                        value={TRANSMISION.find(t => t.value === String(vehiculoOriginal?.transmision))?.label} />
                    <ReadonlyField label="Combustible"
                        value={COMBUSTIBLES.find(c => c.value === vehiculoOriginal?.tipo_combustible)?.label} />
                    <ReadonlyField label="Marca"
                        value={vehiculoOriginal?.nombreMarca || marcas.find(m => m.id === vehiculoOriginal?.idMarca)?.nombreMarca} />
                </div>
            </section>

            {/* Datos editables */}
            <form onSubmit={handleSubmit} className="evf-form">
                <section className="evf-seccion">
                    <h3 className="evf-seccion-titulo">Datos editables</h3>

                    <div className="evf-grid-2">
                        <div className="evf-campo">
                            <label htmlFor="pasajeros">Capacidad de pasajeros</label>
                            <input
                                id="pasajeros"
                                name="pasajeros"
                                type="number"
                                min={1}
                                value={form.pasajeros}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="evf-campo">
                            <label htmlFor="aire_acondicionado">Aire acondicionado</label>
                            <select
                                id="aire_acondicionado"
                                name="aire_acondicionado"
                                value={form.aire_acondicionado}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar…</option>
                                <option value="true">Sí</option>
                                <option value="false">No</option>
                            </select>
                        </div>
                    </div>

                    <div className="evf-grid-2">
                        <div className="evf-campo">
                            <label htmlFor="idColor">Color</label>
                            <div className="evf-color-row">
                                <select
                                    id="idColor"
                                    name="idColor"
                                    value={form.idColor}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Seleccionar…</option>
                                    {colores.map(c => (
                                        <option key={c.id} value={c.id}>{c.color}</option>
                                    ))}
                                </select>
                                {colorSeleccionado && (
                                    <span
                                        className="evf-muestra-color"
                                        style={{ background: colorSeleccionado.codigoHex }}
                                        title={colorSeleccionado.codigoHex}
                                    />
                                )}
                            </div>
                        </div>

                        <div className="evf-campo">
                            <label htmlFor="idSucursal">Sucursal</label>
                            <select
                                id="idSucursal"
                                name="idSucursal"
                                value={form.idSucursal}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Seleccionar…</option>
                                {sucursales.map(s => (
                                    <option key={s.id} value={s.id}>{s.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </section>

                {/* Foto principal */}
                <section className="evf-seccion">
                    <h3 className="evf-seccion-titulo">Foto principal</h3>

                    <div className="evf-foto-principal-layout">
                        {/* Foto actual */}
                        <div className="evf-foto-actual">
                            <p className="evf-foto-label">Actual</p>
                            <img
                                src={urlFotoPrincipal}
                                alt="Foto principal actual"
                                className="evf-img-principal"
                                onError={e => { e.target.style.display = 'none' }}
                            />
                        </div>

                        {/* Nueva foto */}
                        <div className="evf-foto-nueva">
                            <p className="evf-foto-label">
                                {previewPrincipal ? 'Nueva foto' : 'Reemplazar'}
                            </p>
                            {previewPrincipal ? (
                                <div className="evf-nueva-preview-wrapper">
                                    <img
                                        src={previewPrincipal}
                                        alt="Vista previa nueva foto principal"
                                        className="evf-img-principal"
                                    />
                                    <button
                                        type="button"
                                        className="evf-btn-quitar-foto"
                                        onClick={descartarNuevaFotoPrincipal}
                                    >
                                        ✕ Descartar
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="evf-zona-subir"
                                    onClick={() => refFotoPrincipal.current.click()}
                                >
                                    <span className="evf-icono-subir">↑</span>
                                    <span>Seleccionar nueva foto</span>
                                    <span className="evf-hint">JPG, PNG o WEBP</span>
                                </button>
                            )}
                            <input
                                ref={refFotoPrincipal}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                style={{ display: 'none' }}
                                onChange={handleNuevaFotoPrincipal}
                            />
                        </div>
                    </div>
                </section>

                {/* Fotos secundarias */}
                <section className="evf-seccion">
                    <h3 className="evf-seccion-titulo">
                        Fotos secundarias
                        <span className="evf-badge">{totalFotos} / 5</span>
                    </h3>

                    <div className="evf-grid-fotos">
                        {/* Existentes */}
                        {fotosSecundarias.map(foto => (
                            <div key={foto.id} className="evf-thumb">
                                <img src={foto.objectURL} alt={foto.nombreArchivo} />
                                <button
                                    type="button"
                                    className="evf-btn-quitar-thumb"
                                    onClick={() => marcarSecundariaParaEliminar(foto.id)}
                                    aria-label="Eliminar foto"
                                >
                                    ✕
                                </button>
                                <span className="evf-thumb-tag">Guardada</span>
                            </div>
                        ))}

                        {/* Nuevas */}
                        {previewsNuevas.map((src, idx) => (
                            <div key={`nueva-${idx}`} className="evf-thumb evf-thumb-nueva">
                                <img src={src} alt={`Nueva ${idx + 1}`} />
                                <button
                                    type="button"
                                    className="evf-btn-quitar-thumb"
                                    onClick={() => eliminarNuevaSecundaria(idx)}
                                    aria-label="Quitar foto nueva"
                                >
                                    ✕
                                </button>
                                <span className="evf-thumb-tag evf-thumb-tag-nueva">Nueva</span>
                            </div>
                        ))}

                        {/* Botón agregar */}
                        {totalFotos < 5 && (
                            <button
                                type="button"
                                className="evf-thumb-agregar"
                                onClick={() => refFotosSecundarias.current.click()}
                            >
                                <span style={{ fontSize: 24 }}>+</span>
                                <span style={{ fontSize: 12 }}>Agregar</span>
                            </button>
                        )}
                    </div>

                    <input
                        ref={refFotosSecundarias}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        style={{ display: 'none' }}
                        onChange={handleNuevasSecundarias}
                    />
                </section>

                {/* Acciones */}
                <div className="evf-acciones">
                    {onCancelar && (
                        <button type="button" className="evf-btn evf-btn-sec" onClick={onCancelar}>
                            Cancelar
                        </button>
                    )}
                    <button
                        type="submit"
                        className="evf-btn evf-btn-pri"
                        disabled={guardando}
                    >
                        {guardando ? 'Guardando…' : 'Guardar cambios'}
                    </button>
                </div>
            </form>
        </div>
    )
}

// ── Subcomponente auxiliar ────────────────────────────────────────────────────
function ReadonlyField({ label, value }) {
    return (
        <div className="evf-ro-field">
            <span className="evf-ro-label">{label}</span>
            <span className="evf-ro-value">{value ?? '—'}</span>
        </div>
    )
}