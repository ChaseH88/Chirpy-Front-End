import { EditorContent, useEditor } from "@tiptap/react";
import { Box, SxProps } from "@mui/material";
import { MenuBar } from "./MenuBar";
import { extensions } from "./extensions";

interface EditorProps {
  sx?: SxProps;
  defaultContent?: string;
  onChange?: (html: string) => void;
  submitButtons?: React.ReactNode;
}

export const Editor = ({
  sx = {},
  defaultContent,
  onChange,
  submitButtons,
}: EditorProps) => {
  const editor = useEditor(
    {
      extensions,
      content: defaultContent,
      onUpdate: ({ editor }) => {
        onChange?.(editor.getHTML());
      },
    },
    []
  );
  return (
    <Box sx={{ ...sx }}>
      {editor && (
        <>
          <Box
            sx={{
              "& .editor-content": {
                height: 95,
                overflowY: "auto",
                padding: "0 10px",
                border: "1px solid #ccc",
                borderRadius: "5px",
                outline: "none",
                "& > .tiptap": {
                  padding: "10px",
                  outline: "none",
                  overflowWrap: "anywhere",
                },
              },
            }}
          >
            <EditorContent editor={editor} className="editor-content" />
          </Box>
          <Box
            mt={1}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <MenuBar editor={editor} />
            {submitButtons}
          </Box>
        </>
      )}
    </Box>
  );
};
