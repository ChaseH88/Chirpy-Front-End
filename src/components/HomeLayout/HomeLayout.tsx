import { Box, Typography } from '@mui/material';
import { Container } from './styled';

interface HomeLayoutProps {
  FormComponent: React.ComponentType;
  MenuComponent: React.ComponentType;
  welcomeMessage: string;
}

export const HomeLayout = ({
  FormComponent,
  welcomeMessage,
  MenuComponent,
}: HomeLayoutProps) => (
  <Container>
    <Box
      className="container"
      display={'flex'}
      flexWrap={'nowrap'}
      alignItems={'center'}
    >
      <Box
        className="left"
        flex={'1 1 50%'}
        display={'flex'}
        alignItems={'center'}
        justifyContent={'center'}
      >
        <Typography variant="h4" gutterBottom>
          {welcomeMessage}
        </Typography>
      </Box>
      <Box className="right" flex={'1 1 50%'}>
        <FormComponent />
        <Box className="menu">
          <MenuComponent />
        </Box>
      </Box>
    </Box>
  </Container>
);
