import { Link, Navigate, Outlet } from 'react-router-dom';
import { useStateContext } from '../contexts/useStateContext';
import { useEffect } from 'react';
import { axiosClient } from '../views/axios.client';
// import { axiosClient } from '../views/axios.client';

export const DefaultLayout: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, token, setUser, setToken, notification } = useStateContext();

  useEffect(() => {
    axiosClient.get('/user')
      .then(({ data }) => {
        setUser(data);
      })
  }, [setUser]);

  if (!token) {
    return <Navigate to="/login" />
  }

  const onLogout = (e: React.MouseEvent) => {
    e.preventDefault();

    axiosClient.post('/logout')
      .then(() => {
        setUser(null);
        setToken(null);
      })
  }

  console.log(user?.name);

  return (
    <div id="defaultLayout">
      <aside>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/users">Users</Link>
      </aside>
      {notification &&
        <div className="notification">
          {notification}
        </div>
      }
      <div className="content">
        <header>
          <div>
            Header
          </div>
          <div>
            {user?.name}
            <a href="#" onClick={onLogout} className="btn-logout">Logout</a>
          </div>
        </header>

        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
