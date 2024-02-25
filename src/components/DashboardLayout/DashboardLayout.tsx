import { Box, Typography } from "@mui/material";
import { Container } from "./styled";

interface DashboardLayoutProps {
  PostsComponent: React.ComponentType;
  AvatarComponent: React.ComponentType;
  TrendingComponent?: React.ComponentType;
}

export const DashboardLayout = ({
  PostsComponent,
  AvatarComponent,
  TrendingComponent,
}: DashboardLayoutProps) => (
  <Container>
    <Box
      className="container"
      display={"flex"}
      flexWrap={"nowrap"}
      alignItems={"flex-start"}
      p={4}
    >
      <Box
        className="left"
        flex={"1 1 25%"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        position={"sticky"}
        top={"10%"}
      >
        <AvatarComponent />
      </Box>
      <Box className="middle" flex={"1 1 50%"}>
        <PostsComponent />
      </Box>
      {TrendingComponent && (
        <Box
          className="right"
          flex={"1 1 25%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          position={"sticky"}
          top={"10%"}
        >
          <TrendingComponent />
        </Box>
      )}
    </Box>
  </Container>
);
