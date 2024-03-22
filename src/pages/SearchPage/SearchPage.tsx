import { useQuery } from "@apollo/client";
import { SEARCH_QUERY } from "../../graphql/queries/search-query";
import { Posts } from "../../components/Posts/Posts";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Box, CircularProgress, Typography } from "@mui/material";
import { Trending } from "../../components/Trending";
import { useQueryParams } from "../../hooks/useQueryParams";
import { SearchBar } from "../../components/SearchBar";
import { ReactNode, isValidElement, useCallback, useMemo } from "react";
import { PostModelInterface, UserModelInterface } from "../../types/interfaces";
import { UserProfilePhoto } from "../../components/UserProfilePhoto";

interface SearchResultProps {
  title: string;
  content: string | ReactNode;
  photo: string | ReactNode;
  createdAt: string;
}

const SearchResult = ({ title, content, photo }: SearchResultProps) => {
  return (
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
      <Box flex="1 1 auto">
        <Typography variant="h6">{title}</Typography>
        {isValidElement(content) ? (
          content
        ) : (
          <Typography variant="body1">{content}</Typography>
        )}
      </Box>
      <Box>{photo}</Box>
    </Box>
  );
};

const SearchPage = () => {
  const params = useQueryParams();

  const { loading: searchLoading, data } = useQuery(SEARCH_QUERY, {
    variables: {
      search: params.query,
      type: ["USER", "POST", "GROUP"],
    },
    skip: !params.query,
  });

  const buildSearchResults = useCallback(() => {
    const searchResults: SearchResultProps[] = [];
    const users = data?.search?.users as UserModelInterface[];
    const posts = data?.search?.posts as PostModelInterface[];
    // const groups = data?.search?.groups as any[];

    if (users) {
      users.forEach((user) => {
        searchResults.push({
          title: user.username,
          content: user.email,
          photo: <UserProfilePhoto src={user.photo} name={user.username} />,
          createdAt: new Date().toISOString(),
        });
      });
    }

    if (posts) {
      posts.forEach((post) => {
        searchResults.push({
          title: `Post by ${post.postedBy.username}`,
          content: (
            <div
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
            />
          ),
          photo: <></>,
          createdAt: new Date().toISOString(),
        });
      });

      return {
        hasSearchResults: searchResults.length > 0 || false,
        searchResults:
          searchResults.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          ) || [],
      };
    }
  }, [data]);

  const hasSearchResults = useMemo(
    () => buildSearchResults()?.hasSearchResults,
    [buildSearchResults]
  );

  const searchResults = useMemo(
    () => buildSearchResults()?.searchResults,
    [buildSearchResults]
  );

  return (
    <DashboardLayout
      PostsComponent={() => (
        <Box>
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
            <Box flex="1 1 auto">
              <SearchBar />
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
            ) : hasSearchResults ? (
              <>
                <Box
                  p={4}
                  mb={4}
                  sx={{
                    backgroundColor: "white",
                  }}
                  textAlign={"center"}
                  borderRadius={3}
                >
                  <Typography variant="h6">
                    Search results for "{params.query}"
                  </Typography>
                </Box>
                {searchResults?.map((result, index) => (
                  <Box key={index} mb={2}>
                    <SearchResult {...result} />
                  </Box>
                ))}
              </>
            ) : (
              <Typography variant="body1" textAlign="center">
                No search results found
              </Typography>
            )}
          </Box>
        </Box>
      )}
      TrendingComponent={() => (
        <Box mx={2}>
          {searchLoading ? (
            <CircularProgress variant="indeterminate" color="secondary" />
          ) : (
            <Trending trendingPosts={[]} />
          )}
        </Box>
      )}
    />
  );
};

export { SearchPage };
