import React from 'react';
import GridSuscripciones from '../components/suscripciones/GridSuscripciones';

const SuscripcionesView = () => {
    return (
        <div style={styles.pageWrapper}>
            <div style={styles.fakeHeaderBackground} />

            <div style={styles.container}>
                <div style={styles.headerCard}>
                    <h1 style={styles.title}>Planes de Suscripción</h1>
                    <p style={styles.subtitle}>
                        Consulta y gestiona las suscripciones disponibles en el sistema.
                    </p>
                </div>
                <GridSuscripciones vista="cards" modoCliente={true} />
            </div>
        </div>
    );
};

const styles = {
    pageWrapper: {
        position: "relative",
        minHeight: "100vh",
        boxSizing: "border-box",
    },
    fakeHeaderBackground: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: "80px",
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
        zIndex: 99,
    },
    container: {
        padding: "110px 24px 40px 24px",
        maxWidth: "1200px",
        margin: "0 auto",
        position: "relative",
        zIndex: 100,
    },
    headerCard: {
        marginBottom: "40px",
        textAlign: "center",
        background: "rgba(255, 255, 255, 0.92)", 
        padding: "30px 20px",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        border: "1px solid rgba(255,255,255,0.5)"
    },
    title: {
        fontSize: "36px",
        fontWeight: "800",
        color: "#1f2937",
        margin: "0 0 10px 0",
        letterSpacing: "-0.5px"
    },
    subtitle: {
        fontSize: "16px",
        color: "#4b5563",
        margin: 0,
    }
};

export default SuscripcionesView;