import { Editor as EditorType, EditorContent } from "@tiptap/react";
import { Box, SxProps } from "@mui/material";
import { MenuBar } from "./MenuBar";
import { memo } from "react";

interface EditorProps {
  sx?: SxProps;
  editor: EditorType;
}

export const Editor = memo(
  ({ sx = {}, editor }: EditorProps) => {
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
  },
  (prevProps: EditorProps, nextProps: EditorProps) => {
    return prevProps.editor === nextProps.editor;
  }
);
