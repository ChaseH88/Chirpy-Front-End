import { EditorContent, useEditor } from "@tiptap/react";
import { extensions } from "./extensions";
import { Box, SxProps } from "@mui/material";
import { MenuBar } from "./MenuBar";

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
  sx?: SxProps;
}

export const Editor = ({
  content = "",
  onChange = () => null,
  sx = {},
}: EditorProps) => {
  const editor = useEditor({
    extensions,
    content,
    onUpdate({ editor }) {
      const content = editor.getHTML() || "";
      onChange(content);
    },
  });

  return (
    <Box sx={{ ...sx }}>
      {editor && (
        <>
          <EditorContent editor={editor} className="editor-content" />
          <MenuBar editor={editor} />
        </>
      )}
    </Box>
  );
};
