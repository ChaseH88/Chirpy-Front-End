import { Box, Typography } from "@mui/material";
import { PostModelInterface } from "../../types/interfaces";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import ThumbUp from "@mui/icons-material/ThumbUp";
import { useAppData } from "../../hooks/useAppData";
import ThumbDown from "@mui/icons-material/ThumbDown";
import { LikeDislikeButtons } from "../LikeDislikeButtons/LikeDislikeButtons";
import { UserHoverMenu } from "../UserHoverMenu";

interface TrendingProps {
  trendingPosts: PostModelInterface[];
}

export const Trending = ({ trendingPosts }: TrendingProps) => {
  const navigate = useNavigate();
  const { currentUser } = useAppData();

  return (
    <Box
      sx={{
        height: "95vh",
        overflow: "auto",
        padding: "0 10px 0 0",
        "&::-webkit-scrollbar": {
          width: "6px",
        },
        "&::-webkit-scrollbar-track": {
          boxShadow: "inset 0 0 6px rgba(0,0,0,0.3)",
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: "blue",
          borderRadius: "3px",
        },
        scrollbarColor: "#fff #7bd2ff",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Trending
      </Typography>
      {trendingPosts?.map((post) => (
        <Box
          key={post.id}
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
              cursor: "pointer",
            }}
            mb={2}
            p={2}
            borderRadius={3}
            onClick={() => navigate(`/post/${post.id}`)}
          >
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </Box>
          <Box display={"flex"} justifyContent={"space-between"} px={1}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems={"center"}
            >
              <UserHoverMenu user={post.postedBy}>
                <Typography
                  variant="body2"
                  fontStyle={"italic"}
                  mr={1}
                  fontSize={12}
                >
                  <b>{post.postedBy.username}</b>
                  {" - "}
                </Typography>
              </UserHoverMenu>
              <Typography variant="body2" fontSize={11}>
                {moment(post.createdAt).format("MM/DD/YY, h:mm:ss a")}
              </Typography>
            </Box>
            <LikeDislikeButtons
              id={post.id}
              likes={post.likes}
              dislikes={post.dislikes}
              postedBy={post.postedBy}
            />
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            gap={1}
            mt={1}
            px={1}
            justifyContent={"space-between"}
          >
            <Typography
              sx={{
                cursor: "pointer",
              }}
              onClick={() => navigate(`/post/${post.id}`)}
              variant="body2"
              fontSize={14}
              fontWeight={700}
              color={"primary.main"}
            >
              See Post
            </Typography>
            <Typography fontSize={14} variant="h6">
              {`${post.comments.length} Comment${
                post.comments.length > 1 ? "s" : ""
              }`}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
};
