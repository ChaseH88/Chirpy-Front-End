import { useMutation } from "@apollo/client";
import { useAppData } from "../../hooks/useAppData";
import { Form, FormInput } from "../../components/Form";
import { useForm } from "react-hook-form";
import { DashboardLayout } from "../../components/DashboardLayout";
import { Box, Typography } from "@mui/material";
import { useEffect } from "react";
import { Avatar } from "../../components/Avatar";
import { EDIT_USER_MUTATION } from "./mutations";
import { UserModelInterface } from "../../types/interfaces";
import { icons } from "../../components/UserProfilePhoto";
import { useSnackbar } from "notistack";
import { CurrentUserInterface } from "../../providers/AppData";

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

  const { currentUser, setCurrentUser } = useAppData();
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

      const res = (await editUser({
        variables: {
          id: currentUser!.id,
          data,
        },
      })) as {
        data: {
          editUser: UserModelInterface;
        };
      };
      setCurrentUser(res.data.editUser as CurrentUserInterface);
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
    {
      name: "photo",
      type: "select",
      placeholder: "Enter your photo",
      required: false,
      label: "Photo",
      options: Object.keys(icons).map((key) => ({
        id: key,
        label: key.charAt(0).toUpperCase() + key.slice(1),
      })),
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
      AvatarComponent={() => (
        <Box>
          <Avatar user={currentUser!} />
        </Box>
      )}
    />
  );
};

export { EditUserPage };
