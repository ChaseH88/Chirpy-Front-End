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
          <Box
            sx={{
              "& .editor-content": {
                height: "100%",
                padding: "0 10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                outline: "none",
                "& > .tiptap": {
                  padding: "10px",
                  outline: "none",
                },
              },
            }}
          >
            <EditorContent editor={editor} className="editor-content" />
          </Box>
          <MenuBar editor={editor} />
        </>
      )}
    </Box>
  );
};
