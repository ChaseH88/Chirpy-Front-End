import { Box, Button, Typography } from "@mui/material";
import { CommentInterface, PostModelInterface } from "../../types/interfaces";
import { Form, FormInput } from "../Form";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import {
  CREATE_POST_COMMENT_MUTATION,
  LIKE_POST_MUTATION,
  DISLIKE_POST_MUTATION,
} from "./mutations";
import { useAppData } from "../../hooks/useAppData";
import { useState } from "react";
import { GET_DASHBOARD_POSTS } from "../../pages/DashboardPage/queries";
import { PostContainer } from "./styled";
import moment from "moment";
import { CommentItem } from "./CommentItem";
import { Comments } from "./Comments";

export interface PostProps {
  post: PostModelInterface;
  OverrideCommentButton?: React.ReactNode;
  commentsToShow: number;
}

export const Post = ({
  post,
  OverrideCommentButton,
  commentsToShow,
}: PostProps) => {
  const [commentOn, setCommentOn] = useState(false);
  const formHook = useForm({
    defaultValues: {
      comment: "",
    },
    reValidateMode: "onChange",
  });
  const [createPostComment, { loading: createPostCommentLoading }] =
    useMutation(CREATE_POST_COMMENT_MUTATION);
  const [likePost, { loading: likePostLoading }] =
    useMutation(LIKE_POST_MUTATION);
  const [dislikePost, { loading: dislikePostLoading }] = useMutation(
    DISLIKE_POST_MUTATION
  );

  const { currentUser } = useAppData();

  const handleCreatePostComment = async (data: CommentInterface) => {
    if (!data.comment) {
      alert("Please fill out all fields");
      return;
    }
    await createPostComment({
      variables: {
        data: {
          postId: post.id,
          userId: currentUser!.id,
          comment: data.comment,
        },
      },
      refetchQueries: [{ query: GET_DASHBOARD_POSTS }],
    });
    setCommentOn(false);
  };

  const toggleCommentBox = () => setCommentOn(!commentOn);

  const handleLikePost = async () => {
    await likePost({
      variables: {
        data: {
          postId: post.id,
          userId: currentUser!.id,
        },
      },
      refetchQueries: [{ query: GET_DASHBOARD_POSTS }],
    });
  };

  const handleDislikePost = async () => {
    await dislikePost({
      variables: {
        data: {
          postId: post.id,
          userId: currentUser!.id,
        },
      },
      refetchQueries: [{ query: GET_DASHBOARD_POSTS }],
    });
  };

  const inputs: FormInput[] = [
    {
      name: "comment",
      type: "text",
      placeholder: "Enter your comment",
      required: true,
      label: "Comment",
    },
  ];

  return (
    <PostContainer>
      <Box
        className="content"
        p={2}
        borderRadius={2}
        sx={{
          background: "#eee",
        }}
      >
        <Typography variant="body1">{post.content}</Typography>
      </Box>
      <Box
        className="postedBy"
        display="flex"
        justifyContent="space-between"
        p={2}
      >
        <Box display="flex" alignItems="center">
          <Typography
            variant="body2"
            fontStyle={"italic"}
            fontWeight={700}
            mr={1}
          >
            {post.postedBy.username}
          </Typography>{" "}
          -
          <Typography variant="body2" ml={1}>
            {moment(post.createdAt).format("MMMM Do YYYY, h:mm:ss a")}
          </Typography>
        </Box>
        <Box display="flex" alignItems="center">
          <Box position={"relative"} display={"flex"} alignItems={"center"}>
            <ThumbUpIcon
              sx={{
                height: 16,
                width: 16,
                fill: "green",
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

          <Box position={"relative"} display={"flex"} alignItems={"center"}>
            <ThumbDownIcon sx={{ height: 16, width: 16, fill: "red" }} />
            <Typography
              variant="body2"
              fontStyle={"italic"}
              fontWeight={700}
              mr={1}
            >
              {post.dislikes.length}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderTop={1}
        borderColor={"primary.main"}
        p={2}
        mb={2}
      >
        <Box display={"flex"} alignItems={"center"} gap={1}>
          {post.postedBy.id !== currentUser?.id && (
            <>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleDislikePost}
                disabled={dislikePostLoading}
                sx={{
                  padding: 1,
                  width: 20,
                  height: 20,
                  minWidth: "auto",
                  "& svg": {
                    width: 14,
                    height: 14,
                  },
                }}
              >
                <ThumbDownIcon />
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleLikePost}
                disabled={likePostLoading}
                sx={{
                  padding: 1,
                  width: 20,
                  height: 20,
                  minWidth: "auto",
                  "& svg": {
                    width: 14,
                    height: 14,
                  },
                }}
              >
                <ThumbUpIcon />
              </Button>
            </>
          )}
          <Typography fontSize={14} variant="h6">
            {`${post.comments.length} Comment${
              post.comments.length > 1 ? "s" : ""
            }`}
          </Typography>
        </Box>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={toggleCommentBox}
        >
          {commentOn ? "Cancel" : "Comment"}
        </Button>
      </Box>
      {commentOn ? (
        <Form<CommentInterface>
          inputs={inputs}
          onSubmit={handleCreatePostComment}
          submitText="Comment"
          formHook={formHook}
        />
      ) : (
        <>
          <Comments
            comments={post.comments}
            postsToShow={commentsToShow}
            OverrideToggleButton={OverrideCommentButton}
          />
        </>
      )}
    </PostContainer>
  );
};
