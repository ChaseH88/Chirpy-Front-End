import { Box, Typography } from "@mui/material";
import { ReactNode, isValidElement } from "react";

interface SearchResultProps {
  title: string | ReactNode;
  content: string | ReactNode;
  photo: string | ReactNode;
  createdAt: string;
}

const SearchResult = ({ title, content, photo }: SearchResultProps) => {
  return (
    <Box
      borderRadius={2}
      p={2}
      sx={{
        backgroundColor: "white",
      }}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
    >
      <Box flex="1 1 auto">
        {isValidElement(title) ? (
          title
        ) : (
          <Typography variant="h6">{title}</Typography>
        )}
        {isValidElement(content) ? (
          content
        ) : (
          <Typography variant="body1">{content}</Typography>
        )}
      </Box>
      <Box>{photo}</Box>
    </Box>
  );
};

export { SearchResult };
