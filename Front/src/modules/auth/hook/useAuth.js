import { useContext } from 'react';
import { AuthContext } from '../context/AuthProvider';

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth no debe ser usado por fuera de AuthProvider');
  }

  const signin = async (username, password) => {
    const { token, role, error } = await context.signin(username, password);

    if (error) return { error };

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);

    return { error: null };
  };

  const signout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    context.signout();
  };

  return {
    isAuthenticated: context.isAuthenticated,
    signin,
    signout,
    register: context.register,
  };
};

export default useAuth;
