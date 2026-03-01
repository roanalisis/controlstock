import { useAuth } from '../hooks/useAuth';
import './Navbar.css';

/**
 * Barra de navegación superior.
 */
export default function Navbar() {
  const { logout } = useAuth();

  return (
    <nav className="navbar">
      <div className="navbar__brand">
        <span className="navbar__icon">📦</span>
        <h1 className="navbar__title">Control de Stock</h1>
      </div>
      <button className="navbar__logout" onClick={logout}>
        Cerrar Sesión
      </button>
    </nav>
  );
}
