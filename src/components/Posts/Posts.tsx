import { Box, Paper, Stack, Typography } from '@mui/material';
import { PostModelInterface } from '../../types/interfaces';

interface PostsProps {
  posts: PostModelInterface[];
  headingText: string;
}

export const Posts = ({ posts, headingText }: PostsProps) => {
  return (
    <Stack>
      <Box>
        <Typography variant="h4" gutterBottom>
          {headingText}
        </Typography>
      </Box>
      <Box>
        {posts?.length ? (
          posts?.map((post) => <Post key={post.id} post={post} />)
        ) : (
          <Typography variant="h5" gutterBottom>
            No posts to show
          </Typography>
        )}
      </Box>
    </Stack>
  );
};

export const Post = ({ post }: { post: PostModelInterface }) => {
  return (
    <Paper>
      <h3>{post.content}</h3>
      <p>{post.postedBy.username}</p>
    </Paper>
  );
};
