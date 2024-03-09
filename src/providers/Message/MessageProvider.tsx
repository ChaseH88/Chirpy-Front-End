import React, { useCallback, useEffect, useState } from "react";
import { UserModelInterface } from "../../types/interfaces";
import { useSubscription } from "@apollo/client";
import { MESSAGE_SUBSCRIPTION } from "./subscription";
import { useAuth } from "../../hooks/useAuth";

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
  const { data, error } = useSubscription(MESSAGE_SUBSCRIPTION, {
    skip: !isLoggedIn,
  });
  console.log("data", data);
  console.log("error", error);

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
