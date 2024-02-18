import { useState } from 'react';
import { Form, FormInput } from '../../components/Form';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ username, password });
  };

  const inputs: FormInput[] = [
    {
      name: 'username',
      type: 'text',
      placeholder: 'Enter your username',
      required: true,
      label: 'Username',
      value: username,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setUsername(e.target.value),
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
      label: 'Password',
      value: password,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setPassword(e.target.value),
    },
  ];

  return <Form inputs={inputs} submitText="Login" onSubmit={handleSubmit} />;
};

export { LoginPage };
