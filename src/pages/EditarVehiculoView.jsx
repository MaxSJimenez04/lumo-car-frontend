import { useLocation, useNavigate, useParams } from 'react-router-dom'
import EditarVehiculoForm from '../components/vehiculos/EditarVehiculoForm'

export default function EditarVehiculoView() {
    const { state } = useLocation()
    const navigate = useNavigate()

    if (!state?.id) {
        navigate('/vehiculos', { replace: true })
        return null
    }
    
    const handleGuardado = () => {
        navigate('/vehiculos')
    }

    const handleCancelar = () => {
        navigate(-1)
    }

    return (
        <div className="editar-vehiculo-page">
            <EditarVehiculoForm
                idVehiculo={state?.id}
                onGuardado={navigate('/vehiculos')}
                onCancelar={handleCancelar(-1)}
            />
        </div>
    )
}