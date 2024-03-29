import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MessageModelInterface } from "../../types/interfaces";
import { InboxItem } from "./InboxItem";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../../hooks/useAppData";
import { UserProfilePhoto } from "../UserProfilePhoto";
import moment from "moment";
import { useMutation } from "@apollo/client";
import { READ_MESSAGES_MUTATION } from "../../graphql/mutations/read-messages";
import { CURRENT_USER_QUERY } from "../../graphql/queries/current-user";

interface InboxProps {
  messages: {
    [key: string]: MessageModelInterface[];
  };
}

export const QUERY_PARAM = "from-user";

export const Inbox = ({ messages }: InboxProps): JSX.Element => {
  const [expandedItem, setExpandedItem] = useState<string>("");
  const navigate = useNavigate();
  const { currentUser } = useAppData();
  const [readMessages] = useMutation(READ_MESSAGES_MUTATION);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpandedItem("");
        navigate("/messages");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [navigate]);

  const handleReadMessages = useCallback(
    async (messageIds: string[]) => {
      await readMessages({
        variables: {
          messageIds,
        },
        refetchQueries: [CURRENT_USER_QUERY],
      });
    },
    [readMessages]
  );

  const setExpandedFromQueryParam = useCallback(async () => {
    const params = new URLSearchParams(window.location.search);
    const fromUser = params.get(QUERY_PARAM);
    if (fromUser) {
      setExpandedItem(fromUser);

      const unreadMessages = messages[fromUser]?.filter(
        (message) => message.fromId.id !== currentUser?.id && !message.hasRead
      );

      if (unreadMessages?.length > 0) {
        await handleReadMessages(unreadMessages?.map((message) => message.id));
      }
    }
  }, [messages, handleReadMessages, currentUser]);

  useLayoutEffect(() => {
    setExpandedFromQueryParam();
  }, [setExpandedFromQueryParam]);

  useLayoutEffect(() => {
    window.addEventListener("popstate", setExpandedFromQueryParam);
    return () => {
      window.removeEventListener("popstate", setExpandedFromQueryParam);
    };
  }, [setExpandedFromQueryParam]);

  const handleExpandChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpandedItem(isExpanded ? panel : "");
      if (isExpanded) {
        navigate(`/messages?${QUERY_PARAM}=${panel}`);
      } else {
        navigate("/messages");
      }
    };

  return (
    <Box>
      {Object.keys(messages).length > 0 && (
        <Box mb={4}>
          {Object.keys(messages).map((key) => {
            const unreadMessagesCount = messages[key].filter(
              (message) =>
                message.fromId.id !== currentUser?.id && !message.hasRead
            ).length;
            return (
              <Accordion
                key={key}
                expanded={expandedItem === key}
                onChange={async (_event, isExpanded) => {
                  if (isExpanded) {
                    await handleReadMessages(
                      messages[key].map((message) => message.id)
                    );
                  }
                  handleExpandChange(key)(_event, isExpanded);
                }}
                sx={{
                  backgroundColor: "#f2f2f2",
                  marginBottom: 2,
                  '[class*="expandIconWrapper"]': {
                    transition: "none !important",
                  },
                }}
                slotProps={{
                  transition: {
                    timeout: 0,
                  },
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel-${key}-content`}
                  id={`panel-${key}-header`}
                  sx={{
                    height: 50,
                    "&.Mui-expanded": {
                      height: 50,
                      minHeight: 50,
                    },
                  }}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    gap={2}
                    width="100%"
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      gap={2}
                    >
                      <Box>
                        <UserProfilePhoto
                          src={
                            currentUser?.id !== messages[key][0]?.fromId?.id
                              ? messages[key][0]?.fromId?.photo
                              : (messages[key][0]?.toId?.photo as any)
                          }
                          name={
                            currentUser?.id !== messages[key][0]?.fromId?.id
                              ? messages[key][0]?.fromId?.username
                              : (messages[key][0]?.toId?.username as any)
                          }
                          height={30}
                          width={30}
                        />
                      </Box>
                      <Box>
                        <Typography>
                          {currentUser?.id !== messages[key][0]?.fromId?.id
                            ? messages[key][0]?.fromId?.username
                            : messages[key][0].toId?.username}
                        </Typography>
                      </Box>
                    </Box>
                    <Box mr={2}>
                      <Typography variant="body2" fontStyle="italic">
                        Last message sent on{" "}
                        <b>
                          {moment(
                            parseInt(
                              messages[key][messages[key].length - 1]?.createdAt
                            )
                          ).format("MM DD YY, h:mm:ss a")}
                        </b>
                        {" by"}
                        <b>
                          {messages[key][messages[key].length - 1]?.fromId
                            ?.id === currentUser?.id
                            ? " you"
                            : ` ${
                                messages[key][messages[key].length - 1]?.fromId
                                  ?.username
                              }`}
                        </b>
                      </Typography>
                      {unreadMessagesCount > 0 && (
                        <Box className="unread-messages-count">
                          <Typography variant="body2" color="error">
                            {unreadMessagesCount} unread
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <InboxItem
                    messages={messages[key]}
                    numToShow={9999}
                    variant="default"
                  />
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
