import React, { useMemo } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import { UseFormReturn } from "react-hook-form";

type FormTypes = "text" | "email" | "password" | "textarea" | "select";

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
  isLoading?: boolean;
  formHook: UseFormReturn<any>;
  buttonPosition?: "center" | "right" | "left" | "full";
}

const Form: React.FC<FormProps> = ({
  inputs,
  submitText,
  onSubmit,
  isLoading,
  formHook: { setValue, getValues },
  buttonPosition = "full",
}) => {
  const buttonPositionStyle = useMemo(
    () =>
      ({
        left: "flex-start",
        center: "center",
        right: "flex-end",
        full: "center",
      }[buttonPosition]),
    [buttonPosition]
  );

  const renderInput = (input: FormInput, index: number) => {
    switch (input.type) {
      case "select":
        return (
          <FormControl fullWidth key={index} required={input.required}>
            <InputLabel>{input.label}</InputLabel>
            <Select
              name={input.name}
              value={input.value || getValues(input.name)}
              onChange={(e) => {
                setValue(input.name, e.target.value);
                input.onChange?.(e as any);
              }}
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
      case "textarea":
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
            onChange={(e) => {
              setValue(input.name, e.target.value);
              input.onChange?.(e as any);
            }}
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
            onChange={(e) => {
              setValue(input.name, e.target.value);
              input.onChange?.(e as any);
            }}
          />
        );
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      style={{
        backgroundColor: "white",
      }}
    >
      <fieldset disabled={isLoading} style={{ border: "none" }}>
        <Box display="flex" flexDirection="column" gap={2}>
          {inputs.map(renderInput)}
          <Box display="flex" justifyContent={buttonPositionStyle}>
            <Button type="submit" variant="contained" color="primary">
              {isLoading ? "Loading..." : submitText}
            </Button>
          </Box>
        </Box>
      </fieldset>
    </form>
  );
};

export { Form };
