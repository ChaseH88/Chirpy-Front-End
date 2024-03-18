import { useAppData } from "../../hooks/useAppData";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import { useMessages } from "../../hooks/useMessages";
import { MessageModelInterface } from "../../types/interfaces";
import { useLayoutEffect, useState } from "react";
import { Inbox } from "../../components/Inbox";
import { useQuery } from "@apollo/client";
import { SEARCH_QUERY } from "./queries";
import { useForm } from "react-hook-form";
import { Form, FormInput } from "../../components/Form";
import { useNavigate } from "react-router-dom";
import { QUERY_PARAM } from "../../components/Inbox/Inbox";

const normalizeMessages = (
  messages: MessageModelInterface[] | undefined,
  currentUserId: string
) => {
  if (!messages) {
    return {};
  }

  let inbox: { [key: string]: MessageModelInterface[] } = {};

  messages.forEach((message) => {
    if (!inbox[message.fromId?.id] && message.fromId?.id !== currentUserId) {
      inbox[message.fromId?.id] = [];
    }
    if (!inbox[message.toId?.id] && message.toId?.id !== currentUserId) {
      inbox[message.toId?.id] = [];
    }
  });

  messages.forEach((message) => {
    if (message.fromId?.id === currentUserId) {
      inbox[message.toId?.id]?.push(message);
    }
    if (message.toId?.id === currentUserId) {
      inbox[message.fromId?.id]?.push(message);
    }
  });

  for (let key in inbox) {
    inbox[key] = inbox[key].sort(
      (a: MessageModelInterface, b: MessageModelInterface) => {
        const date = (d: string) => new Date(parseInt(d)).getTime();
        return date(a.createdAt) - date(b.createdAt);
      }
    );
  }
  return inbox;
};

const MessagesPage = () => {
  const { currentUser } = useAppData();
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [messages, setMessages] = useState<{
    [key: string]: MessageModelInterface[];
  } | null>(null);
  const { sendMessageMutation } = useMessages();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const { data } = useQuery(SEARCH_QUERY);
  const { messages: messagesArr } = useMessages();
  const navigate = useNavigate();
  const formHook = useForm({
    defaultValues: {
      content: "",
    },
    reValidateMode: "onChange",
  });

  useLayoutEffect(() => {
    if (messagesArr) {
      setMessages(normalizeMessages(messagesArr, currentUser!.id));
    }
  }, [messagesArr, currentUser]);

  const handleSendMessage = async (data: { toId: string; content: string }) => {
    await sendMessageMutation({
      toId: selectedUser!,
      content: data.content,
    });
    formHook.reset();
    setShowNewMessage(false);
    navigate(`/messages?${QUERY_PARAM}=${selectedUser}`);
  };

  const inputs: FormInput[] = [
    {
      name: "content",
      type: "textarea",
      placeholder: `Send a message to ${
        data?.search?.users.find((user: any) => user.id === selectedUser)
          ?.username || "..."
      }`,
      required: true,
      hideLabel: true,
    },
  ];

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
          <Box mb={2}>
            {!showNewMessage ? (
              <Box display="flex" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" m={0} lineHeight={1}>
                    Messages
                  </Typography>
                </Box>
                <Box>
                  <Button
                    onClick={() => setShowNewMessage(true)}
                    variant="contained"
                    color="primary"
                  >
                    New Message
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box
                display="flex"
                justifyContent="space-between"
                flexWrap="wrap"
              >
                <Box>
                  <Typography variant="h4" m={0} lineHeight={1}>
                    New Message
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  justifyContent="flex-end"
                  alignItems="center"
                >
                  <Box>
                    <Select
                      value={selectedUser || "Select User"}
                      onChange={(e) => setSelectedUser(e.target.value)}
                    >
                      <MenuItem value={"Select User"} disabled>
                        Select User
                      </MenuItem>
                      {data?.search?.users
                        .filter((user: any) => currentUser?.id !== user.id)
                        .sort((a: any, b: any) =>
                          a.username.localeCompare(b.username)
                        )
                        ?.map((user: any) => (
                          <MenuItem value={user.id}>{user.username}</MenuItem>
                        ))}
                    </Select>
                  </Box>
                  <Box ml={2}>
                    <Button
                      onClick={() => {
                        setShowNewMessage(false);
                        setSelectedUser(null);
                      }}
                      variant="contained"
                      color="primary"
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
                {selectedUser && (
                  <Box flex={"1 1 100%"} my={2}>
                    <Form<any>
                      inputs={inputs}
                      onSubmit={handleSendMessage}
                      submitText="Send"
                      formHook={formHook}
                    />
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Box mb={5} borderBottom={1} borderColor="primary.main" pb={5}>
            {messages && !!Object.keys(messages)?.length && (
              <Box>
                <Inbox messages={messages} />
              </Box>
            )}
          </Box>
        </Box>
      )}
    />
  );
};

export { MessagesPage };
