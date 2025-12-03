import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';

function LoginPage() {
  const navigate = useNavigate();

  const handleLoginSuccess = () => {
    navigate('/admin/home');
  };

  return (
    <div className='
      flex
      min-h-[100dvh]
      w-full
      items-center
      justify-center
      bg-neutral-100
      p-4
    '>
      <LoginForm onSuccess={handleLoginSuccess} />
    </div>
  );
}

export default LoginPage;