import React from 'react';
import GridSuscripciones from '../components/suscripciones/GridSuscripciones';

const SuscripcionesView = () => {
    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>Planes de Suscripción</h1>
                <p style={styles.subtitle}>
                    Consulta y gestiona las suscripciones disponibles en el sistema.
                </p>
            </div>

            {/* Aquí mandamos a llamar a nuestro nuevo componente */}
            <GridSuscripciones vista="cards" modoCliente={true} />
        </div>
    );
};

const styles = {
    container: {
        padding: "24px",
        maxWidth: "1200px",
        margin: "0 auto",
    },
    header: {
        marginBottom: "32px",
        textAlign: "center",
    },
    title: {
        fontSize: "32px",
        fontWeight: "bold",
        color: "#1f2937",
        margin: "0 0 8px 0",
    },
    subtitle: {
        fontSize: "16px",
        color: "#6b7280",
        margin: 0,
    }
};

export default SuscripcionesView;