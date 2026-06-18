import axiosClient from '../api/axiosClient';

export const suscripcionesService = {
    getPlanes: async () => {
    try {
        const response = await axiosClient.get('/suscripciones/planes');
        return response.data;
    } catch (error) {
        console.error("Error al obtener los planes de suscripción:", error);
        throw error;
    }
    },

    getMiSuscripcion: async () => {
        try {
            const response = await axiosClient.get('/suscripciones/mi-suscripcion');
            return response.data.suscripcion;
        } catch (error) {
            return null;
        }
    },

    cambiarPlan: async (payload) => {
        try {
            const response = await axiosClient.post('/suscripciones/cambiar-plan', payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    cancelarPlan: async () => {
        try {
            const response = await axiosClient.put('/suscripciones/cancelar');
            return response.data;
        } catch (error) {
            console.error("Error al cancelar la suscripción:", error);
            throw error;
        }
    },

    suscribirseAlPlan: async (idPlan, datosPago) => {
    try {
        const response = await axiosClient.post('/suscripciones/suscribirse', { 
            idSuscripcion: idPlan,
            ...datosPago 
        });
        return response.data;
    } catch (error) {
        console.error("Error al procesar la suscripción y el pago:", error);
        throw error;
    }
    }
};