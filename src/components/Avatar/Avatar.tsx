import { Box, Button, Typography } from "@mui/material";
import { UserModelInterface } from "../../types/interfaces";
import { useNavigate } from "react-router-dom";
import { isValidElement, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { UserProfilePhoto } from "../UserProfilePhoto";
import { useAppData } from "../../hooks/useAppData";
import { useMessages } from "../../hooks/useMessages";

interface AvatarProps {
  user: UserModelInterface;
  buttons?: {
    variant: string;
    color: string;
    text: string;
    onClick: () => void;
  }[];
}

export const Avatar = ({ user, buttons }: AvatarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { messages } = useMessages();
  const { currentUser } = useAppData();
  const unreadMessages = useMemo(
    () =>
      messages?.filter(
        (message) =>
          !message.hasRead && (message as any).toId?.id === currentUser?.id
      )?.length || 0,
    [messages, currentUser]
  );

  const fullName = useMemo(
    () =>
      `${currentUser?.firstName || ""} ${currentUser?.lastName || ""}`.trim(),
    [currentUser]
  );

  const memoButtons = useMemo(
    () =>
      buttons || [
        {
          variant: "text",
          color: "primary",
          text: "Home",
          onClick: () => navigate("/dashboard"),
        },
        {
          text: (
            <Box
              key={"messages"}
              borderBottom={1}
              borderColor={"rgba(0, 0, 0, 0.2)"}
              padding={1}
            >
              <Button color={"primary"} onClick={() => navigate("/messages")}>
                Messages
                {unreadMessages > 0 && (
                  <Box
                    ml={1}
                    borderRadius={"50%"}
                    bgcolor={"primary.main"}
                    color={"white"}
                    height={23}
                    width={23}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    {unreadMessages}
                  </Box>
                )}
              </Button>
            </Box>
          ),
        },
        {
          variant: "text",
          color: "primary",
          text: "Trending",
          onClick: () => navigate("/trending-posts"),
        },
        {
          variant: "text",
          color: "primary",
          text: "Your Profile",
          onClick: () => navigate(`/profile/${currentUser?.username}`),
        },
        {
          variant: "outlined",
          color: "secondary",
          text: "Logout",
          onClick: logout,
        },
      ],
    [logout, navigate, currentUser, unreadMessages, buttons]
  );

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "white",
      }}
      padding={4}
      width={"100%"}
      borderRadius={2}
    >
      <Box mb={1}>
        <UserProfilePhoto
          src={user.photo}
          name={user.username}
          onClick={() => navigate(`/profile/${user.username}`)}
        />
      </Box>
      {(user.firstName || user.lastName) && (
        <Box
          mb={1}
          sx={{
            cursor: "pointer",
          }}
          onClick={() => navigate(`/profile/${user.username}`)}
        >
          <Typography variant="h4">{user.username}</Typography>
        </Box>
      )}
      <Box display={"flex"} flexDirection={"row"} alignItems={"center"} gap={1}>
        <Typography variant="body1" fontSize={12}>
          {fullName}
          {!!fullName?.length && " - "}
        </Typography>
        {!!user.posts?.length && (
          <Typography variant="body1" fontSize={12}>
            {user.posts.length} Post{user.posts.length > 1 ? "s" : ""}
          </Typography>
        )}
      </Box>
      <Box mt={1}>
        <Typography variant="body1" fontSize={11} fontStyle={"italic"}>
          {user.bio}
        </Typography>
      </Box>
      <Box
        display={"flex"}
        gap={1}
        mt={2}
        flexDirection={"column"}
        justifyContent={"flex-start"}
        width={"100%"}
      >
        {memoButtons.map((button: any, index) =>
          isValidElement(button.text) ? (
            button.text
          ) : (
            <Box
              key={index}
              borderBottom={index === memoButtons.length - 1 ? 0 : 1}
              borderColor={"rgba(0, 0, 0, 0.2)"}
              padding={1}
            >
              <Button color={button.color} onClick={button.onClick}>
                {button.text}
              </Button>
            </Box>
          )
        )}
      </Box>
    </Box>
  );
};
