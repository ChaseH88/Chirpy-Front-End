import { useAppData } from "../../hooks/useAppData";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Box } from "@mui/material";
import { Avatar } from "../../components/Avatar";
import { useMessages } from "../../hooks/useMessages";
import { MessageModelInterface } from "../../types/interfaces";
import { useMemo } from "react";
import { SendMessage } from "../../components/SendMessage";

const normalizeMessages = (
  messages: MessageModelInterface[] | undefined,
  currentUserId: string
) => {
  if (!messages) {
    return {};
  }
  const sortedMessages = messages.reduce((acc: any, message: any) => {
    if (!acc[message.fromId?.id] && message.fromId?.id !== currentUserId) {
      acc[message.fromId?.id] = [];
    }
    acc[message.fromId?.id]?.push(message);
    return acc;
  }, {});

  for (let msg in messages) {
    if (messages[msg]?.fromId?.id === currentUserId) {
      sortedMessages[messages[msg]?.toId?.id].push(messages[msg]);
    }
  }

  for (let key in sortedMessages) {
    sortedMessages[key] = sortedMessages[key].sort(
      (a: MessageModelInterface, b: MessageModelInterface) => {
        const date = (d: string) => new Date(parseInt(d)).getTime();
        return date(a.createdAt) - date(b.createdAt);
      }
    );
  }

  return sortedMessages;
};

const MessagesPage = () => {
  const { currentUser } = useAppData();
  const { messages: messagesArr } = useMessages();
  const messages = useMemo(
    () => normalizeMessages(messagesArr, currentUser!.id),
    [messagesArr, currentUser]
  );

  return (
    <DashboardLayout
      PostsComponent={() => (
        <Box
          borderRadius={3}
          sx={{
            backgroundColor: "background.paper",
          }}
          p={4}
        >
          <Box mb={5} borderBottom={1} borderColor="primary.main" pb={5}>
            {!!Object.keys(messages)?.length && (
              <Box>
                {Object.keys(messages).map((key) => {
                  return (
                    <Box key={key}>
                      <h3>{key}</h3>
                      <hr />
                      {messages[key].map((message: MessageModelInterface) => {
                        return (
                          <Box key={message.id}>
                            <h4>{message.fromId?.username}</h4>
                            <p>{message.content}</p>
                          </Box>
                        );
                      })}
                      <SendMessage
                        toId={key}
                        username={messages[key][0]?.fromId?.username}
                      />
                    </Box>
                  );
                })}
              </Box>
            )}
          </Box>
          <Box px={4} py={2}>
            see your messages here
          </Box>
        </Box>
      )}
      AvatarComponent={() => (
        <Box>
          <Avatar user={currentUser!} />
        </Box>
      )}
    />
  );
};

export { MessagesPage };
