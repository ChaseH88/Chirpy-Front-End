import { Box, Button, Typography } from "@mui/material";
import { useMutation } from "@apollo/client";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ThumbDownOutlineIcon from "@mui/icons-material/ThumbDownOffAlt";
import ThumbUpOutlineIcon from "@mui/icons-material/ThumbUpOffAlt";
import { LIKE_POST_MUTATION, DISLIKE_POST_MUTATION } from "./mutations";
import { useAppData } from "../../hooks/useAppData";
import { GET_DASHBOARD_POSTS } from "../../pages/DashboardPage/queries";
import { PostModelInterface } from "../../types/interfaces";
import { useSnackbar } from "notistack";

export interface LikeDislikeButtonsProps
  extends Pick<PostModelInterface, "likes" | "dislikes" | "postedBy" | "id"> {}

export const LikeDislikeButtons = ({
  likes = [],
  dislikes = [],
  postedBy,
  id: postId,
}: LikeDislikeButtonsProps) => {
  const [likePost, { loading: likePostLoading }] =
    useMutation(LIKE_POST_MUTATION);
  const [dislikePost, { loading: dislikePostLoading }] = useMutation(
    DISLIKE_POST_MUTATION
  );

  const { currentUser } = useAppData();
  const { enqueueSnackbar } = useSnackbar();

  const handleLikePost = async () => {
    const res = await likePost({
      variables: {
        data: {
          postId,
          userId: currentUser!.id,
        },
      },
      refetchQueries: [{ query: GET_DASHBOARD_POSTS }],
    });
    if (res?.data?.likePost) {
      enqueueSnackbar(res.data.likePost, { variant: "success" });
    }
  };

  const handleDislikePost = async () => {
    const res = await dislikePost({
      variables: {
        data: {
          postId,
          userId: currentUser!.id,
        },
      },
      refetchQueries: [{ query: GET_DASHBOARD_POSTS }],
    });
    if (res?.data?.dislikePost) {
      enqueueSnackbar(res.data.dislikePost, { variant: "success" });
    }
  };

  const hasLikedPost = likes.some(
    (like) => like.username === currentUser?.username
  );
  const hasDislikedPost = dislikes.some(
    (dislike) => dislike.username === currentUser?.username
  );
  const currentUserOwnsPost = currentUser?.id === postedBy.id;

  return (
    <Box>
      <Box display={"flex"} alignItems={"center"} gap={1}>
        <>
          <Button
            variant="text"
            color="secondary"
            onClick={() =>
              currentUser!.id !== postedBy.id && handleDislikePost()
            }
            disabled={dislikePostLoading || currentUserOwnsPost}
            sx={{
              cursor: currentUserOwnsPost ? "default" : "pointer",
              padding: 1,
              width: 20,
              height: 20,
              minWidth: "auto",
              "& svg": {
                width: 14,
                height: 14,
                fill: hasDislikedPost ? "red" : "inherit",
              },
            }}
          >
            {hasDislikedPost ? <ThumbDownIcon /> : <ThumbDownOutlineIcon />}
            <Box position="absolute" top={-9} left={17}>
              <Typography
                variant="caption"
                fontWeight={"bold"}
                color={"#252525"}
              >
                {dislikes.length}
              </Typography>
            </Box>
          </Button>
          <Button
            variant="text"
            color="primary"
            onClick={() => !currentUserOwnsPost && handleLikePost()}
            disabled={likePostLoading || currentUserOwnsPost}
            sx={{
              cursor: currentUserOwnsPost ? "default" : "pointer",
              padding: 1,
              width: 20,
              height: 20,
              minWidth: "auto",
              "& svg": {
                width: 14,
                height: 14,
                fill: hasLikedPost ? "green" : "inherit",
              },
            }}
          >
            {hasLikedPost ? <ThumbUpIcon /> : <ThumbUpOutlineIcon />}
            <Box position="absolute" top={-9} left={17}>
              <Typography
                variant="caption"
                fontWeight={"bold"}
                color={"#252525"}
              >
                {likes.length}
              </Typography>
            </Box>
          </Button>
        </>
      </Box>
    </Box>
  );
};
