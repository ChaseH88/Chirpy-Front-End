import { useMutation, useQuery } from "@apollo/client";
import { GET_DASHBOARD_POSTS } from "./queries";
import { useAppData } from "../../hooks/useAppData";
import { Posts } from "../../components/Posts/Posts";
import { CREATE_POST_MUTATION } from "./mutations";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { PostModelInterface } from "../../types/interfaces";
import { Avatar } from "../../components/Avatar";
import { Trending } from "../../components/Trending";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSnackbar } from "notistack";
import { Editor } from "../../components/Editor";
import { CURRENT_USER_QUERY } from "../../providers/AppData/queries";

export const POST_LIMIT = 20;

const DashboardPage = () => {
  const [nextToken, setNextToken] = useState(0);
  const [showNewPostComponent, setShowNewPostComponent] = useState(false);
  const {
    loading: getPostLoading,
    data,
    fetchMore,
    refetch,
  } = useQuery(GET_DASHBOARD_POSTS, {
    variables: {
      nextToken: 0,
      limit: POST_LIMIT,
    },
  });
  const [createPost, { loading: createPostLoading }] =
    useMutation(CREATE_POST_MUTATION);
  const { currentUser, refetchCurrentUser } = useAppData();
  const formHook = useForm({
    reValidateMode: "onChange",
  });
  const bottomRef = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const refreshPosts = useCallback(async () => {
    await refetch({
      variables: {
        nextToken: nextToken || 0,
        limit: POST_LIMIT,
      },
    });
    await refetchCurrentUser();
  }, [refetch, nextToken, refetchCurrentUser]);

  const handleSubmit = async (data: PostModelInterface) => {
    if (!data.content) {
      alert("Please fill out all fields");
      return;
    }
    setShowNewPostComponent(false);
    await createPost({
      variables: {
        data: {
          content: data.content,
        },
      },
      refetchQueries: [
        {
          query: GET_DASHBOARD_POSTS,
          variables: {
            nextToken,
            limit: POST_LIMIT,
          },
        },
        {
          query: CURRENT_USER_QUERY,
        },
      ],
    });
    enqueueSnackbar("Post created", { variant: "success" });
    formHook.reset();
  };

  const handleLoadMore = useCallback(() => {
    if (data?.allPosts?.nextToken) {
      fetchMore({
        variables: {
          nextToken: parseInt(data.allPosts.nextToken),
          limit: POST_LIMIT,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            trendingPosts: prev.trendingPosts,
            allPosts: {
              __typename: prev.allPosts.__typename,
              items: [
                ...prev.allPosts.items,
                ...fetchMoreResult.allPosts.items,
              ],
              nextToken: fetchMoreResult.allPosts.nextToken,
              totalCount: fetchMoreResult.allPosts.totalCount,
            },
          };
        },
      });
      setNextToken(parseInt(data.allPosts.nextToken));
    }
  }, [data, fetchMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            handleLoadMore();
          }
        });
      },
      {
        rootMargin: "100px",
      }
    );

    const currentSentinel = bottomRef.current;
    if (currentSentinel) {
      observer.observe(currentSentinel);
    }

    return () => {
      if (currentSentinel) {
        observer.unobserve(currentSentinel);
      }
    };
  }, [data, handleLoadMore]);

  return (
    <DashboardLayout
      PostsComponent={() => (
        <Box>
          <Box mb={5} borderBottom={1} borderColor="primary.main" pb={5}>
            {showNewPostComponent ? (
              <Box
                borderRadius={2}
                overflow={"hidden"}
                mx={3}
                sx={{
                  backgroundColor: "white",
                }}
                height={200}
              >
                <Editor
                  onChange={(html) => {
                    formHook.setValue("content", html);
                  }}
                  sx={{
                    px: 3,
                    pt: 3,
                  }}
                  submitButtons={
                    <Box p={2} display="flex" justifyContent="flex-end" gap={2}>
                      <Button
                        variant="outlined"
                        color="secondary"
                        onClick={() => setShowNewPostComponent(false)}
                        disabled={createPostLoading}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={formHook.handleSubmit(handleSubmit as any)}
                        disabled={createPostLoading}
                      >
                        Post
                      </Button>
                    </Box>
                  }
                />
              </Box>
            ) : (
              <Box
                borderRadius={2}
                p={2}
                mx={3}
                sx={{
                  backgroundColor: "white",
                }}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h5" gutterBottom>
                  Dashboard
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => setShowNewPostComponent(true)}
                >
                  Create new post
                </Button>
              </Box>
            )}
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
                <Posts
                  posts={data?.allPosts?.items}
                  commentsToShow={3}
                  onCreatePostComment={refreshPosts}
                  onDeletePost={refreshPosts}
                />
                {data?.allPosts?.nextToken && <Box ref={bottomRef} />}
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
