import { Box, Button, Typography } from "@mui/material";
import { UserModelInterface } from "../../types/interfaces";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import { IconType, UserProfilePhoto } from "../UserProfilePhoto";
import { useAppData } from "../../hooks/useAppData";

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
  const { currentUser } = useAppData();

  const _buttons = useMemo(
    () => [
      {
        variant: "text",
        color: "primary",
        text: "Home",
        onClick: () => navigate("/dashboard"),
      },
      {
        variant: "text",
        color: "primary",
        text: "Messages",
        onClick: () => navigate("/messages"),
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
      <UserProfilePhoto icon={user.photo as IconType} />
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
        {_buttons.map((button: any, index) => (
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
        ))}
      </Box>
    </Box>
  );
};
