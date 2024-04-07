import { useEffect, useState } from 'react';
import { axiosClient } from './axios.client';
import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/useStateContext';

interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

interface PaginationInfo {
  currentPage: number;
  lastPage: number;
  nextPageUrl: string | null;
  prevPageUrl: string | null;
}

export const Users: React.FC = () => {
  const [users, setUsers] = useState<User[] | null>();
  const { setNotification } = useStateContext();
  const [pagination, setPagination] = useState<PaginationInfo>({
    currentPage: 1,
    lastPage: 1,
    nextPageUrl: null,
    prevPageUrl: null,
  });
  const [loading, setLoading] = useState<boolean>(false);

  const getUsers = (page = 1) => {
    setLoading(true);
    axiosClient.get(`/users?page=${page}`)
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        setPagination({
          currentPage: data.meta.current_page,
          lastPage: data.meta.last_page,
          nextPageUrl: data.links.next,
          prevPageUrl: data.links.prev,
        });
      })
      .catch(() => {
        setLoading(false);
      });
  }

  const onDelete = (user: User) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    axiosClient.delete(`/users/${user.id}`)
      .then(() => {
        setNotification("User was succesfully deleted");
        getUsers();
      })
  }

  useEffect(() => {
    getUsers();
  }, [])

  return (
    <div>
      <div className="users">
        <h1>Users</h1>
        <Link to="/users/new" className="btn-add">Add new User</Link>
      </div>

      <table className="card animated fadeInDown">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Create Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} className="text-center loader__container">
                <div className="loader"></div>
              </td>
            </tr>
          ) : users && users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.created_at}</td>
              <td>
                <Link to={'/users/' + user.id} className="btn-edit">Edit</Link>
                &nbsp;
                <button onClick={() => onDelete(user)} className='btn-delete'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {pagination.prevPageUrl && (
          <button
            onClick={() => getUsers(pagination.currentPage - 1)}
            className="btn-prev"
          >
            Previous
          </button>
        )}
        {pagination.nextPageUrl && (
          <button
            onClick={() => getUsers(pagination.currentPage + 1)}
            className="btn-next"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
