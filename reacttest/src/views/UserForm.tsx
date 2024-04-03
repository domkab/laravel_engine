import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { axiosClient } from './axios.client';
import { ErrorMessages, UserFormState } from '../types/types';
import { areInputFieldsEmpty } from '../utils/areInputFieldsEmpty';
import { useStateContext } from '../contexts/useStateContext';

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
  const [errors, setErrors] = useState<ErrorMessages | null>(null);
  const [user, setUser] = useState<UserFormState>(initialUserState);
  const [isModified, setIsModified] = useState<boolean>(false);
  const { setNotification } = useStateContext();

  // const validateForEmptyFields = (): boolean => {
  //   const requiredFields: Array<keyof UserFormState>
  //     = ['name', 'email', 'password'];
  //   const newErrors = areInputFieldsEmpty(user, requiredFields);

  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const validateForEmptyFields = (): boolean => {
    // Only validate fields if it's a new user or fields have been modified
    if (!user.id || isModified) {
      const requiredFields: Array<keyof UserFormState> = ['name', 'email', 'password'];
      const newErrors = areInputFieldsEmpty(user, requiredFields);

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    }
    return true;
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors(null);

    if (!validateForEmptyFields()) {
      return;
    }

    if (user.id) {
      axiosClient.put(`/users/${user.id}`, user)
        .then(() => {
          setNotification("User was succesfully updated")
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
          setNotification("User was succesfully created");
          navigate('/users');
        })
        .catch(err => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        })
    }
  };

  const handleInputChange = <T extends keyof UserFormState>(
    field: T, value: UserFormState[T]
  ) => {
    setUser((prev) => ({ ...prev, [field]: value }));
    setIsModified(true);
  };

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
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder="Name"
            />

            <input
              value={user.email}
              onChange={e => handleInputChange('email', e.target.value)}
              type="email"
              placeholder="Email"
            />

            <input
              onChange={e => handleInputChange('password', e.target.value)}
              type="password"
              placeholder="Password"
            />

            <input
              onChange={e => handleInputChange('password_confirmation', e.target.value)}
              type="password"
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

