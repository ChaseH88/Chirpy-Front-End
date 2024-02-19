import { useContext } from 'react';
import { StateContext } from '../providers/Auth';

export const useAuth = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAuth must be used within a AppDataProvider');
  }
  return context;
};
