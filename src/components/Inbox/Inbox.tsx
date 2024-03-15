import { Box, Typography } from "@mui/material";
import { MessageModelInterface } from "../../types/interfaces";
import { InboxItem } from "./InboxItem";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { InboxMessage } from "./InboxMessage";
import { useNavigate } from "react-router-dom";

interface InboxProps {
  messages: {
    [key: string]: MessageModelInterface[];
  };
}

const QUERY_PARAM = "from-user";

export const Inbox = ({ messages }: InboxProps): JSX.Element => {
  const [expandedItem, setExpandedItem] = useState<string>("");
  const navigate = useNavigate();

  const setExpandedFromQueryParam = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    const fromUser = params.get(QUERY_PARAM);
    if (fromUser) {
      setExpandedItem(fromUser);
    }
  }, []);

  useLayoutEffect(() => {
    setExpandedFromQueryParam();
  }, [setExpandedFromQueryParam]);

  useEffect(() => {
    window.addEventListener("popstate", setExpandedFromQueryParam);
    return () => {
      window.removeEventListener("popstate", setExpandedFromQueryParam);
    };
  }, [setExpandedFromQueryParam]);

  const handleExpand = (path: string) => {
    setExpandedItem((prev) => {
      if (prev === path) {
        navigate("/messages");
        return "";
      }
      navigate(`/messages?${QUERY_PARAM}=${path}`);
      return path;
    });
  };

  return (
    <Box>
      {!!Object.keys(messages)?.length && (
        <Box mb={4}>
          {Object.keys(messages).map((key, index) => (
            <Box
              sx={{
                backgroundColor: "#f2f2f2",
                padding: 2,
                borderRadius: 3,
                marginBottom: 2,
              }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
              >
                <Typography
                  variant="h6"
                  gutterBottom
                  onClick={() => handleExpand(key)}
                >
                  {messages[key][0].fromId?.username}
                </Typography>
                <Box>
                  {expandedItem !== key && (
                    <InboxMessage
                      message={
                        messages[key][Object.keys(messages[key]).length - 1]
                      }
                      variant="small"
                    />
                  )}
                </Box>
              </Box>
              {expandedItem !== "" && expandedItem === key && (
                <InboxItem
                  messages={messages[key]}
                  numToShow={9999}
                  variant="default"
                />
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};
