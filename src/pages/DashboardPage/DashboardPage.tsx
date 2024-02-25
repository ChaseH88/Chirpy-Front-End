import { useMutation, useQuery } from "@apollo/client";
import { GET_DASHBOARD_POSTS } from "./queries";
import { useAppData } from "../../hooks/useAppData";
import { Posts } from "../../components/Posts/Posts";
import { CREATE_POST_MUTATION } from "./mutations";
import { Form, FormInput } from "../../components/Form";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PostModelInterface } from "../../types/interfaces";
import { Avatar } from "../../components/Avatar";
import { Trending } from "../../components/Trending";
import { useEffect } from "react";

const DashboardPage = () => {
  const {
    loading: getPostLoading,
    data,
    fetchMore,
  } = useQuery(GET_DASHBOARD_POSTS, {
    variables: {
      nextToken: 0,
      limit: 10,
    },
  });
  const [createPost, { loading: createPostLoading }] =
    useMutation(CREATE_POST_MUTATION);
  const { currentUser } = useAppData();
  const formHook = useForm({
    defaultValues: {
      content: "",
    },
    reValidateMode: "onChange",
  });
  const navigate = useNavigate();

  const handleSubmit = async (data: PostModelInterface) => {
    if (!data.content) {
      alert("Please fill out all fields");
      return;
    }
    await createPost({
      variables: {
        data: {
          content: data.content,
          postedBy: currentUser!.id,
        },
      },
      refetchQueries: [
        {
          query: GET_DASHBOARD_POSTS,
          variables: {
            nextToken: 0,
            limit: 10,
          },
        },
      ],
    });
  };

  console.log(data?.allPosts, parseInt(data?.allPosts?.nextToken || "0"));

  const handleLoadMore = () => {
    if (data?.allPosts?.nextToken) {
      fetchMore({
        variables: {
          nextToken: parseInt(data.allPosts.nextToken),
          limit: 10,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            allPosts: {
              __typename: prev.allPosts.__typename,
              posts: [
                ...prev.allPosts.posts,
                ...fetchMoreResult.allPosts.posts,
              ],
              nextToken: fetchMoreResult.allPosts.nextToken,
            },
          };
        },
      });
    }
  };

  const inputs: FormInput[] = [
    {
      name: "content",
      type: "text",
      placeholder: "Enter your post",
      required: true,
      label: "Post",
    },
  ];

  return (
    <DashboardLayout
      PostsComponent={() => (
        <Box>
          <Box mb={5} borderBottom={1} borderColor="primary.main" pb={5}>
            <Box borderRadius={2} overflow={"hidden"} mx={3}>
              <Form<PostModelInterface>
                inputs={inputs}
                onSubmit={handleSubmit}
                submitText="Post"
                formHook={formHook}
                buttonPosition="right"
              />
            </Box>
          </Box>
          <Box px={4} py={2}>
            {createPostLoading && (
              <Box
                p={4}
                mb={4}
                sx={{
                  backgroundColor: "white",
                }}
                textAlign={"center"}
                borderRadius={3}
              >
                <Typography
                  variant="body1"
                  gutterBottom
                  fontStyle={"italic"}
                  fontWeight={700}
                >
                  Creating post...
                </Typography>
              </Box>
            )}
            {getPostLoading ? (
              <CircularProgress variant="indeterminate" color="secondary" />
            ) : (
              <>
                <Posts posts={data?.allPosts?.posts} commentsToShow={3} />
                {data?.allPosts?.nextToken && (
                  <Box textAlign="center" mt={2}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleLoadMore}
                    >
                      Load More
                    </Button>
                  </Box>
                )}
              </>
            )}
          </Box>
        </Box>
      )}
      AvatarComponent={() => (
        <Box>
          <Avatar user={currentUser!} />
        </Box>
      )}
      TrendingComponent={() => (
        <Box mx={2}>
          {getPostLoading ? (
            <CircularProgress variant="indeterminate" color="secondary" />
          ) : (
            <Trending trendingPosts={data?.trendingPosts} />
          )}
        </Box>
      )}
    />
  );
};

export { DashboardPage };
