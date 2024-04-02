import { ReactNode, createContext, useState } from 'react';
import { ContextType, UserType } from '../types';

const defaultContextValue: ContextType = {
  user: null,
  token: null,
  setUser: () => {},
  setToken: () => {},
};

export const StateContext = createContext<ContextType>(defaultContextValue);

export const ContextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserType | null>(null);
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
  }

  return (
    <StateContext.Provider value={{
      user,
      token,
      setUser,
      setToken: updateToken,
    }}>
      {children}
    </StateContext.Provider>
  );
};
