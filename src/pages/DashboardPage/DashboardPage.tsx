import { useMutation, useQuery } from "@apollo/client";
import { GET_POSTS } from "./queries";
import { useAppData } from "../../hooks/useAppData";
import { useAuth } from "../../hooks/useAuth";
import { Posts } from "../../components/Posts/Posts";
import { CREATE_POST_MUTATION } from "./mutations";
import { Form, FormInput } from "../../components/Form";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Box } from "@mui/material";

const DashboardPage = () => {
  const { loading: getPostLoading, error, data } = useQuery(GET_POSTS);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = formHook.getValues();
    if (!values.content) {
      alert("Please fill out all fields");
      return;
    }
    await createPost({
      variables: {
        data: {
          content: values.content,
          postedBy: currentUser!.id,
        },
      },
      refetchQueries: [{ query: GET_POSTS }],
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
    <div>
      <DashboardLayout
        PostsComponent={() => (
          <Box>
            <Box mb={2}>
              <Form
                inputs={inputs}
                onSubmit={handleSubmit}
                submitText="Post"
                formHook={formHook}
              />
            </Box>
            <Box>
              <Posts posts={data?.allPosts} headingText="All Posts" />
            </Box>
          </Box>
        )}
        AvatarComponent={() => (
          <div>
            <button onClick={logout}>Logout</button>
          </div>
        )}
        TrendingComponent={() => <div>Trending</div>}
      />
      <h1>Dashboard</h1>
    </div>
  );
};

export { DashboardPage };
