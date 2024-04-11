import { useContext } from 'react';
import { StateContext } from './ContextProvider';

export const useStateContext = () => useContext(StateContext);
