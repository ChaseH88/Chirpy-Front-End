import React, { useEffect } from "react";
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
  label?: string | React.ReactNode;
  value?: string;
  options?: {
    id: string;
    label: string;
  }[];
  hideLabel?: boolean;
}

export interface FormProps<T = any> {
  inputs: FormInput[];
  submitText: string;
  onSubmit: (data: T) => void;
  onCancel?: () => void;
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
  onCancel,
}: FormProps<T>) => {
  const buttonPositionStyle = {
    left: "flex-start",
    center: "center",
    right: "flex-end",
    full: "center",
  }[buttonPosition];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.key === "Enter") ||
        (e.metaKey && e.key === "Enter")
      ) {
        handleSubmit(onSubmit)();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleSubmit, onSubmit]);

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
                  {!input.hideLabel && <InputLabel>{input.label}</InputLabel>}
                  <Select {...field} label={input.label}>
                    {input.options?.map((option, idx) => (
                      <MenuItem key={idx} value={option.id}>
                        {option.label}
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
                  hiddenLabel={input.hideLabel}
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
                  hiddenLabel={input.hideLabel}
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
          <Box display="flex" justifyContent={buttonPositionStyle} gap={2}>
            {onCancel && (
              <Button
                variant="outlined"
                color="secondary"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            )}
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
