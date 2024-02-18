import { useState } from 'react';
import { Form, FormInput } from '../../components/Form';

const CreateUserPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ username, email, password });
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
      name: 'email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      label: 'Email',
      value: email,
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setEmail(e.target.value),
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

  return (
    <Form inputs={inputs} submitText="Create User" onSubmit={handleSubmit} />
  );
};

export { CreateUserPage };
