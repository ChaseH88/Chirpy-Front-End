import React, { useCallback, useEffect, useState } from "react";
import { UserModelInterface } from "../../types/interfaces";
import { useSubscription } from "@apollo/client";
import { MESSAGE_SUBSCRIPTION } from "./subscription";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "notistack";

export interface MessageInterface {
  fromId: string;
  toId: string;
  type: "PRIVATE" | "GROUP";
  content: string;
  likes: UserModelInterface[];
  dislikes: UserModelInterface[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageContextInterface {
  messages?: MessageInterface[];
}

export const MessageContext = React.createContext<
  MessageContextInterface | undefined
>(undefined);

const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { isLoggedIn } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { data } = useSubscription(MESSAGE_SUBSCRIPTION, {
    skip: !isLoggedIn,
  });

  useEffect(() => {
    if (data?.messageSent) {
      enqueueSnackbar(`message from ${data?.messageSent?.fromId.username}`, {
        variant: "success",
      });
    }
  }, [enqueueSnackbar, data]);

  return (
    <MessageContext.Provider
      value={{
        messages: [],
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export { MessageProvider };
