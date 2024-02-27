import { Box, Stack, Typography } from "@mui/material";
import { PostModelInterface } from "../../types/interfaces";
import { Post, PostProps } from "./Post";

interface PostsProps
  extends Pick<
    PostProps,
    | "OverrideCommentButton"
    | "commentsToShow"
    | "onDeletePost"
    | "onCreatePostComment"
  > {
  posts: PostModelInterface[];
  headingText?: string;
}

export const Posts = ({ posts, headingText, ...rest }: PostsProps) => (
  <Stack>
    {headingText && (
      <Box>
        <Typography variant="h4" gutterBottom>
          {headingText}
        </Typography>
      </Box>
    )}
    <Box>
      {posts?.length ? (
        posts?.map((post) => <Post key={post.id} post={post} {...rest} />)
      ) : (
        <Typography variant="h5" gutterBottom>
          No posts to show
        </Typography>
      )}
    </Box>
  </Stack>
);
