import { Navigate } from 'react-router-dom';

/**
 * Componente para proteger rutas.
 * Verifica la existencia del token y si el rol es 'admin'.
 * Redirige al login si no se cumplen las condiciones.
 */
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // Verificar autenticación básica
  if (!token) return <Navigate to="/login" replace />;

  // Verificar autorización basada en roles
  if (role !== 'admin') return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;