import { useState, useCallback } from 'react';
import reporteService from '../services/reporteService';

/**
 * Hook para gestionar la obtención de reportes.
 */
export function useReportes() {
  const [reportes, setReportes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const cargarReportes = useCallback(async (fecha = null) => {
    setLoading(true);
    setError(null);
    try {
      const data = await reporteService.obtenerReportes(fecha);
      setReportes(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Error al cargar reportes');
    } finally {
      setLoading(false);
    }
  }, []);

  return { reportes, loading, error, cargarReportes };
}
