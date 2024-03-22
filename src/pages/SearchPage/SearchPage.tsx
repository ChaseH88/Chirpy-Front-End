import React, { useState, useMemo } from "react";
import { useQuery } from "@apollo/client";
import { SEARCH_QUERY } from "../../graphql/queries/search-query";
import { DashboardLayout } from "../../components/DashboardLayout";
import {
  Box,
  CircularProgress,
  Typography,
  ButtonGroup,
  Button,
} from "@mui/material";
import { useQueryParams } from "../../hooks/useQueryParams";
import { SearchBar } from "../../components/SearchBar";
import { SearchResult } from "../../components/SearchResult";
import moment from "moment";

const typeArr = ["USER", "POST", "GROUP"] as const;
const stateArr = [...typeArr, "ALL"] as const;

type State = (typeof stateArr)[number];

const SearchPage = () => {
  const { query } = useQueryParams();

  const { loading: searchLoading, data } = useQuery(SEARCH_QUERY, {
    variables: { search: query, type: typeArr },
    skip: !query,
  });

  const [activeFilter, setActiveFilter] = useState<State>("ALL");

  const searchResults = useMemo(() => {
    if (!data) return [];

    const { users = [], posts = [] } = data.search;
    let results = [...users, ...posts];

    if (activeFilter === "USER") {
      results = users;
    } else if (activeFilter === "POST") {
      results = posts;
    }

    return results
      .map((item) => ({
        title: item.username || `Post by ${item.postedBy?.username}`,
        content:
          item.bio === null || !item.username ? (
            <Box>
              <Typography variant="body1" fontStyle="italic" fontSize={12}>
                Created {moment(item.createdAt).fromNow()}
              </Typography>
              <div dangerouslySetInnerHTML={{ __html: item.content }} />
            </Box>
          ) : (
            <Typography variant="body1" fontStyle="italic">
              No bio available
            </Typography>
          ),
        photo: item.photo || null,
        createdAt: item.createdAt || new Date().toISOString(),
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }, [data, activeFilter]);

  const handleFilterChange = (filter: State) => {
    setActiveFilter(filter);
  };

  return (
    <DashboardLayout
      PostsComponent={() => (
        <Box>
          <Box
            borderRadius={2}
            p={2}
            mx={3}
            sx={{ backgroundColor: "white" }}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box flex="1 1 auto">
              <SearchBar />
            </Box>
          </Box>
          <Box px={4} py={2}>
            <Box mb={2} display="flex" justifyContent="center">
              <ButtonGroup
                variant="contained"
                aria-label="outlined primary button group"
              >
                <Button
                  onClick={() => handleFilterChange("ALL")}
                  color={activeFilter === "ALL" ? "secondary" : "primary"}
                >
                  All
                </Button>
                <Button
                  onClick={() => handleFilterChange("USER")}
                  color={activeFilter === "USER" ? "secondary" : "primary"}
                >
                  Users
                </Button>
                <Button
                  onClick={() => handleFilterChange("POST")}
                  color={activeFilter === "POST" ? "secondary" : "primary"}
                >
                  Posts
                </Button>
              </ButtonGroup>
            </Box>
            {searchLoading ? (
              <Box
                textAlign="center"
                p={4}
                mb={4}
                sx={{ backgroundColor: "white" }}
                borderRadius={3}
              >
                <Typography
                  variant="body1"
                  gutterBottom
                  fontStyle="italic"
                  fontWeight={700}
                >
                  Searching...
                </Typography>
                <CircularProgress variant="indeterminate" color="secondary" />
              </Box>
            ) : searchResults.length > 0 ? (
              <>
                <Box
                  p={4}
                  mb={4}
                  sx={{ backgroundColor: "white" }}
                  textAlign="center"
                  borderRadius={3}
                >
                  <Typography variant="h6">
                    Found {searchResults.length} results for "{query}"
                  </Typography>
                </Box>
                {searchResults.map((result, index) => (
                  <Box key={index} mb={2}>
                    <SearchResult {...result} />
                  </Box>
                ))}
              </>
            ) : (
              <Typography variant="body1" textAlign="center">
                No search results found for "{query}"
              </Typography>
            )}
          </Box>
        </Box>
      )}
    />
  );
};

export { SearchPage };
