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

interface UserProfilePhotoProps {
  icon: IconType;
  onClick?: () => void;
  width?: number;
  height?: number;
  backgroundColor?: string;
  color?: string;
  svgWidth?: number;
  svgHeight?: number;
}

export const UserProfilePhoto = ({
  icon,
  onClick,
  width = 100,
  height = 100,
  backgroundColor = "primary.main",
  color = "white",
  svgWidth = 65,
  svgHeight = 65,
}: UserProfilePhotoProps) => {
  const Icon = useMemo(() => icons[(icon as IconType) || "person"], [icon]);

  return (
    <Box
      onClick={onClick}
      sx={{
        width,
        height,
        borderRadius: "50%",
        backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color,
        "& svg": {
          width: svgWidth,
          height: svgHeight,
        },
      }}
    >
      {Icon}
    </Box>
  );
};
