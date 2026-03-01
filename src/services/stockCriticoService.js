import api from './api';

/**
 * Servicio para gestión de stock crítico.
 */
const stockCriticoService = {
  /**
   * Obtiene todas las configuraciones de stock crítico.
   * @returns {Promise<Array>}
   */
  async listar() {
    const response = await api.get('/stock-critico/');
    return response.data;
  },

  /**
   * Crea o actualiza el stock crítico de un producto.
   * @param {string} producto
   * @param {number} valor_critico
   * @returns {Promise<Object>}
   */
  async configurar(producto, valor_critico) {
    const response = await api.put('/stock-critico/', { producto, valor_critico });
    return response.data;
  },
};

export default stockCriticoService;
