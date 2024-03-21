import { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { MessageModelInterface } from "../../types/interfaces";
import { InboxMessage, InboxMessageProps } from "./InboxMessage";
import { SendMessage } from "../SendMessage";
import { useAppData } from "../../hooks/useAppData";
import { useNavigate } from "react-router-dom";

interface InboxItemProps extends Pick<InboxMessageProps, "variant"> {
  messages: MessageModelInterface[];
  numToShow?: number;
  showMore?: boolean;
}

export const InboxItem = ({
  messages,
  numToShow = 2,
  variant,
  showMore = true,
}: InboxItemProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentUser } = useAppData();
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleOnSend = () => {
    navigate(
      `/messages?from-user=${
        messages[0]?.fromId?.id === currentUser?.id
          ? messages[0]?.toId?.id
          : messages[0]?.fromId?.id
      }`
    );
  };

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, []);

  const toggleMessages = () => {
    setIsExpanded(!isExpanded);
  };

  const displayedMessages = isExpanded
    ? messages
    : messages.slice(0, numToShow);

  return (
    <Box className="inbox-item">
      <Box
        maxHeight={400}
        overflow={"auto scroll"}
        ref={ref}
        sx={{
          backgroundColor: "white",
        }}
        p={2}
      >
        {displayedMessages.map((message: MessageModelInterface) => (
          <Box key={message.id}>
            <InboxMessage message={message} variant={variant} />
          </Box>
        ))}
        {messages.length > numToShow && showMore && (
          <Box textAlign="center">
            <Button onClick={toggleMessages} variant="text" color="primary">
              {isExpanded ? "Show less" : "Show more"}
            </Button>
          </Box>
        )}
      </Box>
      <SendMessage
        onSendMessage={handleOnSend}
        toUsername={
          messages[0]?.fromId?.id === currentUser?.id
            ? messages[0]?.toId?.username
            : messages[0]?.fromId?.username
        }
        toId={
          messages[0]?.fromId?.id === currentUser?.id
            ? messages[0]?.toId?.id
            : messages[0]?.fromId?.id
        }
      />
    </Box>
  );
};
