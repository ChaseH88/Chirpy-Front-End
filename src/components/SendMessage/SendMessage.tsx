import { Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { Form, FormInput } from "../Form";
import { useMessages } from "../../hooks/useMessages";

interface SendMessageProps {
  toId: string;
  username: string;
}

export const SendMessage = ({ toId, username }: SendMessageProps) => {
  const { sendMessageMutation } = useMessages();

  const formHook = useForm({
    defaultValues: {
      toId,
      content: "",
    },
    reValidateMode: "onChange",
  });

  const handleSendMessage = async (data: { toId: string; content: string }) => {
    await sendMessageMutation({
      toId: data.toId,
      content: data.content,
    });
  };

  const inputs: FormInput[] = [
    {
      name: "content",
      type: "text",
      placeholder: "Enter your message",
      required: true,
      label: "Message",
    },
  ];

  return (
    <Box>
      <h3>Send a message to {username}</h3>
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
