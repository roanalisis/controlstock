import { useState, useCallback } from 'react';
import stockCriticoService from '../services/stockCriticoService';

/**
 * Hook para gestionar configuraciones de stock crítico.
 */
export function useStockCritico() {
  const [configuraciones, setConfiguraciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarConfiguraciones = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await stockCriticoService.listar();
      setConfiguraciones(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar stock crítico');
    } finally {
      setLoading(false);
    }
  }, []);

  const guardarConfiguracion = useCallback(async (producto, valorCritico) => {
    setError(null);
    try {
      await stockCriticoService.configurar(producto, valorCritico);
      return true;
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al guardar configuración');
      return false;
    }
  }, []);

  return { configuraciones, loading, error, cargarConfiguraciones, guardarConfiguracion };
}
