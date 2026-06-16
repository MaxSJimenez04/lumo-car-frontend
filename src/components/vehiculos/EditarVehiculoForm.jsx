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

            <style>{`
                /* ── Wrapper ─────────────────────────────────── */
                .evf-wrapper {
                    max-width: 820px;
                    margin: 0 auto;
                    padding: 2rem 1.5rem 3rem;
                    font-family: system-ui, -apple-system, sans-serif;
                    color: #111827;
                }

                /* ── Skeleton ────────────────────────────────── */
                @keyframes evf-shimmer {
                    0%   { background-position: -600px 0; }
                    100% { background-position: 600px 0; }
                }
                .evf-skeleton { display: flex; flex-direction: column; gap: 1rem; }
                .evf-skeleton-title,
                .evf-skeleton-block,
                .evf-skeleton-short {
                    border-radius: 8px;
                    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                    background-size: 600px 100%;
                    animation: evf-shimmer 1.4s infinite linear;
                }
                .evf-skeleton-title  { height: 32px; width: 55%; }
                .evf-skeleton-block  { height: 120px; }
                .evf-skeleton-short  { height: 80px; width: 70%; }

                /* ── Header ──────────────────────────────────── */
                .evf-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1.25rem;
                    border-bottom: 1px solid #e5e7eb;
                }
                .evf-eyebrow {
                    font-size: 0.72rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    color: #6366f1;
                    margin: 0 0 4px;
                }
                .evf-titulo {
                    font-size: 1.4rem;
                    font-weight: 700;
                    margin: 0 0 4px;
                }
                .evf-placa {
                    font-size: 0.85rem;
                    color: #6b7280;
                    margin: 0;
                    font-variant-numeric: tabular-nums;
                }
                .evf-btn-cerrar {
                    background: none;
                    border: none;
                    font-size: 1.1rem;
                    color: #9ca3af;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 6px;
                    transition: background 0.12s, color 0.12s;
                }
                .evf-btn-cerrar:hover { background: #f3f4f6; color: #374151; }

                /* ── Alertas ─────────────────────────────────── */
                .evf-alerta {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 0.75rem 1rem;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    margin-bottom: 1.25rem;
                }
                .evf-alerta-icon { font-size: 1rem; }
                .evf-alerta-exito { background:#ecfdf5; color:#065f46; border:1px solid #a7f3d0; }
                .evf-alerta-error { background:#fef2f2; color:#991b1b; border:1px solid #fecaca; }

                /* ── Sección ─────────────────────────────────── */
                .evf-seccion {
                    background: #fff;
                    border: 1px solid #e5e7eb;
                    border-radius: 10px;
                    padding: 1.25rem 1.5rem;
                    margin-bottom: 1.25rem;
                }
                .evf-seccion-titulo {
                    font-size: 0.78rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    color: #6b7280;
                    margin: 0 0 1rem;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                /* ── Readonly grid ───────────────────────────── */
                .evf-readonly-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 0.75rem 1.25rem;
                }
                .evf-ro-field { display: flex; flex-direction: column; gap: 2px; }
                .evf-ro-label {
                    font-size: 0.7rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #9ca3af;
                }
                .evf-ro-value {
                    font-size: 0.9rem;
                    color: #374151;
                    font-weight: 500;
                }

                /* ── Grids editables ─────────────────────────── */
                .evf-grid-2 {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }
                @media (max-width: 560px) { .evf-grid-2 { grid-template-columns: 1fr; } }

                /* ── Campos ──────────────────────────────────── */
                .evf-campo { display: flex; flex-direction: column; gap: 5px; }
                .evf-campo label { font-size: 0.8rem; font-weight: 500; color: #374151; }
                .evf-campo input,
                .evf-campo select {
                    height: 38px;
                    padding: 0 10px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    font-size: 0.9rem;
                    background: #f9fafb;
                    color: #111827;
                    transition: border-color 0.15s, box-shadow 0.15s;
                }
                .evf-campo input:focus,
                .evf-campo select:focus {
                    outline: none;
                    border-color: #6366f1;
                    box-shadow: 0 0 0 3px rgba(99,102,241,.12);
                    background: #fff;
                }

                .evf-color-row { display: flex; align-items: center; gap: 10px; }
                .evf-color-row select { flex: 1; }
                .evf-muestra-color {
                    width: 26px;
                    height: 26px;
                    border-radius: 50%;
                    border: 2px solid #e5e7eb;
                    flex-shrink: 0;
                }

                /* ── Foto principal ──────────────────────────── */
                .evf-foto-principal-layout {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 1.25rem;
                    align-items: start;
                }
                @media (max-width: 560px) { .evf-foto-principal-layout { grid-template-columns: 1fr; } }

                .evf-foto-actual,
                .evf-foto-nueva { display: flex; flex-direction: column; gap: 8px; }

                .evf-foto-label {
                    font-size: 0.72rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                    color: #9ca3af;
                    margin: 0;
                }
                .evf-img-principal {
                    width: 100%;
                    aspect-ratio: 16/9;
                    object-fit: cover;
                    border-radius: 8px;
                    border: 1px solid #e5e7eb;
                    background: #f3f4f6;
                }
                .evf-nueva-preview-wrapper {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }
                .evf-btn-quitar-foto {
                    align-self: flex-start;
                    font-size: 0.78rem;
                    color: #ef4444;
                    background: none;
                    border: 1px solid #fca5a5;
                    border-radius: 6px;
                    padding: 4px 10px;
                    cursor: pointer;
                    transition: background 0.12s;
                }
                .evf-btn-quitar-foto:hover { background: #fef2f2; }

                .evf-zona-subir {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    width: 100%;
                    aspect-ratio: 16/9;
                    border: 2px dashed #d1d5db;
                    border-radius: 8px;
                    background: #f9fafb;
                    color: #9ca3af;
                    font-size: 0.875rem;
                    cursor: pointer;
                    transition: border-color 0.15s, background 0.15s, color 0.15s;
                }
                .evf-zona-subir:hover { border-color: #6366f1; background: #eef2ff; color: #4338ca; }
                .evf-icono-subir { font-size: 1.5rem; }
                .evf-hint { font-size: 0.7rem; color: #9ca3af; }

                /* ── Fotos secundarias ───────────────────────── */
                .evf-badge {
                    font-size: 0.7rem;
                    background: #f3f4f6;
                    color: #374151;
                    padding: 2px 8px;
                    border-radius: 99px;
                    font-weight: 500;
                    letter-spacing: 0;
                    text-transform: none;
                }
                .evf-grid-fotos {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(110px, 1fr));
                    gap: 10px;
                }
                .evf-thumb {
                    position: relative;
                    aspect-ratio: 1;
                    border-radius: 8px;
                    overflow: hidden;
                    border: 1px solid #e5e7eb;
                }
                .evf-thumb img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }
                .evf-thumb-nueva { border-color: #a5b4fc; }

                .evf-thumb-tag {
                    position: absolute;
                    bottom: 4px;
                    left: 4px;
                    font-size: 9px;
                    font-weight: 700;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    background: rgba(0,0,0,.5);
                    color: #fff;
                    padding: 2px 5px;
                    border-radius: 4px;
                }
                .evf-thumb-tag-nueva { background: rgba(99,102,241,.75); }

                .evf-btn-quitar-thumb {
                    position: absolute;
                    top: 4px;
                    right: 4px;
                    width: 22px;
                    height: 22px;
                    border-radius: 50%;
                    background: rgba(0,0,0,.55);
                    color: #fff;
                    border: none;
                    font-size: 11px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    line-height: 1;
                    transition: background 0.12s;
                }
                .evf-btn-quitar-thumb:hover { background: rgba(239,68,68,.8); }

                .evf-thumb-agregar {
                    aspect-ratio: 1;
                    border-radius: 8px;
                    border: 2px dashed #d1d5db;
                    background: #f9fafb;
                    color: #9ca3af;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    cursor: pointer;
                    transition: border-color 0.15s, color 0.15s;
                }
                .evf-thumb-agregar:hover { border-color: #6366f1; color: #4338ca; }

                /* ── Acciones ────────────────────────────────── */
                .evf-acciones {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    padding-top: 0.25rem;
                }
                .evf-btn {
                    padding: 0 1.5rem;
                    height: 40px;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-weight: 500;
                    cursor: pointer;
                    transition: background 0.14s, opacity 0.14s;
                }
                .evf-btn-pri {
                    background: #4f46e5;
                    color: #fff;
                    border: none;
                }
                .evf-btn-pri:hover    { background: #4338ca; }
                .evf-btn-pri:disabled { opacity: 0.6; cursor: not-allowed; }
                .evf-btn-sec {
                    background: #fff;
                    color: #374151;
                    border: 1px solid #d1d5db;
                }
                .evf-btn-sec:hover { background: #f3f4f6; }
            `}</style>
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