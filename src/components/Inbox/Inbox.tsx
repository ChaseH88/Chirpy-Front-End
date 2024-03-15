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

interface InboxProps {
  messages: {
    [key: string]: MessageModelInterface[];
  };
}

const QUERY_PARAM = "from-user";

export const Inbox = ({ messages }: InboxProps): JSX.Element => {
  const [expandedItem, setExpandedItem] = useState<string>("");
  const navigate = useNavigate();
  const { currentUser } = useAppData();

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
          {Object.keys(messages).map((key) => (
            <Accordion
              key={key}
              expanded={expandedItem === key}
              onChange={handleExpandChange(key)}
              sx={{ backgroundColor: "#f2f2f2", marginBottom: 2 }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`panel-${key}-content`}
                id={`panel-${key}-header`}
              >
                <Typography>
                  {currentUser?.id !== messages[key][0].fromId?.id
                    ? messages[key][0].fromId?.username
                    : messages[key][0].toId?.username}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <InboxItem
                  messages={messages[key]}
                  numToShow={9999}
                  variant="default"
                />
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      )}
    </Box>
  );
};
