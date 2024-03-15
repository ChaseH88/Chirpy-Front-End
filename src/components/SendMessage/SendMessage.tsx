import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { Form, FormInput } from "../Form";
import { useMessages } from "../../hooks/useMessages";

export interface SendMessageProps {
  toId: string;
  toUsername: string;
  onSendMessage?: () => void;
}

export const SendMessage = ({
  toId,
  toUsername,
  onSendMessage,
}: SendMessageProps) => {
  const { sendMessageMutation } = useMessages();

  const formHook = useForm({
    defaultValues: {
      toId: toId,
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
      placeholder: `Send a message to ${toUsername}...`,
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
