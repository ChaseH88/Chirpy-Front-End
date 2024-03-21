import { useQuery } from "@apollo/client";
import { DashboardLayout } from "../../components/DashboardLayout";
import { CircularProgress } from "@mui/material";
import { Post } from "../../components/Posts/Post";
import { useParams } from "react-router-dom";
import { FIND_POST_QUERY } from "../../graphql/queries/find-post";

const FindPostPage = () => {
  const { postId } = useParams();
  const { loading: getPostLoading, data } = useQuery(FIND_POST_QUERY, {
    variables: {
      id: postId,
    },
  });

  return (
    <DashboardLayout
      PostsComponent={() =>
        getPostLoading ? (
          <CircularProgress />
        ) : (
          <Post post={data?.findPost} commentsToShow={99999} />
        )
      }
    />
  );
};

export { FindPostPage };
