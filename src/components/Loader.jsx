import './Loader.css';

/**
 * Indicador de carga animado.
 */
export default function Loader({ message = 'Cargando...' }) {
  return (
    <div className="loader">
      <div className="loader__spinner" />
      <p className="loader__text">{message}</p>
    </div>
  );
}
