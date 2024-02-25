import { useQuery } from "@apollo/client";
import { FIND_POST_QUERY } from "./queries";
import { useAppData } from "../../hooks/useAppData";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Box, CircularProgress } from "@mui/material";
import { Avatar } from "../../components/Avatar";
import { Post } from "../../components/Posts/Post";
import { useParams } from "react-router-dom";

const FindPostPage = () => {
  const { postId } = useParams();
  const { loading: getPostLoading, data } = useQuery(FIND_POST_QUERY, {
    variables: {
      id: postId,
    },
  });
  const { currentUser } = useAppData();

  return (
    <DashboardLayout
      PostsComponent={() =>
        getPostLoading ? (
          <CircularProgress />
        ) : (
          <Post post={data?.findPost} commentsToShow={99999} />
        )
      }
      AvatarComponent={() => (
        <Box>
          <Avatar user={currentUser!} />
        </Box>
      )}
    />
  );
};

export { FindPostPage };
