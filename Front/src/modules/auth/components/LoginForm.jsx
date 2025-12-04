import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import Input from '../../shared/components/Input';
import Button from '../../shared/components/Button';
import useAuth from '../hook/useAuth';
import { frontendErrorMessage } from '../helpers/backendError'; 
import { required } from '../../shared/validators/validate';

function LoginForm({ onSuccess, onSwitchToRegister, className }) {
  const [errorMessage, setErrorMessage] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const navigate = useNavigate();
  const { signin } = useAuth();

  const onValid = async (formData) => {
    setErrorMessage('');
    try {
      // 1. Intentamos loguear
      const { error } = await signin(formData.username, formData.password);

      if (error) {
        setErrorMessage(error.frontendErrorMessage || 'Error de credenciales');
        return;
      }

      // 2. Si hay una función onSuccess (ej. desde el Modal del carrito), la ejecutamos
      if (onSuccess) {
        onSuccess();
        return;
      }

      // 3. LÓGICA DE REDIRECCIÓN BASADA EN ROL
      // Recuperamos el rol recién guardado
      const role = localStorage.getItem('role');

      if (role === 'admin') {
        navigate('/admin/home');
      } else {
        // Si es usuario normal, cliente, etc., lo mandamos al Home público
        navigate('/');
      }

    } catch (error) {
      const code = error?.response?.data?.code;
      setErrorMessage(code ? frontendErrorMessage[code] : 'Ocurrió un error inesperado');
    }
  };

  const formClasses = className || 'bg-white w-full max-w-[400px] rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8 flex flex-col gap-8';

  return (
    <form onSubmit={handleSubmit(onValid)} className={formClasses}>
      <div className="flex flex-col gap-6">
        <Input
          label='Usuario'
          className="w-full text-sm"
          {...register('username', { validate: required('Usuario es obligatorio') })}
          error={errors.username?.message}
        />
        <Input
          label='Password'
          type='password'
          className="w-full text-sm"
          {...register('password', { validate: required('Contraseña es obligatoria') })}
          error={errors.password?.message}
        />
      </div>

      <div className="flex flex-col gap-4">
        <Button type='submit' disabled={isSubmitting} className="w-full bg-purple-100 text-purple-700 hover:bg-purple-200 border-none font-semibold text-sm py-3 rounded-lg transition-colors">
          {isSubmitting ? 'Cargando...' : 'Iniciar Sesión'}
        </Button>
        <Button type="button" variant='secondary' onClick={onSwitchToRegister || (() => navigate('/signup'))} className="w-full bg-gray-200 text-gray-700 hover:bg-gray-300 border-none font-semibold text-sm py-3 rounded-lg transition-colors">
          Registrar Usuario
        </Button>
      </div>

      {errorMessage && (
        <p className='text-center text-xs text-red-500 font-medium bg-red-50 p-2 rounded-md border border-red-100'>
          {errorMessage}
        </p>
      )}
    </form>
  );
}

export default LoginForm;