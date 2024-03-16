import { MessageModelInterface } from "../../types/interfaces";
import { FetchResult, useMutation, useSubscription } from "@apollo/client";
import { MESSAGE_SUBSCRIPTION } from "./subscription";
import { useAuth } from "../../hooks/useAuth";
import { useSnackbar } from "notistack";
import { useAppData } from "../../hooks/useAppData";
import { createContext } from "react";
import { SEND_MESSAGE_MUTATION } from "./mutations";
import { CURRENT_USER_QUERY } from "../AppData/queries";
import { Box, Typography } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { QUERY_PARAM } from "../../components/Inbox/Inbox";

export interface MessageContextInterface {
  messages?: MessageModelInterface[];
  sendMessageMutation: (
    input: Pick<MessageModelInterface, "content"> & { toId: string }
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
  const navigate = useNavigate();
  const location = useLocation();

  useSubscription(MESSAGE_SUBSCRIPTION, {
    skip: !isLoggedIn,
    onData: ({ data: { data } }) => {
      const messagePagePath = `/messages?${QUERY_PARAM}=${data.messageSent.fromId?.id}`;
      const params = new URLSearchParams(window.location.search);
      const fromUser = params.get(QUERY_PARAM);
      addToMessagesAction(data.messageSent);
      if (
        `${location.pathname}?${QUERY_PARAM}=${fromUser}` !== messagePagePath
      ) {
        enqueueSnackbar(
          <Box
            onClick={() => navigate(messagePagePath)}
            sx={{
              cursor: "pointer",
            }}
          >
            <Typography variant="h6" m={0} fontWeight="bold" fontSize="0.9rem">
              New message from {data.messageSent.fromId?.username}
            </Typography>
            <Typography variant="body1" fontSize="0.8rem" m={0}>
              {data.messageSent.content.length > 20
                ? `${data.messageSent.content.slice(0, 20)}...`
                : `${data.messageSent.content}`}
            </Typography>
          </Box>,
          { variant: "info" }
        );
      }
    },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE_MUTATION);

  const sendMessageMutation = async (
    input: Pick<MessageModelInterface, "content"> & { toId: string }
  ) => {
    try {
      return await sendMessage({
        variables: {
          data: {
            ...input,
            type: "PRIVATE",
          },
        },
        refetchQueries: [CURRENT_USER_QUERY],
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
