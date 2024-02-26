import { MoreVert } from "@mui/icons-material";
import { Box, Button, Popover, SxProps } from "@mui/material";
import { useState } from "react";

export type ActionMenuItem = {
  onClick: () => void;
  text: string;
};

interface ActionMenuProps {
  items: ActionMenuItem[];
  sx?: SxProps;
}

export const ActionMenu = ({ items, sx }: ActionMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <Box className="action-menu" sx={{ ...sx }}>
      <Button
        onClick={handleClick}
        variant="outlined"
        color="secondary"
        className="action-menu-button"
        sx={{
          padding: 0,
          height: 20,
          width: 20,
          minWidth: "auto",
          "& svg": {
            height: 20,
            width: 18,
          },
        }}
      >
        <MoreVert />
      </Button>
      <Popover
        className="action-menu-popover"
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box display="flex" flexDirection="column" py={2} gap={0.5}>
          {items.map((item, index) => (
            <Button
              key={index}
              onClick={item.onClick}
              sx={{
                all: "unset",
                width: "100%",
                px: 2,
                py: 1,
                cursor: "pointer",
                fontSize: ".8rem",
              }}
              color="secondary"
              className="action-menu-item"
            >
              {item.text}
            </Button>
          ))}
        </Box>
      </Popover>
    </Box>
  );
};
