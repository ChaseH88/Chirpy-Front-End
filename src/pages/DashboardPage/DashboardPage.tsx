import { useMutation, useQuery } from "@apollo/client";
import { GET_DASHBOARD_POSTS } from "./queries";
import { useAppData } from "../../hooks/useAppData";
import { useAuth } from "../../hooks/useAuth";
import { Posts } from "../../components/Posts/Posts";
import { CREATE_POST_MUTATION } from "./mutations";
import { Form, FormInput } from "../../components/Form";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PostModelInterface } from "../../types/interfaces";

const DashboardPage = () => {
  const {
    loading: getPostLoading,
    error,
    data,
  } = useQuery(GET_DASHBOARD_POSTS);
  const [createPost, { loading: createPostLoading }] =
    useMutation(CREATE_POST_MUTATION);
  const { currentUser } = useAppData();
  const { logout } = useAuth();
  const formHook = useForm({
    defaultValues: {
      content: "",
    },
    reValidateMode: "onChange",
  });
  const navigate = useNavigate();

  const handleSubmit = async (data: PostModelInterface) => {
    if (!data.content) {
      alert("Please fill out all fields");
      return;
    }
    await createPost({
      variables: {
        data: {
          content: data.content,
          postedBy: currentUser!.id,
        },
      },
      refetchQueries: [{ query: GET_DASHBOARD_POSTS }],
    });
  };

  const inputs: FormInput[] = [
    {
      name: "content",
      type: "text",
      placeholder: "Enter your post",
      required: true,
      label: "Post",
    },
  ];

  return (
    <DashboardLayout
      PostsComponent={() => (
        <Box>
          <Box mb={5} borderBottom={1} borderColor="primary.main" pb={2}>
            <Form<PostModelInterface>
              inputs={inputs}
              onSubmit={handleSubmit}
              submitText="Post"
              formHook={formHook}
              buttonPosition="right"
            />
          </Box>
          <Box
            border={1}
            borderColor="primary.main"
            borderTop={0}
            px={4}
            py={2}
          >
            <Posts posts={data?.allPosts} commentsToShow={3} />
          </Box>
        </Box>
      )}
      AvatarComponent={() => (
        <div>
          <button onClick={logout}>Logout</button>
          <button onClick={() => navigate("/edit-user")}>Edit Profile</button>
        </div>
      )}
      TrendingComponent={() => (
        <div>
          <Posts
            posts={data?.trendingPosts}
            OverrideCommentButton={
              <Box display="flex" justifyContent="center">
                <Button variant="text" color="primary">
                  See More
                </Button>
              </Box>
            }
            commentsToShow={2}
          />
        </div>
      )}
    />
  );
};

export { DashboardPage };
