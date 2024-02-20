import { Form, FormInput } from "../../components/Form";
import { useMutation } from "@apollo/client";
import { CREATE_USER_MUTATION } from "./mutations";
import { useForm } from "react-hook-form";
import { UserModelInterface } from "../../types/interfaces";
import { useAuth } from "../../hooks/useAuth";
import { HomeLayout } from "../../components/HomeLayout";
import { Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const CreateUserPage = () => {
  const { login } = useAuth();
  const formHook = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
    reValidateMode: "onChange",
  });
  const navigate = useNavigate();

  const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // every value is required, lets check with an array
    const valuesExist = Object.values(formHook.getValues()).every(
      (value) => value
    );
    const values = formHook.getValues();

    if (!valuesExist) {
      alert("Please fill out all fields");
      return;
    }

    const response = (await createUser({
      variables: values,
    })) as {
      data: {
        createUser: {
          token: string;
          user: UserModelInterface;
        };
      };
    };
    login(response.data.createUser.token);
  };

  const inputs: FormInput[] = [
    {
      name: "username",
      type: "text",
      placeholder: "Enter your username",
      required: true,
      label: "Username",
    },
    {
      name: "email",
      type: "email",
      placeholder: "Enter your email",
      required: true,
      label: "Email",
    },
    {
      name: "password",
      type: "password",
      placeholder: "Enter your password",
      required: true,
      label: "Password",
    },
  ];

  return (
    <HomeLayout
      FormComponent={() => (
        <Form
          inputs={inputs}
          submitText="Create User"
          onSubmit={handleSubmit}
          isLoading={loading}
          formHook={formHook}
        />
      )}
      MenuComponent={() => (
        <Box display="flex" justifyContent="center" mt={1}>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => navigate("/login")}
          >
            Login
          </Button>
        </Box>
      )}
      welcomeMessage="Create an account"
    />
  );
};

export { CreateUserPage };
