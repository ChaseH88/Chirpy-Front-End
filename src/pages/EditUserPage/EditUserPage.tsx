import { useQuery } from "@apollo/client";
import { GET_DASHBOARD_POSTS } from "../DashboardPage/queries";
import { useAppData } from "../../hooks/useAppData";
import { useAuth } from "../../hooks/useAuth";
import { Posts } from "../../components/Posts/Posts";
import { Form, FormInput } from "../../components/Form";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Box, Button } from "@mui/material";
import { useEffect } from "react";

const EditUserPage = () => {
  const { loading: getPostLoading, data } = useQuery(GET_DASHBOARD_POSTS);
  const { currentUser } = useAppData();
  const { logout } = useAuth();
  const formHook = useForm({
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (currentUser) {
      formHook.setValue("username", currentUser.username);
      formHook.setValue("firstName", currentUser.firstName);
    }
  }, [currentUser, formHook]);

  const inputs: FormInput[] = [
    {
      name: "username",
      type: "text",
      placeholder: "Enter your username",
      required: false,
      label: "Username",
    },
    {
      name: "firstName",
      type: "text",
      placeholder: "Enter your first name",
      required: false,
      label: "First Name",
    },
    {
      name: "lastName",
      type: "text",
      placeholder: "Enter your last name",
      required: false,
      label: "Last Name",
    },
    {
      name: "bio",
      type: "text",
      placeholder: "Enter your bio",
      required: false,
      label: "Bio",
    },
    {
      name: "photo",
      type: "text",
      placeholder: "Enter your photo",
      required: false,
      label: "Photo",
    },
  ];

  return (
    <DashboardLayout
      PostsComponent={() => (
        <Form
          formHook={formHook}
          inputs={inputs}
          onSubmit={() => console.log(formHook.getValues())}
          submitText="Update"
        />
      )}
      AvatarComponent={() => (
        <div>
          <button onClick={logout}>Logout</button>
        </div>
      )}
      TrendingComponent={() => (
        <div>
          <Posts posts={data?.trendingPosts} commentsToShow={2} />
        </div>
      )}
    />
  );
};

export { EditUserPage };
