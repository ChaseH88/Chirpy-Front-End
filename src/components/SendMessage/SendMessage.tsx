import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { Form, FormInput } from "../Form";
import { useMessages } from "../../hooks/useMessages";
import { MessageModelInterface } from "../../types/interfaces";

export interface SendMessageProps {
  message: MessageModelInterface;
  onSendMessage?: () => void;
}

export const SendMessage = ({ message, onSendMessage }: SendMessageProps) => {
  const { sendMessageMutation } = useMessages();

  const formHook = useForm({
    defaultValues: {
      toId: message.fromId.id,
      content: "",
    },
    reValidateMode: "onChange",
  });

  const handleSendMessage = async (data: { toId: string; content: string }) => {
    await sendMessageMutation({
      toId: data.toId,
      content: data.content,
    });
    formHook.reset();
    onSendMessage?.();
  };

  const inputs: FormInput[] = [
    {
      name: "content",
      type: "text",
      placeholder: `Send a message to ${message.fromId.username}...`,
      required: true,
      hideLabel: true,
    },
  ];

  return (
    <Box>
      <Form<any>
        inputs={inputs}
        onSubmit={handleSendMessage}
        submitText="Send"
        formHook={formHook}
      />
      <hr />
    </Box>
  );
};
