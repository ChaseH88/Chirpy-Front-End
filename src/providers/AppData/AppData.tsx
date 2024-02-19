import React, { useEffect, useReducer, useState } from 'react';
import { UserModelInterface } from '../../types/interfaces';

export interface AppDataContext {
  currentUser: UserModelInterface | null;
  setCurrentUser: (user: UserModelInterface | null) => void;
}

type Action = { type: 'SET_CURRENT_USER'; payload: UserModelInterface | null };

interface StateType {
  currentUser: UserModelInterface | null;
}

const initialState: StateType = {
  currentUser: null,
};

const reducer = (state: StateType, action: Action): StateType => {
  switch (action.type) {
    case 'SET_CURRENT_USER':
      return { ...state, currentUser: action.payload };
    default:
      throw new Error('Unhandled action type');
  }
};

export const StateContext = React.createContext<AppDataContext | undefined>(
  undefined
);

const AppDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setCurrentUser = (user: UserModelInterface | null) => {
    dispatch({ type: 'SET_CURRENT_USER', payload: user });
  };

  return (
    <StateContext.Provider
      value={{
        currentUser: state.currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export { AppDataProvider };
