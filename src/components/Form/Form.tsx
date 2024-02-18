import React from 'react';
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from '@mui/material';

type FormTypes = 'text' | 'email' | 'password' | 'textarea' | 'select';

export interface FormInput {
  name: string;
  type: FormTypes;
  placeholder: string;
  required: boolean;
  label: string;
  value?: string;
  options?: string[];
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface FormProps {
  inputs: FormInput[];
  submitText: string;
  onSubmit: (e: React.FormEvent) => void;
}

const Form: React.FC<FormProps> = ({ inputs, submitText, onSubmit }) => {
  const renderInput = (input: FormInput, index: number) => {
    switch (input.type) {
      case 'select':
        return (
          <FormControl fullWidth key={index} required={input.required}>
            <InputLabel>{input.label}</InputLabel>
            <Select
              name={input.name}
              value={input.value}
              onChange={input.onChange as any}
              label={input.label}
            >
              {input.options?.map((option, idx) => (
                <MenuItem key={idx} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'textarea':
        return (
          <TextField
            key={index}
            multiline
            rows={4}
            variant="outlined"
            name={input.name}
            placeholder={input.placeholder}
            required={input.required}
            label={input.label}
            defaultValue={input.value}
            onChange={input.onChange}
          />
        );
      default:
        return (
          <TextField
            key={index}
            variant="outlined"
            name={input.name}
            type={input.type}
            placeholder={input.placeholder}
            required={input.required}
            label={input.label}
            defaultValue={input.value}
            onChange={input.onChange}
          />
        );
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <Box display="flex" flexDirection="column" gap={2}>
        {inputs.map(renderInput)}
        <Button type="submit" variant="contained" color="primary">
          {submitText}
        </Button>
      </Box>
    </form>
  );
};

export { Form };
