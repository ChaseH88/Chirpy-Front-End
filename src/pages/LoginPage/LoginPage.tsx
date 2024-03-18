import { useForm } from "react-hook-form";
import { useMutation } from "@apollo/client";
import { Form, FormInput } from "../../components/Form";
import { useNavigate } from "react-router-dom";
import { UserModelInterface } from "../../types/interfaces";
import { useAuth } from "../../hooks/useAuth";
import { HomeLayout } from "../../components/HomeLayout";
import { Box, Button } from "@mui/material";
import { useSnackbar } from "notistack";
import { LOGIN_MUTATION } from "../../graphql/mutations/login";

type FormDataType = {
  username: string;
  password: string;
};

const LoginPage = () => {
  const formHook = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    reValidateMode: "onChange",
  });
  const navigate = useNavigate();
  const [loginUser, { loading }] = useMutation(LOGIN_MUTATION);
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (data: FormDataType) => {
    try {
      if (!data.username || !data.password) {
        alert("Please fill out all fields");
        return;
      }
      const res = (await loginUser({
        variables: data,
      })) as {
        data: {
          login: {
            token: string;
            user: UserModelInterface;
          };
        };
      };
      login(res.data.login.token);
    } catch {
      enqueueSnackbar("Invalid username or password", {
        variant: "error",
      });
    }
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
        <Form<FormDataType>
          inputs={inputs}
          onSubmit={handleSubmit}
          submitText="Login"
          formHook={formHook}
          isLoading={loading}
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
