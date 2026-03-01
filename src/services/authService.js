import api from './api';

/**
 * Servicio de autenticación.
 */
const authService = {
  /**
   * Inicia sesión y retorna el token.
   * @param {string} username
   * @param {string} password
   * @returns {Promise<string>} access_token
   */
  async login(username, password) {
    const response = await api.post('/auth/login', { username, password });
    return response.data.access_token;
  },
};

export default authService;
