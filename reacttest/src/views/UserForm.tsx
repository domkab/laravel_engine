import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { axiosClient } from './axios.client';

export const UserForm: React.FC = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState(null);
  const [user, setUser] = useState({
    id: null,
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setErrors(null);
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/users/${id}`)
        .then(({ data }) => {
          setUser(data.data);
          console.log(data);
          setLoading(false);
        })
        .catch((err) => {
          setErrors(err)
          setLoading(false);
        });
    }
  }, [id]);

  return (
    <>
      {user.id &&
        <h1>Update User: {user.name}</h1>
      }
      {!user.id &&
        <h1>New User</h1>
      }
      <div className="card animated fadeInDown">
        {loading && (
          <div className="loader"></div>
        )}

        {errors &&
          <div className="alert">
            {Object.keys(errors).map(key => (
              <p key={key}>{errors[key][0]}</p>
            ))}
          </div>
        }

        {!loading &&
          <form onSubmit={onSubmit}>
            <input
              value={user.name}
              onChange={e => setUser({ ...user, name: e.target.value })}
              placeholder="Name"
            />

            <input
              value={user.email}
              onChange={e => setUser({ ...user, email: e.target.value })}
              placeholder="Email"
            />

            <input
              onChange={e => setUser({ ...user, password: e.target.value })}
              placeholder="Password"
            />

            <input
              onChange={e => setUser({ ...user, password_confirmation: e.target.value })}
              placeholder="Password Confirmation"
            />

            <button className='btn'>Save</button>
          </form>
        }
      </div>

      <Link to="/users" className="">Go back</Link>
    </>

  )
};

