import { useMutation } from "@apollo/client";
import { useAppData } from "../../hooks/useAppData";
import { Form, FormInput } from "../../components/Form";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { useSnackbar } from "notistack";
import { EDIT_USER_MUTATION } from "../../graphql/mutations/edit-user";
import { CURRENT_USER_QUERY } from "../../graphql/queries/current-user";

type FormDataType = {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  photo: string;
};

const EditUserPage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [editUser, { loading: editUserLoading }] =
    useMutation(EDIT_USER_MUTATION);

  const { currentUser } = useAppData();
  const formHook = useForm({
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (currentUser) {
      formHook.setValue("username", currentUser.username);
      formHook.setValue("firstName", currentUser.firstName);
      formHook.setValue("lastName", currentUser.lastName);
      formHook.setValue("bio", currentUser.bio);
      formHook.setValue("photo", currentUser.photo);
    }
  }, [currentUser, formHook]);

  const handleSubmit = async (data: FormDataType) => {
    try {
      if (!data.username) {
        alert("Please fill out all fields");
        return;
      }

      await editUser({
        variables: {
          id: currentUser!.id,
          data,
        },
        refetchQueries: [CURRENT_USER_QUERY],
      });
      enqueueSnackbar("Profile updated", { variant: "success" });
    } catch (error) {
      enqueueSnackbar("Something went wrong", { variant: "error" });
    }
  };

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
  ];

  return (
    <DashboardLayout
      PostsComponent={() => (
        <Box
          p={6}
          borderRadius={3}
          sx={{
            backgroundColor: "white",
          }}
        >
          <Box mb={3}>
            <Typography variant="body1">Edit Profile</Typography>
          </Box>
          <Box>
            <Form<{
              username: string;
              firstName: string;
              lastName: string;
              bio: string;
              photo: string;
            }>
              formHook={formHook}
              inputs={inputs}
              onSubmit={handleSubmit}
              submitText="Update"
              isLoading={editUserLoading}
            />
          </Box>
        </Box>
      )}
    />
  );
};

export { EditUserPage };
