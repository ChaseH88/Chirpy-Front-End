import { Box, Typography } from "@mui/material";
import { MessageModelInterface } from "../../types/interfaces";
import moment from "moment";
import { useAppData } from "../../hooks/useAppData";
import { useMemo } from "react";
import { UserProfilePhoto } from "../UserProfilePhoto";

export interface InboxMessageProps {
  message: MessageModelInterface;
  variant?: "small" | "default";
}

export const InboxMessage = ({
  message,
  variant,
}: InboxMessageProps): JSX.Element => {
  const { currentUser } = useAppData();
  const isCurrentUser = currentUser?.id === message.fromId?.id;

  const styles = useMemo(
    () => ({
      default: {
        container: {
          display: "flex",
          alignItems: "center",
          justifyContent:
            isCurrentUser && variant !== "small" ? "flex-end" : "flex-start",
          mb: 2,
          gap: 1,
        },
        message: {
          backgroundColor: isCurrentUser ? "#eee" : "#00a9ff",
          color: isCurrentUser ? "black" : "white",
          p: 2,
          borderRadius: 3,
          minWidth: "40%",
        },
      },
      small: {
        container: {
          display: "flex",
          alignItems: "center",
          justifyContent:
            isCurrentUser && variant !== "small" ? "flex-end" : "flex-start",
          mb: 0,
          fontSize: "0.8rem",
          gap: 1,
        },
        message: {
          backgroundColor: isCurrentUser ? "#eee" : "#00a9ff",
          color: isCurrentUser ? "black" : "white",
          p: 1.5,
          borderRadius: 3,
        },
      },
    }),
    [isCurrentUser, variant]
  );

  return (
    <Box sx={styles[variant || "default"].container}>
      <Box
        key={message.id}
        title={`Sent by: ${message.fromId?.username} at ${moment(
          parseInt(message.createdAt)
        ).format("MMMM Do YYYY, h:mm:ss a")}`}
        sx={styles[variant || "default"].message}
      >
        <Box sx={styles[variant || "default"].container}>
          <Box>
            <UserProfilePhoto
              icon={message.fromId?.photo as any}
              height={30}
              width={30}
              svgHeight={20}
              svgWidth={20}
            />
          </Box>
          <Box>
            <Typography
              variant="body1"
              gutterBottom
              fontWeight={700}
              fontSize={"inherit"}
              m={0}
            >
              {message.fromId?.username}
            </Typography>
          </Box>
          <Box>
            <Typography
              variant="subtitle2"
              gutterBottom
              fontStyle={"italic"}
              fontSize={"inherit"}
              m={0}
            >
              {moment(parseInt(message.createdAt)).fromNow()}
            </Typography>
          </Box>
        </Box>
        <Box
          display="flex"
          justifyContent={isCurrentUser ? "flex-end" : "flex-start"}
        >
          <Typography variant="body2" gutterBottom fontSize={"inherit"}>
            {message.content}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
