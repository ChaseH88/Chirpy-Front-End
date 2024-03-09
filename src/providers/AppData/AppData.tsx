import React, { useContext, useEffect, useReducer } from "react";
import { UserModelInterface } from "../../types/interfaces";
import { StateContext as AuthStateContext } from "../Auth";
import { useQuery } from "@apollo/client";
import { CURRENT_USER_QUERY } from "./queries";
import { normalizeGraphQLError } from "../../utilities/normalize-graphql-error";

export interface AppDataContext {
  currentUser: UserModelInterface | null;
  setCurrentUser: (user: UserModelInterface | null) => void;
  loading: boolean;
}
interface StateType {
  currentUser: UserModelInterface | null;
}

const initialState: StateType = {
  currentUser: null,
};

type Actions = { type: "SET_CURRENT_USER"; payload: UserModelInterface | null };

const reducer = (state: StateType, action: Actions): StateType => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };
    default:
      throw new Error("Unhandled action type");
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
  const { isLoggedIn, getToken, logout } = useContext(AuthStateContext)!;
  const {
    data,
    loading: useQueryLoading,
    error: currentUserError,
  } = useQuery(CURRENT_USER_QUERY, {
    variables: { token: getToken() },
    skip: !isLoggedIn,
    defaultOptions: {
      fetchPolicy: "network-only",
    },
  });

  useEffect(() => {
    if (currentUserError) {
      const error = normalizeGraphQLError(currentUserError);
      if (error) {
        logout();
      }
    }
  }, [currentUserError, logout]);

  const setCurrentUser = (user: UserModelInterface | null) => {
    dispatch({ type: "SET_CURRENT_USER", payload: user });
  };

  useEffect(() => {
    if (data && data?.currentUser?.user) {
      setCurrentUser(data.currentUser.user);
    }
  }, [data]);

  return (
    <StateContext.Provider
      value={{
        currentUser: state.currentUser,
        setCurrentUser,
        loading: useQueryLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export { AppDataProvider };
