import { MouseEvent, ReactNode, useCallback, useState } from "react";
import { Box, Menu, Typography } from "@mui/material";
import { UserModelInterface } from "../../types/interfaces";
import { UserProfilePhoto } from "../UserProfilePhoto";
import { useNavigate } from "react-router-dom";

export interface UserHoverMenuProps {
  user: UserModelInterface;
  children: ReactNode;
}

export const UserHoverMenu = ({
  user: { id, username, photo, followers, following },
  children,
}: UserHoverMenuProps): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  const handleMouseEnter = useCallback((event: MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setAnchorEl(null);
  }, []);

  return (
    <Box onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {children}
      <Menu
        id="user-hover-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleMouseLeave}
        MenuListProps={{ onMouseLeave: handleMouseLeave }}
      >
        <Box>
          <Box className="container" px={2} py={1}>
            <Box className="user-info">
              <Box>
                <Box
                  display="flex"
                  alignItems="center"
                  gap={1}
                  justifyContent="center"
                >
                  <UserProfilePhoto
                    src={photo as any}
                    name={username}
                    height={18}
                    width={18}
                  />
                  <Typography
                    variant="h6"
                    onClick={() => navigate(`/profile/${username}`)}
                    sx={{
                      cursor: "pointer",
                    }}
                  >
                    {username}
                  </Typography>
                </Box>
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  gap={1}
                >
                  <Typography variant="body2">
                    {followers?.length || 0} followers
                  </Typography>
                  <Typography variant="body2">
                    {following?.length || 0} following
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Menu>
    </Box>
  );
};
