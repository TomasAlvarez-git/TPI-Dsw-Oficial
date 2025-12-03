import React from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterAdminForm from '../components/RegisterAdminForm';

const SignUpPage = () => {
  const navigate = useNavigate();

  // Lógica post-registro exitoso
  const handleRegisterSuccess = (response) => {
    if (response.token) {
      localStorage.setItem('token', response.token);
      localStorage.setItem('role', response.role);
      navigate('/admin/home');
    } else {
      // Fallback por si la API no devuelve token directo al registrar
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-[450px] rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8">

        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Crear Cuenta
        </h2>

        {/* Renderizamos el formulario modularizado */}
        <RegisterAdminForm
          onSuccess={handleRegisterSuccess}
          onSwitchToLogin={() => navigate('/login')}
        />

      </div>
    </div>
  );
};

export default SignUpPage;