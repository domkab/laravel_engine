/* eslint-disable no-console */
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/useStateContext';
import { ErrorMessages } from '../types/types';
import { axiosClient } from './axios.client';

export const Login: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const { setUser, setToken } = useStateContext();
  const [errors, setErrors] = useState<ErrorMessages | null>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const payload = {
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
    };

    setErrors(null);

    axiosClient.post('/login', payload)
      .then(({ data }) => {
        console.log(data, 'data');
        setUser(data.user);
        setToken(data.token);
        setErrors(null);
      })
      .catch(err => {
        console.log(err);
        const response = err.response;
        if (response && response.status === 422) {
          if (response.data.errors) {
            setErrors({ ...response.data.errors });
          } else {
            setErrors({
              email: [response.data.message],
            })
            console.log(errors, 'errors as errors message format');
          }
        }
      })
    console.log(errors, 'errors');
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form action="" onSubmit={onSubmit}>
          <h1 className="title">Login into your account</h1>
          {errors && <div className="alert">
            {Object.keys(errors).map(
              key => errors[key].length > 0 && (
                <p key={key}>
                  {errors[key][0]}
                </p>
              )
            )}
          </div>
          }
          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <button className="btn btn-block">Login</button>

          <p className="message">
            Not Registered? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
