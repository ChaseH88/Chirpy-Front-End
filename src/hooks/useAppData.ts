import { useContext } from 'react';
import { StateContext } from '../providers/AppData';

export const useAppData = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error('useAppData must be used within a AppDataProvider');
  }
  return context;
};
