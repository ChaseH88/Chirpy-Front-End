import { Editor } from "@tiptap/react";
import { Box, IconButton } from "@mui/material";
import { useMemo } from "react";
import UndoIcon from "@mui/icons-material/Undo";
import RedoIcon from "@mui/icons-material/Redo";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";

interface MenuBarProps {
  editor: Editor | null;
}

const VerticalDivider = () => (
  <Box
    sx={{
      width: "1px",
      height: "20px",
      backgroundColor: "rgba(0, 0, 0, 0.12)",
      margin: "0 8px",
    }}
  ></Box>
);

export const MenuBar = ({ editor }: MenuBarProps) => {
  const buttons = useMemo(
    () => [
      {
        onClick: () => editor?.commands.undo(),
        text: "Undo",
        Component: UndoIcon,
      },
      {
        onClick: () => editor?.commands.redo(),
        text: "Redo",
        Component: RedoIcon,
      },
      {
        Component: VerticalDivider,
      },
      {
        onClick: () => editor?.chain()?.focus()?.toggleBold()?.run(),
        text: "Bold",
        Component: FormatBoldIcon,
      },
      {
        onClick: () => editor?.chain()?.focus()?.toggleItalic()?.run(),
        text: "Italic",
        Component: FormatItalicIcon,
      },
      {
        onClick: () => editor?.chain()?.focus()?.toggleBulletList()?.run(),
        text: "Bullet List",
        Component: FormatListBulletedIcon,
      },
      {
        onClick: () => editor?.chain()?.focus()?.toggleOrderedList()?.run(),
        text: "Ordered List",
        Component: FormatListNumberedIcon,
      },
    ],
    [editor]
  );

  return (
    <Box
      className="editor-menu-bar"
      display="flex"
      gap={0.5}
      alignItems="center"
    >
      {buttons?.map((button, index) =>
        button?.onClick ? (
          <IconButton
            key={index}
            onClick={button.onClick}
            sx={{ mr: 1 }}
            color="inherit"
            size="small"
            title={button.text}
          >
            <button.Component />
          </IconButton>
        ) : (
          button.Component && <button.Component key={index} />
        )
      )}
    </Box>
  );
};
