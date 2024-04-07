/* eslint-disable no-console */
import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStateContext } from '../contexts/useStateContext';
import { ErrorMessages } from '../types/types';
import { axiosClient } from './axios.client';

export const Signup: React.FC = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const passwordConfirmationRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<ErrorMessages | null>(null);
  const {
    setToken
  } = useStateContext();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload = {
      name: nameRef.current?.value,
      email: emailRef.current?.value,
      password: passwordRef.current?.value,
      password_confirmation: passwordConfirmationRef.current?.value,
    }
    console.log(payload);

    axiosClient.post('/signup', payload)
      .then(({ data }) => {
        console.log(data);
        setToken(data.token);
        setErrors(null);
      })
      .catch(err => {
        console.log(err);
        const response = err.response;
        if (response && response.status === 422) {
          console.log(response.data.errors);
          setErrors({ ...response.data.errors });
        }
      })
    console.log(errors, 'errors');
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form action="" onSubmit={onSubmit}>
          <h1 className="title">
            Sign up
          </h1>
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
          <input ref={nameRef} type="text" placeholder="Full Name" />
          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <input ref={passwordConfirmationRef} type="password" placeholder="Password Confirmation" />
          <button className="btn btn-block">Sign up</button>

          <p className="message">
            Already Registered? <Link to="/login">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
