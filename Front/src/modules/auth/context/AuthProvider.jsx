import { createContext, useState } from 'react';
import { login } from '../services/login';
import { signup } from '../services/signup';
import { frontendErrorMessage } from '../helpers/backendError';

const AuthContext = createContext();

function AuthProvider({ children }) {
  // Inicialización lazy del estado basada en la persistencia local (localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return Boolean(localStorage.getItem('token'));
  });

  const signout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
  };

  const signin = async (username, password) => {
    try {
      const { data, error } = await login(username, password);

      if (error) {
        const message = frontendErrorMessage[error.code] || 'Error desconocido al iniciar sesión';

        // Devolvemos el formato exacto que espera LoginForm
        return { error: { frontendErrorMessage: message } };
      }
      // -----------------------------

      setIsAuthenticated(true);

      return { token: data.token, role: data.role, error: null };

    } catch (error) {
      // Mapeo de errores de backend (excepciones de red) a mensajes amigables
      const backendCode = error?.response?.data?.code;

      if (backendCode) {
        return { error: { frontendErrorMessage: frontendErrorMessage[backendCode] } };
      }

      return { error: { frontendErrorMessage: 'Error al iniciar sesión' } };
    }
  };

  const register = async (userData) => {
    try {
      const response = await signup(userData);

      if (response.error) return { error: response.error };

      // Actualizar estado de autenticación si el registro devuelve un token válido
      if (response.token) {
        setIsAuthenticated(true);
      }

      return response;

    } catch {
      // Se retorna un error genérico ante fallos inesperados en el registro
      return { error: 'Error inesperado en el registro' };
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signin, signout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, AuthContext };