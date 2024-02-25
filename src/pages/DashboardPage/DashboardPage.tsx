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
import { useCallback, useEffect, useRef, useState } from "react";

const DashboardPage = () => {
  const [nextToken, setNextToken] = useState(0);
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
  const bottomRef = useRef<HTMLDivElement>(null);

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
            nextToken,
            limit: 10,
          },
        },
      ],
    });
  };

  const handleLoadMore = useCallback(() => {
    if (data?.allPosts?.nextToken) {
      fetchMore({
        variables: {
          nextToken: parseInt(data.allPosts.nextToken),
          limit: 10,
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
                <Posts posts={data?.allPosts?.items} commentsToShow={3} />
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
