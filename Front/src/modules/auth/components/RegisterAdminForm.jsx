import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { signup } from '../services/signup';
import { frontendErrorMessage } from '../helpers/backendError';
import { required, minLength, isEmail, matches } from '../../shared/validators/validate';

const RegisterAdminForm = ({ onSuccess, onSwitchToLogin }) => {
  const [generalError, setGeneralError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  // Observamos el password para compararlo en tiempo real
  const passwordValue = watch('password');

  const onSubmit = async (data) => {
    setGeneralError('');

    const dataToSend = { ...data };

    delete dataToSend.confirmPassword;

    try {
      const response = await signup(dataToSend);

      if (response.error) {
        setGeneralError(frontendErrorMessage[response.error.code] || response.error.message || 'Error desconocido');

        return;
      }

      if (onSuccess) onSuccess(response);
    } catch {
      setGeneralError('Error de conexión o servidor');
    }
  };

  const inputClass = 'w-full bg-white border border-gray-200 text-gray-800 text-sm sm:text-base rounded-lg px-4 py-2.5 focus:outline-none focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all';
  const labelClass = 'text-gray-800 font-medium text-sm sm:text-base ml-1';
  const errorClass = 'text-red-500 text-xs font-medium ml-1 mt-1';

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      {generalError && (
        <div className="bg-red-50 border border-red-100 text-red-500 p-3 rounded text-sm font-medium text-center">
          {generalError}
        </div>
      )}

      {/* USUARIO */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Usuario</label>
        <input type="text" className={inputClass}
          {...register('username', { validate: required('El usuario es obligatorio') })}
        />
        {errors.username && <span className={errorClass}>{errors.username.message}</span>}
      </div>

      {/* EMAIL */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Email</label>
        <input type="email" className={inputClass}
          {...register('email', {
            validate: {
              req: required('El email es obligatorio'),
              fmt: isEmail('Formato de email inválido'),
            },
          })}
        />
        {errors.email && <span className={errorClass}>{errors.email.message}</span>}
      </div>

      {/* TELÉFONO */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Teléfono</label>
        <input type="text" className={inputClass}
          {...register('phoneNumber', { validate: required('El teléfono es obligatorio') })}
        />
        {errors.phoneNumber && <span className={errorClass}>{errors.phoneNumber.message}</span>}
      </div>

      {/* ROLE */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Role</label>
        <div className="relative">
          <select className={`${inputClass} appearance-none bg-white cursor-pointer`} defaultValue=""
            {...register('role', { validate: required('Seleccione un rol') })}
          >
            <option value="" disabled>Seleccione una opción</option>
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        {errors.role && <span className={errorClass}>{errors.role.message}</span>}
      </div>

      {/* CONTRASEÑA */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Contraseña</label>
        <input type="password" className={inputClass}
          {...register('password', {
            validate: {
              req: required('La contraseña es obligatoria'),
              len: minLength(6, 'Mínimo 6 caracteres'),
            },
          })}
        />
        {errors.password && <span className={errorClass}>{errors.password.message}</span>}
      </div>

      {/* CONFIRMAR CONTRASEÑA */}
      <div className="flex flex-col gap-1.5">
        <label className={labelClass}>Confirmar contraseña</label>
        <input type="password" className={inputClass}
          {...register('confirmPassword', {
            validate: {
              req: required('Debe confirmar la contraseña'),
              match: matches(passwordValue, 'Las contraseñas no coinciden'),
            },
          })}
        />
        {errors.confirmPassword && <span className={errorClass}>{errors.confirmPassword.message}</span>}
      </div>

      {/* BOTONES */}
      <div className="mt-4 flex flex-col gap-3">
        <button type="submit" disabled={isSubmitting} className="w-full bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold text-sm sm:text-base py-3 rounded-lg transition-colors disabled:opacity-50">
          {isSubmitting ? 'Registrando...' : 'Registrar Usuario'}
        </button>
        <button type="button" onClick={onSwitchToLogin} className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold text-sm sm:text-base py-3 rounded-lg transition-colors">
            Inicio de Sesión
        </button>
      </div>
    </form>
  );
};

export default RegisterAdminForm;