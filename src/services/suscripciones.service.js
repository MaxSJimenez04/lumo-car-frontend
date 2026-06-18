import axiosClient from '../api/axiosClient';

export const suscripcionesService = {
  // Esta función llama a la ruta que configuró tu equipo en el backend
  getPlanes: async () => {
    try {
      const response = await axiosClient.get('/suscripciones/planes');
      return response.data;
    } catch (error) {
      console.error("Error al obtener los planes de suscripción:", error);
      throw error;
    }
  }
};

suscribirseAlPlan: async (idPlan) => {
    try {
        const response = await axiosClient.post('/suscripciones/suscribirse', { idSuscripcion: idPlan });
        return response.data;
    } catch (error) {
        console.error("Error al suscribirse:", error);
        throw error;
    }
}