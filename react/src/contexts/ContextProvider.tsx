import { ReactNode, createContext, useState } from 'react';
import { ContextType, UserType } from '../types/types';

const defaultContextValue: ContextType = {
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
  notification: '',
  setNotification: () => {}
};

export const StateContext = createContext<ContextType>(defaultContextValue);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
  const [notification, _setNotification] = useState<string>('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('ACCESS_TOKEN'));

  // storing token in local storage
  // localStorage.getItem('ACCESS_TOKEN')

  // encrypt decrypt token funkcionalumas

  const updateToken = (newToken: string | null) => {
    setToken(newToken);
    if(newToken) {
      localStorage.setItem('ACCESS_TOKEN', newToken);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  };

  const setNotification = (message: string) => {
    _setNotification(message);
    setTimeout(() => {
      _setNotification('');
    }, 5000)
  }

  return (
    <StateContext.Provider value={{
      user,
      token,
      setUser,
      setToken: updateToken,
      notification,
      setNotification
    }}>
      {children}
    </StateContext.Provider>
  );
};
