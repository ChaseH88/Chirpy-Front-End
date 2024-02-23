import React from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
} from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";

type FormTypes = "text" | "email" | "password" | "textarea" | "select";

export interface FormInput {
  name: string;
  type: FormTypes;
  placeholder: string;
  required: boolean;
  label: string;
  value?: string;
  options?: string[];
}

export interface FormProps<T = any> {
  inputs: FormInput[];
  submitText: string;
  onSubmit: (data: T) => void;
  isLoading?: boolean;
  formHook: UseFormReturn<any>;
  buttonPosition?: "center" | "right" | "left" | "full";
}

const Form = <T,>({
  inputs,
  submitText,
  onSubmit,
  isLoading,
  formHook: { control, handleSubmit },
  buttonPosition = "full",
}: FormProps<T>) => {
  const buttonPositionStyle = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
    full: "center",
  }[buttonPosition];

  const renderInput = (input: FormInput, index: number) => {
    return (
      <Controller
        key={index}
        name={input.name}
        control={control}
        defaultValue={input.value || ""}
        rules={{ required: input.required }}
        render={({ field }) => {
          switch (input.type) {
            case "select":
              return (
                <FormControl fullWidth required={input.required}>
                  <InputLabel>{input.label}</InputLabel>
                  <Select {...field} label={input.label}>
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
                  {...field}
                  multiline
                  rows={4}
                  variant="outlined"
                  placeholder={input.placeholder}
                  required={input.required}
                  label={input.label}
                />
              );
            default:
              return (
                <TextField
                  {...field}
                  variant="outlined"
                  type={input.type}
                  placeholder={input.placeholder}
                  required={input.required}
                  label={input.label}
                />
              );
          }
        }}
      />
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      style={{ backgroundColor: "white" }}
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
