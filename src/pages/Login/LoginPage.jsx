import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './LoginPage.css';

/**
 * Página de inicio de sesión.
 */
export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error, clearError } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(username, password);
    if (success) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-card__header">
          <span className="login-card__icon">📦</span>
          <h1 className="login-card__title">Control de Stock</h1>
          <p className="login-card__subtitle">Inicia sesión para continuar</p>
        </div>

        <form className="login-card__form" onSubmit={handleSubmit}>
          {error && (
            <div className="login-card__error" onClick={clearError}>
              <span>⚠️</span> {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Usuario
            </label>
            <input
              id="username"
              type="text"
              className="form-input"
              placeholder="Ingresa tu usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="login-card__button"
            disabled={loading || !username || !password}
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
