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

  const [modalProducto, setModalProducto] = useState(null);
  const [seleccionados, setSeleccionados] = useState([]);

  // Búsqueda local sobre la tabla cargada
  const [busqueda, setBusqueda] = useState('');
  const [reportesFiltrados, setReportesFiltrados] = useState(null); // null = sin filtro
  const filtrando = reportesFiltrados !== null;

  const handleBuscar = () => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return;
    setReportesFiltrados(
      reportes.filter((r) => r.producto?.toLowerCase().includes(termino))
    );
  };

  const handleLimpiarBusqueda = () => {
    setBusqueda('');
    setReportesFiltrados(null);
  };

  const reportesMostrados = reportesFiltrados ?? reportes;

  const handleAgregar = (producto) => {
    setSeleccionados((prev) => [...prev, producto]);
  };

  const handleCopiar = () => {
    navigator.clipboard.writeText(seleccionados.join('\n'));
  };

  const handleConsultar = useCallback(() => {
    cargarReportes();
  }, [cargarReportes]);

  // Cargar datos al montar
  useEffect(() => {
    handleConsultar();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleGuardarCritico = async (producto, valor) => {
    const ok = await guardarConfiguracion(producto, valor);
    if (ok) {
      setModalProducto(null);
      cargarReportes();
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
  const totalVendido = reportesMostrados.reduce((sum, r) => sum + r.cantidad, 0);
  const totalProductos = new Set(reportesMostrados.map((r) => r.producto)).size;
  const productosCriticos = reportesMostrados.filter(esCritico).length;

  return (
    <div className="dashboard">
      <Navbar />

      <main className="dashboard__content">
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
          <h2 className="dashboard__section-title">
            Reporte de Ventas y Stock
            {reportes.length > 0 && (
              <span className="dashboard__section-dates">
                {reportes[0].fecha?.split('T')[0]}
              </span>
            )}
          </h2>

          {/* ── Barra de búsqueda ──────────────────────── */}
          <div className="dashboard__search-bar">
            <input
              type="text"
              className="search-bar__input"
              placeholder="Buscar producto..."
              value={busqueda}
              disabled={filtrando}
              onChange={(e) => setBusqueda(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !filtrando) handleBuscar();
              }}
            />
            <button
              className="search-bar__btn search-bar__btn--buscar"
              onClick={handleBuscar}
              disabled={filtrando || !busqueda.trim()}
            >
              🔍 Buscar
            </button>
            <button
              className="search-bar__btn search-bar__btn--limpiar"
              onClick={handleLimpiarBusqueda}
            >
              ✖ Limpiar
            </button>
            {filtrando && (
              <span className="search-bar__info">
                {reportesFiltrados.length} resultado{reportesFiltrados.length !== 1 ? 's' : ''} para &ldquo;{busqueda}&rdquo;
              </span>
            )}
          </div>

          {error && <div className="dashboard__error">⚠️ {error}</div>}

          {loading ? (
            <Loader message="Cargando reportes..." />
          ) : reportesMostrados.length === 0 ? (
            <div className="dashboard__empty">
              <span className="dashboard__empty-icon">📋</span>
              <p>{filtrando ? 'Sin resultados para esa búsqueda.' : 'No hay reportes disponibles.'}</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="stock-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-right">Último movimiento</th>
                    <th className="text-right">Stock Actual</th>
                    <th className="text-center">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {reportesMostrados.map((reporte) => {
                    const critico = esCritico(reporte);
                    return (
                      <tr key={reporte.id} className={critico ? 'row--critico' : ''}>
                        <td className="cell-producto">
                          <div className="cell-producto__info">
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
                            {critico && <span className="badge-critico">!</span>}
                            <span className={critico ? 'text-danger' : ''}>
                              {reporte.producto}
                            </span>
                          </div>
                          <button
                            className="btn-agregar"
                            title="Agregar a la lista"
                            disabled={seleccionados.includes(reporte.producto)}
                            onClick={() => handleAgregar(reporte.producto)}
                          >
                            +
                          </button>
                        </td>
                        <td className={`text-right ${critico ? 'text-danger' : ''}`}>
                          {reporte.cantidad}{reporte.tipo ? ` ${reporte.tipo}` : ''}
                        </td>
                        <td className={`text-right ${critico ? 'text-danger font-bold' : ''}`}>
                          {reporte.stock_actual}
                        </td>
                        <td className="text-center text-muted">
                          {reporte.fecha ? reporte.fecha.split('T')[0] : '—'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* ── Lista de seleccionados ─────────────────── */}
        {seleccionados.length > 0 && (
          <section className="dashboard__seleccionados">
            <div className="seleccionados__header">
              <h2 className="seleccionados__title">Productos seleccionados</h2>
              <button className="btn-copiar" onClick={handleCopiar}>
                📋 Copiar todo
              </button>
            </div>
            <ul className="seleccionados__list">
              {seleccionados.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </section>
        )}
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
