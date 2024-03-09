import { MessageModelInterface } from "../../types/interfaces";
import { FetchResult, useMutation, useSubscription } from "@apollo/client";
import { MESSAGE_SUBSCRIPTION } from "./subscription";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "notistack";
import { useAppData } from "../../hooks/useAppData";
import { createContext } from "react";
import { SEND_MESSAGE_MUTATION } from "./mutations";

export interface MessageContextInterface {
  messages?: MessageModelInterface[];
  sendMessageMutation: (
    input: Pick<MessageModelInterface, "content" | "toId">
  ) => Promise<
    | FetchResult<{
        data: {
          sendMessage: MessageModelInterface;
        };
      }>
    | undefined
  >;
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
  const { addToMessagesAction, currentUser } = useAppData();
  const { enqueueSnackbar } = useSnackbar();

  useSubscription(MESSAGE_SUBSCRIPTION, {
    skip: !isLoggedIn,
    onData: ({ data: { data } }) => {
      addToMessagesAction(data.messageSent);
      enqueueSnackbar("New message received", { variant: "info" });
    },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);

  const sendMessageMutation = async (
    input: Pick<MessageModelInterface, "content" | "toId">
  ) => {
    try {
      return await sendMessage({
        variables: {
          data: {
            ...input,
            type: "PRIVATE",
          },
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <MessageContext.Provider
      value={{
        messages: currentUser?.messages || [],
        sendMessageMutation,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
};

export { MessageProvider };
