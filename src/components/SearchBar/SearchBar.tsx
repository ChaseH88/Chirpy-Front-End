import { Box, Button, Input } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { useLayoutEffect, useState } from "react";
import { useQueryParams } from "../../hooks/useQueryParams";

interface SearchBarProps {}

export const SearchBar = (props: SearchBarProps): JSX.Element => {
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const params = useQueryParams();

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      setSearch(params.query || "");
    });
  }, [params.query]);

  const handleSearch = () => {
    navigate(`/search?query=${search}`);
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        width: "100%",
      }}
    >
      <SearchIcon />
      <Input
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        sx={{
          width: "100%",
        }}
      />
      <Button
        size="small"
        variant="text"
        onClick={handleSearch}
        sx={{
          visibility: search ? "visible" : "hidden",
        }}
      >
        Search
      </Button>
    </Box>
  );
};
