import { Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from '../contexts/useStateContext';

export const GuestLayout: React.FC = () => {
  const { token } = useStateContext();

  if (token) {
    return <Navigate to="/" />
  }

  return (
    <div>
      <Outlet />
    </div>
  );
}
