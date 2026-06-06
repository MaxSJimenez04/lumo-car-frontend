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
                <GlassCard
                    title="Iniciar Sesión"
                    subtitle="¡Feliz de que estés de vuelta!"
                >
                    <LoginForm />
                </GlassCard>

            </div>
        </>
    );
}