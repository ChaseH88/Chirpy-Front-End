import { Box, Button, Typography } from "@mui/material";
import { PostModelInterface } from "../../types/interfaces";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import ThumbUp from "@mui/icons-material/ThumbUp";
import { useAppData } from "../../hooks/useAppData";
import ThumbDown from "@mui/icons-material/ThumbDown";

interface TrendingProps {
  trendingPosts: PostModelInterface[];
}

export const Trending = ({ trendingPosts }: TrendingProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAppData();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Trending
      </Typography>
      {trendingPosts?.map((post) => (
        <Box
          key={post.id}
          onClick={() => navigate(`/post/${post.id}`)}
          sx={{
            backgroundColor: "white",
          }}
          p={4}
          mb={4}
          borderRadius={3}
        >
          <Box
            sx={{
              background: "#eee",
            }}
            mb={2}
            p={2}
            borderRadius={3}
          >
            {post.content}
          </Box>
          <Box>
            <Box
              position={"relative"}
              display={"flex"}
              alignItems={"center"}
              title={
                post.likes.find((like) => like.id === currentUser?.id)
                  ? "You have liked this post"
                  : ""
              }
            >
              <ThumbUp
                sx={{
                  height: 16,
                  width: 16,
                  fill: post.likes.find((like) => like.id === currentUser?.id)
                    ? "green"
                    : "gray",
                }}
              />
              <Typography
                variant="body2"
                fontStyle={"italic"}
                fontWeight={700}
                mr={1}
              >
                {post.likes.length}
              </Typography>
            </Box>
            <Box
              position={"relative"}
              display={"flex"}
              alignItems={"center"}
              title={
                post.likes.find((like) => like.id === currentUser?.id)
                  ? "You have liked this post"
                  : ""
              }
            >
              <ThumbDown
                sx={{
                  height: 16,
                  width: 16,
                  fill: post.dislikes.find(
                    (dislike) => dislike.id === currentUser?.id
                  )
                    ? "green"
                    : "gray",
                }}
              />
              <Typography
                variant="body2"
                fontStyle={"italic"}
                fontWeight={700}
                mr={1}
              >
                {post.likes.length}
              </Typography>
            </Box>
          </Box>

          <Box display="flex" justifyContent="space-between">
            <Typography variant="caption">{post.postedBy.username}</Typography>
            <Typography variant="caption">
              {moment(post.createdAt).format("MM/DD/YYYY")}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
