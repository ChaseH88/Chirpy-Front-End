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

  const _buttons = useMemo(
    () => [
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
    [logout, navigate, currentUser]
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
      <UserProfilePhoto src={user.photo} name={user.username} />
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
          {user.firstName} {user.lastName}
        </Typography>
        -
        {user.posts?.length ? (
          <Typography variant="body1" fontSize={12}>
            {user.posts.length} Post{user.posts.length > 1 ? "s" : ""}
          </Typography>
        ) : (
          <Typography variant="h6">Create a post!</Typography>
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
        {_buttons.map((button: any, index) =>
          isValidElement(button.text) ? (
            button.text
          ) : (
            <Box
              key={index}
              borderBottom={index === _buttons.length - 1 ? 0 : 1}
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
