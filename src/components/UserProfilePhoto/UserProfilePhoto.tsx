import { Box } from "@mui/material";

interface UserProfilePhotoProps {
  src: string;
  name: string;
  onClick?: () => void;
  width?: number;
  height?: number;
  backgroundColor?: string;
}

export const UserProfilePhoto = ({
  src,
  name,
  onClick,
  width = 100,
  height = 100,
  backgroundColor = "primary.main",
}: UserProfilePhotoProps) => (
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
      overflow: "hidden",
      "& img": {
        maxWidth: "100%",
      },
    }}
  >
    <img src={src} alt={name} />
  </Box>
);
