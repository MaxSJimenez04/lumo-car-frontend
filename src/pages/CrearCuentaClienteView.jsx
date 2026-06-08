import RegistroCard from "../components/crear-cuenta/RegistroCard"
import RegistroForm from "../components/crear-cuenta/RegistroForm"

export default function CrearCuentaClienteView(){
    return (
        <>
            <h1 className="lumo-logo">
                        LUMO
            </h1>
            <RegistroCard 
            title={"Registrar Cuenta"}
            subtitle={"Por favor completa este formulario"}>
                <RegistroForm idRol={3}>

                </RegistroForm>
            </RegistroCard>
        </>
    )
}