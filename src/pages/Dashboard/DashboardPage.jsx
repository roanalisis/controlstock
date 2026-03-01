import { useState, useEffect, useCallback } from 'react';
import Navbar from '../../components/Navbar';
import Loader from '../../components/Loader';
import StockCriticoModal from '../../components/StockCriticoModal';
import { useReportes } from '../../hooks/useReportes';
import { useStockCritico } from '../../hooks/useStockCritico';
import './DashboardPage.css';

/**
 * Página principal del dashboard con tabla de reportes.
 */
export default function DashboardPage() {
  const { reportes, loading, error, cargarReportes } = useReportes();
  const { guardarConfiguracion } = useStockCritico();

  const [fechaFiltro, setFechaFiltro] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [modalProducto, setModalProducto] = useState(null);

  const handleConsultar = useCallback(() => {
    cargarReportes(fechaFiltro || null);
  }, [fechaFiltro, cargarReportes]);

  // Cargar datos al montar
  useEffect(() => {
    handleConsultar();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGuardarCritico = async (producto, valor) => {
    const ok = await guardarConfiguracion(producto, valor);
    if (ok) {
      setModalProducto(null);
      // Recargar reportes para reflejar el nuevo valor crítico
      cargarReportes(fechaFiltro || null);
    }
  };

  /**
   * Determina si el stock actual está en nivel crítico.
   */
  const esCritico = (reporte) => {
    if (reporte.valor_critico == null) return false;
    return reporte.stock_actual <= reporte.valor_critico;
  };

  // Resumen estadístico
  const totalVendido = reportes.reduce((sum, r) => sum + r.cantidad_vendida, 0);
  const totalProductos = new Set(reportes.map((r) => r.producto)).size;
  const productosCriticos = reportes.filter(esCritico).length;

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard__content">
        {/* ── Filtros ────────────────────────────────── */}
        <section className="dashboard__filters">
          <div className="filters__group">
            <label htmlFor="fecha" className="filters__label">
              Fecha del reporte
            </label>
            <input
              id="fecha"
              type="date"
              className="filters__date-input"
              value={fechaFiltro}
              onChange={(e) => setFechaFiltro(e.target.value)}
            />
          </div>
          <button className="filters__button" onClick={handleConsultar} disabled={loading}>
            {loading ? 'Consultando...' : '🔍 Consultar'}
          </button>
        </section>

        {/* ── Tarjetas resumen ───────────────────────── */}
        <section className="dashboard__summary">
          <div className="summary-card">
            <span className="summary-card__icon">📊</span>
            <div>
              <p className="summary-card__value">{totalProductos}</p>
              <p className="summary-card__label">Productos</p>
            </div>
          </div>
          <div className="summary-card">
            <span className="summary-card__icon">🛒</span>
            <div>
              <p className="summary-card__value">{totalVendido}</p>
              <p className="summary-card__label">Unidades Vendidas</p>
            </div>
          </div>
          <div className="summary-card summary-card--danger">
            <span className="summary-card__icon">⚠️</span>
            <div>
              <p className="summary-card__value">{productosCriticos}</p>
              <p className="summary-card__label">Stock Crítico</p>
            </div>
          </div>
        </section>

        {/* ── Tabla de reportes ──────────────────────── */}
        <section className="dashboard__table-section">
          <h2 className="dashboard__section-title">Reporte de Ventas y Stock</h2>

          {error && <div className="dashboard__error">⚠️ {error}</div>}

          {loading ? (
            <Loader message="Cargando reportes..." />
          ) : reportes.length === 0 ? (
            <div className="dashboard__empty">
              <span className="dashboard__empty-icon">📋</span>
              <p>No hay reportes para la fecha seleccionada.</p>
              <p className="dashboard__empty-hint">
                Selecciona otra fecha o consulta sin filtro.
              </p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-right">Vendidos</th>
                    <th className="text-right">Stock Actual</th>
                    <th className="text-right">Stock Crítico</th>
                    <th className="text-center">Fecha</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reportes.map((reporte) => {
                    const critico = esCritico(reporte);
                    return (
                      <tr key={reporte.id} className={critico ? 'row--critico' : ''}>
                        <td className="cell-producto">
                          {critico && <span className="badge-critico">!</span>}
                          <span className={critico ? 'text-danger' : ''}>
                            {reporte.producto}
                          </span>
                        </td>
                        <td className={`text-right ${critico ? 'text-danger' : ''}`}>
                          {reporte.cantidad_vendida}
                        </td>
                        <td className={`text-right ${critico ? 'text-danger font-bold' : ''}`}>
                          {reporte.stock_actual}
                        </td>
                        <td className="text-right text-muted">
                          {reporte.valor_critico != null
                            ? reporte.valor_critico
                            : '—'}
                        </td>
                        <td className={`text-center ${critico ? 'text-danger' : ''}`}>
                          {reporte.fecha}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn-config"
                            title="Configurar stock crítico"
                            onClick={() =>
                              setModalProducto({
                                producto: reporte.producto,
                                valorActual: reporte.valor_critico,
                              })
                            }
                          >
                            ⚙️
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>

      {/* ── Modal Stock Crítico ──────────────────────── */}
      {modalProducto && (
        <StockCriticoModal
          producto={modalProducto.producto}
          valorActual={modalProducto.valorActual}
          onGuardar={handleGuardarCritico}
          onCerrar={() => setModalProducto(null)}
        />
      )}
    </div>
  );
}
