import { Box, Button, Paper, Typography } from "@mui/material";
import { CommentInterface, PostModelInterface } from "../../types/interfaces";
import { Form, FormInput } from "../Form";
import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { CREATE_POST_COMMENT_MUTATION } from "./mutations";
import { useAppData } from "../../hooks/useAppData";
import { useState } from "react";
import { GET_POSTS } from "../../pages/DashboardPage/queries";

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
    <Paper>
      <Box className="content">
        <Typography variant="body1">{post.content}</Typography>
      </Box>
      <Box className="postedBy">
        <Typography variant="body2">{post.postedBy.username}</Typography> -{" "}
        {/* <Typography variant="body2">{post.createdAt}</Typography> */}
      </Box>
      <Button onClick={toggleCommentBox}>Comment</Button>
      {commentOn ? (
        <Form
          inputs={inputs}
          onSubmit={handleSubmit}
          submitText="Comment"
          formHook={formHook}
        />
      ) : (
        <>
          <Typography variant="h6">{`${post.comments.length} Comment${
            post.comments.length > 1 ? "s" : ""
          }`}</Typography>
          {post?.comments?.map((comment: CommentInterface) => (
            <Box key={comment.id} className="comment">
              <Typography variant="body1">{comment.comment}</Typography>
              <Typography variant="body2">{comment.user.username}</Typography>
            </Box>
          ))}
        </>
      )}
    </Paper>
  );
};
