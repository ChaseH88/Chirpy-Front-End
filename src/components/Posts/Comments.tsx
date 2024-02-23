import { Box, Button } from "@mui/material";
import { CommentInterface } from "../../types/interfaces";
import { CommentItem } from "./CommentItem";
import { isValidElement, useState } from "react";

export interface CommentsProps {
  comments: CommentInterface[];
  postsToShow: number;
  OverrideToggleButton?: React.ReactNode;
}

export const Comments = ({
  comments,
  postsToShow,
  OverrideToggleButton,
}: CommentsProps) => {
  const [showAll, setShowAll] = useState(false);

  if (!comments?.length) {
    return null;
  }

  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  const commentsToShow = showAll ? comments : comments.slice(0, postsToShow);

  return (
    <Box>
      {commentsToShow.map((comment) => (
        <CommentItem key={comment.id} {...comment} />
      ))}
      {isValidElement(OverrideToggleButton) && OverrideToggleButton}
      {comments.length > postsToShow &&
        !isValidElement(OverrideToggleButton) && (
          <Box display="flex" justifyContent="center" mt={2}>
            <Button onClick={toggleShowAll}>
              {showAll ? "Show Less" : "Show More"}
            </Button>
          </Box>
        )}
    </Box>
  );
};
