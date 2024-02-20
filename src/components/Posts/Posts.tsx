import { Box, Stack, Typography } from '@mui/material';
import { PostModelInterface } from '../../types/interfaces';
import { Post } from './Post';

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
