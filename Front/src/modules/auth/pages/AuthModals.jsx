import React from 'react';
import Modal from '../../shared/components/Modal';
import RegisterUserForm from '../components/RegisterUserForm';
import LoginForm from '../components/LoginForm'; // <--- Importamos el form refactorizado

/**
 * Modal de inicio de sesión.
 * Reutiliza LoginForm pero le quita los estilos de tarjeta y maneja el éxito cerrando el modal.
 */
export const LoginModal = ({ isOpen, onClose, onSwitchToRegister, onLoginSuccess }) => {

  const handleSuccess = () => {
    // 1. Ejecutar lógica extra si existe (ej: actualizar estado global de usuario)
    if (onLoginSuccess) onLoginSuccess();

    // 2. Cerrar el modal
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <LoginForm
        // Sobrescribimos estilos para que no tenga sombras ni bordes dentro del modal
        className="flex flex-col gap-6"
        // Le decimos qué hacer al terminar (cerrar modal)
        onSuccess={handleSuccess}
        // Le decimos qué hacer al tocar "Registrar" (cambiar al modal de registro)
        onSwitchToRegister={onSwitchToRegister}
      />
    </Modal>
  );
};

export const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="">
      <RegisterUserForm
        onSuccess={onClose}
        onSwitchToLogin={onSwitchToLogin}
      />
    </Modal>
  );
};