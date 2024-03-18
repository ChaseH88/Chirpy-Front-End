import { Box } from "@mui/material";
import { Container } from "./styled";
import { Avatar } from "../Avatar";
import { useAppData } from "../../hooks/useAppData";

interface DashboardLayoutProps {
  PostsComponent: React.ComponentType;
  TrendingComponent?: React.ComponentType;
}

export const DashboardLayout = ({
  PostsComponent,
  TrendingComponent,
}: DashboardLayoutProps) => {
  const { currentUser } = useAppData();
  return (
    <Container>
      <Box
        className="container"
        display={"flex"}
        flexWrap={"nowrap"}
        alignItems={"flex-start"}
        p={4}
        gap={4}
      >
        <Box
          className="left"
          flex={"0 1 25%"}
          display={"flex"}
          alignItems={"center"}
          justifyContent={"center"}
          position={"sticky"}
          top={"30px"}
        >
          <Avatar user={currentUser!} />
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
            top={"30px"}
          >
            <TrendingComponent />
          </Box>
        )}
      </Box>
    </Container>
  );
};
