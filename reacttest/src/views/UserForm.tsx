import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { axiosClient } from './axios.client';
import { UserFormState } from '../types/UserFormState';

const initialUserState: UserFormState = {
  id: null,
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
};

export const UserForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string[]> | null>(null);
  const [user, setUser] = useState<UserFormState>(initialUserState);

  const validateInputs = (): boolean => {
    const newErrors: Record<string, string[]> = {};
    const requiredFields = ['name', 'email', 'password'];

    requiredFields.forEach(field => {
      if (!user[field as keyof UserFormState]) {
        newErrors[field] = [`${field.charAt(0).toUpperCase() + field.slice(1)} is required.`];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);

    if (!validateInputs()) {
      return;
    }

    if (user.id) {
      axiosClient.put(`/users/${user.id}`, user)
        .then(() => {
          // TODO show notification
          navigate('/users');
          setLoading(false);
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors({ ...response.data.errors });
          }
        });
    } else {
      axiosClient.post('users', user)
        .then(() => {
          navigate('/users');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        })
    }
  }

  useEffect(() => {
    if (id) {
      setLoading(true);
      axiosClient.get(`/users/${id}`)
        .then(({ data }) => {
          setUser(data);

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

