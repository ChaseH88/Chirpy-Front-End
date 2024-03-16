import React, { useContext, useEffect, useReducer } from "react";
import {
  MessageModelInterface,
  UserModelInterface,
} from "../../types/interfaces";
import { StateContext as AuthStateContext } from "../Auth";
import { OperationVariables, useQuery } from "@apollo/client";
import { CURRENT_USER_QUERY } from "./queries";
import { normalizeGraphQLError } from "../../utilities/normalize-graphql-error";
import { client } from "../Apollo";

export interface CurrentUserInterface extends UserModelInterface {
  messages: MessageModelInterface[];
}

export interface AppDataContext {
  currentUser: CurrentUserInterface | null;
  setCurrentUser: (user: CurrentUserInterface | null) => void;
  addToMessagesAction: (message: MessageModelInterface) => void;
  loading: boolean;
  refetchCurrentUser: (
    variables?: Partial<OperationVariables> | undefined
  ) => Promise<any>;
}
interface StateType {
  currentUser: CurrentUserInterface | null;
}

const initialState: StateType = {
  currentUser: null,
};

type Actions =
  | {
      type: "SET_CURRENT_USER";
      payload: CurrentUserInterface | null;
    }
  | {
      type: "ADD_TO_MESSAGES";
      payload: MessageModelInterface;
    };

const reducer = (state: StateType, action: Actions): StateType => {
  switch (action.type) {
    case "SET_CURRENT_USER":
      return { ...state, currentUser: action.payload };
    case "ADD_TO_MESSAGES":
      if (state.currentUser) {
        return {
          ...state,
          currentUser: {
            ...state.currentUser,
            messages: [...state.currentUser.messages, action.payload],
          },
        };
      }
      return state;
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
    refetch: refetchCurrentUser,
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

  const setCurrentUser = (user: CurrentUserInterface | null) => {
    dispatch({ type: "SET_CURRENT_USER", payload: user });
  };

  const addToMessagesAction = (message: MessageModelInterface) => {
    dispatch({ type: "ADD_TO_MESSAGES", payload: message });

    client.writeQuery({
      query: CURRENT_USER_QUERY,
      data: {
        currentUser: {
          user: {
            ...state.currentUser,
            messages: [...(state.currentUser?.messages as any), message],
          },
        },
      },
    });
  };

  useEffect(() => {
    if (data && data?.currentUser?.user) {
      setCurrentUser({
        ...data.currentUser.user,
        messages: data.currentUser.messages,
      });
    }
  }, [data]);

  return (
    <StateContext.Provider
      value={{
        currentUser: state.currentUser,
        setCurrentUser,
        loading: useQueryLoading,
        addToMessagesAction,
        refetchCurrentUser,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export { AppDataProvider };
