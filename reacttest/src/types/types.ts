export interface ContextType {
  user: UserType | null;
  token: string | null;
  setUser: (user: UserType | null) => void;
  setToken: (token: string | null) => void;
  notification: string;
  setNotification: (message: string) => void;
}

export interface UserType {
  name: string,
  email: string,
}

export interface ErrorMessages {
  [key: string]: string[];
}

export interface UserFormState {
  id: string | null;
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}
