import { Box, Button, Typography } from "@mui/material";
import { UserModelInterface } from "../../types/interfaces";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

import EarthIcon from "@mui/icons-material/Public";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import AcUnitIcon from "@mui/icons-material/AcUnit";
import SportsFootballIcon from "@mui/icons-material/SportsFootball";
import SportsBasketballIcon from "@mui/icons-material/SportsBasketball";
import SportsScoreIcon from "@mui/icons-material/SportsScore";
import FlightIcon from "@mui/icons-material/Flight";
import HikingIcon from "@mui/icons-material/Hiking";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "../../hooks/useAuth";

interface AvatarProps {
  user: UserModelInterface;
  buttons?: {
    variant: string;
    color: string;
    text: string;
    onClick: () => void;
  }[];
}

export const icons = {
  earth: <EarthIcon />,
  smile: <EmojiEmotionsIcon />,
  snowflake: <AcUnitIcon />,
  football: <SportsFootballIcon />,
  basketball: <SportsBasketballIcon />,
  racing: <SportsScoreIcon />,
  airplane: <FlightIcon />,
  hiking: <HikingIcon />,
  person: <PersonIcon />,
};

export type IconType = keyof typeof icons;

export const Avatar = ({ user, buttons }: AvatarProps) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const Icon = useMemo(
    () => icons[(user.photo as IconType) || "person"],
    [user.photo]
  );

  const _buttons = useMemo(
    () => [
      {
        variant: "text",
        color: "primary",
        text: "Your Posts",
        onClick: () => navigate("/user-posts"),
      },
      {
        variant: "text",
        color: "primary",
        text: "All Posts",
        onClick: () => navigate("/all-posts"),
      },
      {
        variant: "text",
        color: "primary",
        text: "Trending Posts",
        onClick: () => navigate("/trending-posts"),
      },
      {
        variant: "text",
        color: "primary",
        text: "Edit Profile",
        onClick: () => navigate("/edit-user"),
      },
      {
        variant: "outlined",
        color: "secondary",
        text: "Logout",
        onClick: logout,
      },
    ],
    [logout, navigate]
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
      <Box
        sx={{
          width: 100,
          height: 100,
          borderRadius: "50%",
          backgroundColor: "primary.main",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          marginBottom: 2,
          "& svg": {
            width: 65,
            height: 65,
          },
        }}
      >
        {Icon}
      </Box>
      {(user.firstName || user.lastName) && (
        <Box mb={1}>
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
