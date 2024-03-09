import { MessageModelInterface } from "../../types/interfaces";
import { useSubscription } from "@apollo/client";
import { MESSAGE_SUBSCRIPTION } from "./subscription";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "notistack";
import { useAppData } from "../../hooks/useAppData";
import { createContext } from "react";

export interface MessageContextInterface {
  messages?: MessageModelInterface[];
}

export const MessageContext = createContext<
  MessageContextInterface | undefined
>(undefined);

const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const { isLoggedIn } = useAuth();
  const { addToMessagesAction } = useAppData();
  const { enqueueSnackbar } = useSnackbar();
  useSubscription(MESSAGE_SUBSCRIPTION, {
    skip: !isLoggedIn,
    onData: ({ data: { data } }) => {
      addToMessagesAction(data.messageSent);
      enqueueSnackbar("New message received", { variant: "info" });
    },
  });

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
