import GlassCard from "../components/login/GlassCard";
import LoginForm from "../components/login/LoginForm";
import "../utils/style.css"

export default function LoginView() {

    return (
        <>
            <div className="background-overlay"></div>

            <div className="main-wrapper">

                <h1 className="lumo-logo">
                    LUMO
                </h1>
                //Se utilizan los componentes para construir la ventana
                <GlassCard
                    title="Iniciar Sesión"
                    subtitle="¡Feliz de que estés de vuelta!"
                >
                    //Adentro de la glass card se coloca el formulario para que vaya adentro
                    <LoginForm />
                </GlassCard>

            </div>
        </>
    );
}