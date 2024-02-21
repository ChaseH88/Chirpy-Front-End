import { Box, Button, Paper, Typography } from "@mui/material";
import { CommentInterface, PostModelInterface } from "../../types/interfaces";
import { Form, FormInput } from "../Form";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CREATE_POST_COMMENT_MUTATION } from "./mutations";
import { useAppData } from "../../hooks/useAppData";
import { useState } from "react";
import { GET_POSTS } from "../../pages/DashboardPage/queries";
import { PostContainer } from "./styled";
import moment from "moment";

export const Post = ({ post }: { post: PostModelInterface }) => {
  const [commentOn, setCommentOn] = useState(false);
  const formHook = useForm({
    defaultValues: {
      comment: "",
    },
    reValidateMode: "onChange",
  });
  const [createPostComment, { loading }] = useMutation(
    CREATE_POST_COMMENT_MUTATION
  );
  const { currentUser } = useAppData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = formHook.getValues();
    if (!values.comment) {
      alert("Please fill out all fields");
      return;
    }
    await createPostComment({
      variables: {
        data: {
          postId: post.id,
          userId: currentUser!.id,
          comment: values.comment,
        },
      },
      refetchQueries: [{ query: GET_POSTS }],
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
      <Box className="content" p={2}>
        <Typography variant="body1">{post.content}</Typography>
      </Box>
      <Box className="postedBy" display="flex" justifyContent="flex-end" p={2}>
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
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        borderTop={1}
        borderColor={"primary.main"}
        p={2}
        mb={2}
      >
        <Typography mb={1} fontSize={14} variant="h6">
          {`${post.comments.length} Comment${
            post.comments.length > 1 ? "s" : ""
          }`}
        </Typography>
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
        <Form
          inputs={inputs}
          onSubmit={handleSubmit}
          submitText="Comment"
          formHook={formHook}
        />
      ) : (
        <>
          {post?.comments?.map((comment: CommentInterface) => (
            <Box
              key={comment.id}
              className="comment"
              mb={2}
              mx={2}
              p={2}
              borderBottom={1}
              borderColor={"primary.main"}
              bgcolor={"#f3f3f3"}
              borderRadius={3}
            >
              <Box>
                <Typography variant="body1">{comment.comment}</Typography>
              </Box>
              <Box
                display={"flex"}
                justifyContent={"flex-start"}
                mt={1}
                alignItems={"center"}
              >
                <Typography
                  variant="body2"
                  fontSize={12}
                  mr={0.5}
                  fontWeight={700}
                  fontStyle={"italic"}
                >
                  {`${comment.user.username} -`}
                </Typography>
                <Typography
                  fontSize={12}
                  variant="body2"
                  fontStyle={"italic"}
                  title={moment(comment.createdAt).format(
                    "MMMM Do YYYY, h:mm:ss a"
                  )}
                >
                  {moment(comment.createdAt).fromNow()}
                </Typography>
              </Box>
            </Box>
          ))}
        </>
      )}
    </PostContainer>
  );
};
