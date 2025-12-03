import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '../../shared/components/Button';
import Input from '../../shared/components/Input';
import useAuth from '../hook/useAuth';
import { required, minLength, isEmail, matches } from '../../shared/validators/validate';

const RegisterUserForm = ({ onSuccess, onSwitchToLogin }) => {
  const { register: registerAuth } = useAuth();
  const [generalError, setGeneralError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors }, reset } = useForm();

  const passwordValue = watch('password');

  const onValid = async (formData) => {
    setIsLoading(true);
    setGeneralError('');

    const payload = { ...formData };

    delete payload.confirmPassword;

    try {
      const result = await registerAuth(payload);

      setIsLoading(false);

      if (result.error) {
        setGeneralError(typeof result.error === 'string' ? result.error : 'Error al registrarse');
      } else {
        reset();

        if (onSuccess) onSuccess();
      }
    } catch {
      setIsLoading(false);
      setGeneralError('Error de conexión o servidor');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-5">
        {generalError && (
          <div className="bg-red-50 border border-red-100 text-red-500 p-2 rounded text-xs font-medium text-center">
            {generalError}
          </div>
        )}

        <div className="flex flex-col gap-4">
          <Input
            label="Usuario"
            className="w-full text-sm"
            {...register('username', { validate: required('El usuario es obligatorio') })}
            error={errors.username?.message}
          />

          <Input
            label="Email"
            type="email"
            className="w-full text-sm"
            {...register('email', {
              validate: {
                req: required('El email es obligatorio'),
                fmt: isEmail('Email inválido'),
              },
            })}
            error={errors.email?.message}
          />

          <Input
            label="Teléfono"
            className="w-full text-sm"
            {...register('phoneNumber', { validate: required('El teléfono es obligatorio') })}
            error={errors.phoneNumber?.message}
          />

          <Input
            label="Contraseña"
            type="password"
            className="w-full text-sm"
            {...register('password', {
              validate: {
                req: required('La contraseña es obligatoria'),
                len: minLength(6, 'Mínimo 6 caracteres'),
              },
            })}
            error={errors.password?.message}
          />

          <Input
            label="Confirmar contraseña"
            type="password"
            className="w-full text-sm"
            {...register('confirmPassword', {
              validate: {
                req: required('Confirme su contraseña'),
                match: matches(passwordValue, 'Las contraseñas no coinciden'),
              },
            })}
            error={errors.confirmPassword?.message}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full bg-purple-200 text-purple-900 hover:bg-purple-300 font-bold py-2 rounded-lg mt-2 disabled:opacity-50">
          {isLoading ? 'Registrando...' : 'Registrar Usuario'}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{' '}
        <button type="button" onClick={onSwitchToLogin} className="text-purple-700 font-semibold hover:underline">
          Inicia Sesión
        </button>
      </div>
    </>
  );
};

export default RegisterUserForm;