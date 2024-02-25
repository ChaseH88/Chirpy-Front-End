import { Box, Button, Typography } from "@mui/material";
import { CommentInterface, PostModelInterface } from "../../types/interfaces";
import { Form, FormInput } from "../Form";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CREATE_POST_COMMENT_MUTATION } from "./mutations";
import { useAppData } from "../../hooks/useAppData";
import { useState } from "react";
import { GET_DASHBOARD_POSTS } from "../../pages/DashboardPage/queries";
import { PostContainer } from "./styled";
import moment from "moment";
import { Comments } from "./Comments";
import { UserProfilePhoto } from "../UserProfilePhoto";
import { LikeDislikeButtons } from "../LikeDislikeButtons/LikeDislikeButtons";

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
      refetchQueries: [
        {
          query: GET_DASHBOARD_POSTS,
        },
      ],
    });
    setCommentOn(false);
  };

  const toggleCommentBox = () => setCommentOn(!commentOn);

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
      {currentUser?.id === post.postedBy.id && (
        <Box
          mr={1}
          position="absolute"
          top={-15}
          right={-20}
          display="flex"
          alignItems="center"
          p={1}
          borderRadius={2}
          sx={{
            background: "#bce5fa",
          }}
        >
          <>
            <UserProfilePhoto
              icon={post.postedBy.photo as any}
              width={18}
              height={18}
              svgHeight={12}
              svgWidth={12}
            />
            <Typography variant="body2" ml={1}>
              {post.postedBy.username}
            </Typography>
          </>
        </Box>
      )}
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
          <Box mr={1}>
            <UserProfilePhoto
              icon={post.postedBy.photo as any}
              width={18}
              height={18}
              svgHeight={12}
              svgWidth={12}
            />
          </Box>
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
          <LikeDislikeButtons
            id={post.id}
            likes={post.likes}
            dislikes={post.dislikes}
            postedBy={post.postedBy}
          />
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
          isLoading={createPostCommentLoading}
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
