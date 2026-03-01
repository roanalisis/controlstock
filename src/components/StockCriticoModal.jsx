import { useState } from 'react';
import './StockCriticoModal.css';

/**
 * Modal para configurar el stock crítico de un producto.
 */
export default function StockCriticoModal({ producto, valorActual, onGuardar, onCerrar }) {
  const [valor, setValor] = useState(valorActual ?? '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numValor = parseFloat(valor);
    if (isNaN(numValor) || numValor < 0) return;

    setSaving(true);
    await onGuardar(producto, numValor);
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onCerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2 className="modal__title">Configurar Stock Crítico</h2>
          <button className="modal__close" onClick={onCerrar}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal__form">
          <div className="modal__product-name">
            <span className="modal__label">Producto:</span>
            <span className="modal__value">{producto}</span>
          </div>

          <div className="form-group">
            <label htmlFor="valorCritico" className="form-label">
              Valor de Stock Crítico
            </label>
            <input
              id="valorCritico"
              type="number"
              className="form-input"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              min="0"
              step="1"
              placeholder="Ej: 10"
              required
              autoFocus
            />
            <p className="modal__help">
              Cuando el stock actual sea igual o menor a este valor, se mostrará en rojo.
            </p>
          </div>

          <div className="modal__actions">
            <button type="button" className="btn btn--secondary" onClick={onCerrar}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn--primary"
              disabled={saving || valor === ''}
            >
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
