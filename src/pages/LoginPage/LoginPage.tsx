import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { Form, FormInput } from "../../components/Form";
import { useNavigate } from "react-router-dom";
import { LOGIN_MUTATION } from "./mutations";
import { UserModelInterface } from "../../types/interfaces";
import { useAuth } from "../../hooks/useAuth";
import { HomeLayout } from "../../components/HomeLayout";
import { Box, Button } from "@mui/material";

const LoginPage = () => {
  const formHook = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    reValidateMode: "onChange",
  });
  const navigate = useNavigate();
  const [loginUser, { loading, error }] = useMutation(LOGIN_MUTATION);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = formHook.getValues();
    if (!values.username || !values.password) {
      alert("Please fill out all fields");
      return;
    }
    const res = (await loginUser({
      variables: values,
    })) as {
      data: {
        login: {
          token: string;
          user: UserModelInterface;
        };
      };
    };

    login(res.data.login.token);
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
          onSubmit={handleSubmit}
          submitText="Login"
          formHook={formHook}
        />
      )}
      MenuComponent={() => (
        <Box display="flex" justifyContent="center" mt={1}>
          <Button
            variant="outlined"
            color="secondary"
            size="small"
            onClick={() => navigate("/create-user")}
          >
            Create an account
          </Button>
        </Box>
      )}
      welcomeMessage="Welcome back!"
    />
  );
};

export { LoginPage };
