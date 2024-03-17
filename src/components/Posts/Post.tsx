import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { CommentInterface, PostModelInterface } from "../../types/interfaces";
import { Form, FormInput } from "../Form";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import {
  CREATE_POST_COMMENT_MUTATION,
  DELETE_POST_MUTATION,
} from "./mutations";
import { useAppData } from "../../hooks/useAppData";
import { useState } from "react";
import { PostContainer } from "./styled";
import moment from "moment";
import { Comments } from "./Comments";
import { UserProfilePhoto } from "../UserProfilePhoto";
import { LikeDislikeButtons } from "../LikeDislikeButtons/LikeDislikeButtons";
import { useNavigate, useParams } from "react-router-dom";
import { ActionMenu } from "../ActionMenu";
import { useSnackbar } from "notistack";
import { UserHoverMenu } from "../UserHoverMenu";
import { FIND_POST_QUERY } from "../../pages/FindPostPage/queries";

export interface PostProps {
  post: PostModelInterface;
  OverrideCommentButton?: React.ReactNode;
  commentsToShow: number;
  onDeletePost?: () => void;
  onCreatePostComment?: () => void;
}

export const Post = ({
  post,
  OverrideCommentButton,
  commentsToShow,
  onDeletePost,
  onCreatePostComment,
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
  const navigate = useNavigate();
  const { postId } = useParams();
  const { currentUser } = useAppData();
  const [deletePost, { loading: deletePostLoading }] =
    useMutation(DELETE_POST_MUTATION);
  const { enqueueSnackbar } = useSnackbar();
  const isCurrentPostPage = postId === post.id;

  const handleCreatePostComment = async (data: CommentInterface) => {
    if (!data.comment) {
      alert("Please fill out all fields");
      return;
    }
    const res = await createPostComment({
      variables: {
        data: {
          postId: post.id,
          userId: currentUser!.id,
          comment: data.comment,
        },
      },
      refetchQueries: [
        {
          query: FIND_POST_QUERY,
          variables: {
            id: post.id,
          },
        },
      ],
    });
    onCreatePostComment?.();
    enqueueSnackbar(res.data.createPostComment, {
      variant: "success",
    });
    setCommentOn(false);
  };
  const toggleCommentBox = () => setCommentOn(!commentOn);

  const handleDeletePost = async (id: string) => {
    const res = await deletePost({
      variables: {
        id,
      },
    });
    onDeletePost?.();
    enqueueSnackbar(res.data.deletePost, {
      variant: "success",
    });
  };

  const inputs: FormInput[] = [
    {
      name: "comment",
      type: "textarea",
      placeholder: "Enter your comment",
      required: true,
      label: "Comment",
    },
  ];

  return (
    <PostContainer>
      {deletePostLoading && (
        <Box
          justifyContent={"center"}
          display={"flex"}
          flexDirection={"column"}
          gap={2}
          position="absolute"
          sx={{
            width: "100%",
            height: "100%",
            background: "rgba(255, 255, 255, 0.75)",
            zIndex: 1000,
            top: 0,
            left: 0,
            alignItems: "center",
          }}
        >
          <Typography mb={1} variant="h6" fontWeight={700}>
            Deleting Post...
          </Typography>
          <LinearProgress
            color="success"
            sx={{
              height: 5,
              width: "80%",
            }}
          />
        </Box>
      )}
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
          borderColor={"primary.main"}
          border={1}
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
            <ActionMenu
              items={[
                ...(!isCurrentPostPage
                  ? [
                      {
                        onClick: () => navigate(`/post/${post.id}`),
                        text: "See Post",
                      },
                    ]
                  : []),
                {
                  onClick: () => handleDeletePost(post.id),
                  text: "Delete",
                },
              ]}
              sx={{
                ml: 1,
                "& button": {
                  border: "none",
                },
              }}
            />
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
        <div
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        />
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
          <UserHoverMenu user={post.postedBy}>
            <Typography
              variant="body2"
              fontStyle={"italic"}
              fontWeight={700}
              mr={1}
            >
              {post.postedBy.username}
            </Typography>
          </UserHoverMenu>{" "}
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
        <Box display="flex" gap={1}>
          {!isCurrentPostPage && (
            <Button
              size="small"
              variant="outlined"
              color="primary"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/post/${post.id}`);
              }}
            >
              See Post
            </Button>
          )}
          <Button
            size="small"
            variant="outlined"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              toggleCommentBox();
            }}
          >
            {commentOn ? "Cancel" : "Comment"}
          </Button>
        </Box>
      </Box>
      <>
        {commentOn && (
          <Box mb={2}>
            <Form<CommentInterface>
              inputs={inputs}
              onSubmit={handleCreatePostComment}
              submitText="Comment"
              formHook={formHook}
              isLoading={createPostCommentLoading}
              onCancel={toggleCommentBox}
            />
          </Box>
        )}
        <Comments
          comments={post.comments}
          postsToShow={commentsToShow}
          OverrideToggleButton={OverrideCommentButton}
        />
      </>
    </PostContainer>
  );
};
