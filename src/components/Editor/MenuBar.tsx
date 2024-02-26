import { Editor } from "@tiptap/react";
import { Box, Button } from "@mui/material";
import { useMemo } from "react";

interface MenuBarProps {
  editor: Editor | null;
}

export const MenuBar = ({ editor }: MenuBarProps) => {
  const buttons = useMemo(
    () => [
      {
        onClick: () => editor?.chain()?.focus()?.toggleBold()?.run(),
        text: "Bold",
      },
      {
        onClick: () => editor?.chain()?.focus()?.toggleItalic()?.run(),
        text: "Italic",
      },
      {
        onClick: () => editor?.chain()?.focus()?.toggleBulletList()?.run(),
        text: "Bullet List",
      },
      {
        onClick: () => editor?.chain()?.focus()?.toggleOrderedList()?.run(),
        text: "Ordered List",
      },
    ],
    [editor]
  );

  return (
    <Box className="editor-menu-bar">
      {buttons?.map((button, index) => (
        <Button
          key={index}
          onClick={button.onClick}
          sx={{ mr: 1 }}
          variant="outlined"
          color="secondary"
        >
          {button.text}
        </Button>
      ))}
    </Box>
  );
};
