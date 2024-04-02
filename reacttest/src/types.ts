export interface ContextType {
  user: UserType | null;
  token: string | null;
  // eslint-disable-next-line @typescript-eslint/ban-types
  setUser: (user: UserType | null) => void;
  setToken: (token: string | null) => void;
}

export interface UserType {
  name: string,
  email: string,
}

export interface ErrorMessages {
  [key: string]: string[];
}
