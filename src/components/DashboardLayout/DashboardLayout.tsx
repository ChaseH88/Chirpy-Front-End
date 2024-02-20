import { Box, Typography } from '@mui/material';
import { Container } from './styled';

interface DashboardLayoutProps {
  PostsComponent: React.ComponentType;
  AvatarComponent: React.ComponentType;
  TrendingComponent: React.ComponentType;
}

export const DashboardLayout = ({
  PostsComponent,
  AvatarComponent,
  TrendingComponent,
}: DashboardLayoutProps) => (
  <Container>
    <Box
      className="container"
      display={'flex'}
      flexWrap={'nowrap'}
      alignItems={'center'}
    >
      <Box
        className="left"
        flex={'1 1 25%'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <AvatarComponent />
      </Box>
      <Box className="middle" flex={'1 1 50%'}>
        <PostsComponent />
      </Box>
      <Box
        className="right"
        flex={'1 1 25%'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <TrendingComponent />
      </Box>
    </Box>
  </Container>
);
