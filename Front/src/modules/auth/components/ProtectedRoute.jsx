import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  // 1. Si no hay token, al login
  if (!token) return <Navigate to="/login" replace />;

  // 2. Si hay token, pero NO es admin, al Home (Prohibido)
  if (role !== 'admin') return <Navigate to="/" replace />;

  // 3. Si es admin, pasa
  return children;
};

export default ProtectedRoute;