import { useMutation, useQuery } from "@apollo/client";
import { SEARCH_QUERY, TRENDING_POSTS } from "./queries";
import { useAppData } from "../../hooks/useAppData";
import { Posts } from "../../components/Posts/Posts";
import { Form, FormInput } from "../../components/Form";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { Avatar } from "../../components/Avatar";
import { Trending } from "../../components/Trending";
import { PostModelInterface, UserModelInterface } from "../../types/interfaces";
import { useState } from "react";

type SearchResults = {
  groups: any[];
  users: UserModelInterface[];
  posts: PostModelInterface[];
};

const SearchPage = () => {
  const [state, setState] = useState<SearchResults>({
    groups: [],
    users: [],
    posts: [],
  });
  const { loading: trendingPostsLoading, data } = useQuery(TRENDING_POSTS);
  const { loading: searchLoading, refetch: searchRefetch } = useQuery(
    SEARCH_QUERY,
    {
      skip: true,
    }
  );
  const { currentUser } = useAppData();
  const formHook = useForm({
    defaultValues: {
      search: "",
    },
    reValidateMode: "onChange",
  });

  const handleSubmit = async (data: { search: string }) => {
    if (!data.search) {
      alert("Please fill out the search field");
      return;
    }
    try {
      const res = (await searchRefetch({
        search: data.search,
        type: ["USER", "POST", "GROUP"],
      })) as {
        data: {
          search: SearchResults;
        };
      };
      setState(res.data.search);
    } catch (e) {
      console.error(e);
    }
  };

  const inputs: FormInput[] = [
    {
      name: "search",
      type: "text",
      placeholder: "Search...",
      required: true,
      label: "Post",
    },
  ];

  return (
    <DashboardLayout
      PostsComponent={() => (
        <Box>
          <Box mb={5} borderBottom={1} borderColor="primary.main" pb={5}>
            <Box
              borderRadius={2}
              overflow={"hidden"}
              mx={3}
              sx={{
                backgroundColor: "white",
              }}
            >
              <Box p={2}>
                <Form
                  inputs={inputs}
                  formHook={formHook}
                  onSubmit={handleSubmit}
                  submitText="Search"
                />
              </Box>
            </Box>
          </Box>
          <Box px={4} py={2}>
            {searchLoading && (
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
                  Searching...
                </Typography>
              </Box>
            )}
            {searchLoading ? (
              <CircularProgress variant="indeterminate" color="secondary" />
            ) : state.posts.length ? (
              <>
                <Posts posts={state.posts} commentsToShow={3} />
              </>
            ) : (
              <Box
                sx={{
                  backgroundColor: "white",
                }}
                p={4}
                borderRadius={3}
                display={"flex"}
                flexDirection={"column"}
                alignItems={"center"}
              >
                <Typography variant="h4" gutterBottom>
                  Enter a search term to get started
                </Typography>
              </Box>
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
          {searchLoading ? (
            <CircularProgress variant="indeterminate" color="secondary" />
          ) : (
            <Trending trendingPosts={data?.trendingPosts} />
          )}
        </Box>
      )}
    />
  );
};

export { SearchPage };
