import './ProductTable.css';

/**
 * Tabla de productos con ventas y stock.
 * Resalta en rojo las filas con stock crítico.
 */
export default function ProductTable({ reportes, onConfigurarCritico }) {
  if (reportes.length === 0) {
    return (
      <div className="table-empty">
        <span className="table-empty__icon">📋</span>
        <p>No se encontraron reportes para la fecha seleccionada.</p>
        <p className="table-empty__hint">Selecciona otra fecha o presiona "Consultar".</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="product-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th className="text-right">Vendidos</th>
            <th className="text-right">Stock Actual</th>
            <th className="text-right">Stock Crítico</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {reportes.map((reporte) => {
            const esCritico =
              reporte.valor_critico != null &&
              reporte.stock_actual <= reporte.valor_critico;

            return (
              <tr key={reporte.id} className={esCritico ? 'row--critico' : ''}>
                <td className="product-name">
                  {esCritico && <span className="badge-critico">!</span>}
                  {reporte.producto}
                </td>
                <td className="text-right">{reporte.cantidad_vendida}</td>
                <td className={`text-right ${esCritico ? 'stock-critico' : ''}`}>
                  {reporte.stock_actual}
                </td>
                <td className="text-right text-muted">
                  {reporte.valor_critico != null ? reporte.valor_critico : '—'}
                </td>
                <td className="text-center">
                  <button
                    className="btn-config"
                    onClick={() =>
                      onConfigurarCritico(reporte.producto, reporte.valor_critico)
                    }
                    title="Configurar stock crítico"
                  >
                    ⚙️ Configurar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
