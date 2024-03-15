import { useEffect, useRef, useState } from "react";
import { Box, Button } from "@mui/material";
import { MessageModelInterface } from "../../types/interfaces";
import { InboxMessage, InboxMessageProps } from "./InboxMessage";
import { SendMessage } from "../SendMessage";

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
  const ref = useRef<HTMLDivElement>(null);

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
      <Box maxHeight={400} overflow={"auto scroll"} ref={ref}>
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
      <SendMessage message={messages[0]} />
    </Box>
  );
};
