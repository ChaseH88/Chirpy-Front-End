import { Box, Button, LinearProgress, Typography } from "@mui/material";
import { CommentInterface, PostModelInterface } from "../../types/interfaces";
import { Form, FormInput } from "../Form";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
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
import { useModal } from "../../providers/Modal/ModalProvider";
import { CREATE_POST_COMMENT_MUTATION } from "../../graphql/mutations/create-post-comment";
import { DELETE_POST_MUTATION } from "../../graphql/mutations/delete-post";
import { FIND_POST_QUERY } from "../../graphql/queries/find-post";

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
  const { showModal, hideModal } = useModal();
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
    showModal(
      <Box>
        <Typography variant="h6" fontWeight={700}>
          Are you sure you want to delete this post?
        </Typography>
        <Box display={"flex"} gap={1} justifyContent={"center"} mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={async () => {
              hideModal();
              const res = await deletePost({
                variables: {
                  id,
                },
                updateQueries: {
                  Search: (prev) => ({
                    search: {
                      ...prev.search,
                      posts: prev.search.posts.filter(
                        (post: PostModelInterface) => post.id !== id
                      ),
                    },
                  }),
                },
              });
              onDeletePost?.();
              enqueueSnackbar(res.data.deletePost, {
                variant: "success",
              });
            }}
          >
            Yes
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => hideModal()}
          >
            No
          </Button>
        </Box>
      </Box>
    );
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
              src={post.postedBy.photo as any}
              name={post.postedBy.username}
              width={18}
              height={18}
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
              src={post.postedBy.photo as any}
              name={post.postedBy.username}
              width={18}
              height={18}
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
