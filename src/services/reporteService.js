import api from './api';

/**
 * Servicio para operaciones con reportes.
 */
const reporteService = {
  /**
   * Obtiene los reportes, opcionalmente filtrados por fecha.
   * @param {string|null} fecha - Formato YYYY-MM-DD
   * @returns {Promise<Array>}
   */
  async obtenerReportes() {
    const response = await api.get('/reportes/');
    return response.data;
  },
};

export default reporteService;
