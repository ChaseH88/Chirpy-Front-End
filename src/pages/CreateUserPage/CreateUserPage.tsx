import { useState } from 'react';
import { Form, FormInput } from '../../components/Form';
import { useMutation } from '@apollo/client';
import { CREATE_USER_MUTATION } from './mutations';
import { useForm } from 'react-hook-form';
import { useAppData } from '../../hooks/useAppData';
import { UserModelInterface } from '../../types/interfaces';
import { useNavigate } from 'react-router-dom';

const CreateUserPage = () => {
  const { getValues, setValue } = useForm({
    defaultValues: {
      username: '',
      email: '',
      password: '',
    },
    reValidateMode: 'onChange',
  });

  const [createUser, { loading }] = useMutation(CREATE_USER_MUTATION);
  const { setCurrentUser } = useAppData();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // every value is required, lets check with an array
    const valuesExist = Object.values(getValues()).every((value) => value);
    const values = getValues();

    if (!valuesExist) {
      alert('Please fill out all fields');
      return;
    }

    const response = (await createUser({
      variables: values,
    })) as {
      data: {
        createUser: UserModelInterface;
      };
    };

    setCurrentUser(response.data.createUser);
    navigate('/dashboard');
  };

  const inputs: FormInput[] = [
    {
      name: 'username',
      type: 'text',
      placeholder: 'Enter your username',
      required: true,
      label: 'Username',
      value: getValues('username'),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValue('username', e.target.value),
    },
    {
      name: 'email',
      type: 'email',
      placeholder: 'Enter your email',
      required: true,
      label: 'Email',
      value: getValues('email'),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValue('email', e.target.value),
    },
    {
      name: 'password',
      type: 'password',
      placeholder: 'Enter your password',
      required: true,
      label: 'Password',
      value: getValues('password'),
      onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
        setValue('password', e.target.value),
    },
  ];

  return (
    <Form inputs={inputs} submitText="Create User" onSubmit={handleSubmit} />
  );
};

export { CreateUserPage };
