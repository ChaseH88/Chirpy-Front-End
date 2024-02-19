import { useForm } from 'react-hook-form';
import { useMutation } from '@apollo/client';
import { Form, FormInput } from '../../components/Form';
import { useNavigate } from 'react-router-dom';
import { LOGIN_MUTATION } from './mutations';
import { useAppData } from '../../hooks/useAppData';
import { UserModelInterface } from '../../types/interfaces';

const LoginPage = () => {
  const formHook = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    reValidateMode: 'onChange',
  });
  const navigate = useNavigate();
  const [loginUser, { loading }] = useMutation(LOGIN_MUTATION);
  const { setCurrentUser } = useAppData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const values = formHook.getValues();
    if (!values.username || !values.password) {
      alert('Please fill out all fields');
      return;
    }
    const response = (await loginUser({
      variables: values,
    })) as {
      data: {
        login: UserModelInterface;
      };
    };

    setCurrentUser(response.data.login);
    navigate('/dashboard');
  };

  const inputs: FormInput[] = [
    {
      name: 'username',
      type: 'text',
      placeholder: 'Enter your username',
      required: true,
      label: 'Username',
      value: formHook.getValues('username'),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        formHook.setValue('username', e.target.value),
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
      label: 'Password',
      value: formHook.getValues('password'),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        formHook.setValue('password', e.target.value),
    },
  ];

  return <Form inputs={inputs} submitText="Login" onSubmit={handleSubmit} />;
};

export { LoginPage };
