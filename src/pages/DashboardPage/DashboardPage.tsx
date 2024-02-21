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
    <DashboardLayout
      PostsComponent={() => (
        <Box>
          <Box mb={5} borderBottom={1} borderColor="primary.main" pb={2}>
            <Form
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
            <Posts posts={data?.allPosts} />
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
  );
};

export { DashboardPage };
