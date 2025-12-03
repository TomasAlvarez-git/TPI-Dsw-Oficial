import React from 'react';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    // 1. 'bg-black/50': Asegura transparencia (50% negro).
    // 2. 'backdrop-blur-sm': Agrega el efecto de difuminado al fondo.
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-md p-4">

      {/* El contenido sigue igual */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative animate-fade-in-up border border-gray-100">

        {/* Header con botón de cerrar */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          {/* Si no hay título, dejamos un espacio vacío para mantener el layout o lo ocultamos */}
          <h3 className="text-xl font-bold text-gray-800">{title || <span>&nbsp;</span>}</h3>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Contenido del formulario */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;