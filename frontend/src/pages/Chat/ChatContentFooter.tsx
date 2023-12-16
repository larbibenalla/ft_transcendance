import { Box, Icon, IconButton, Input, InputGroup } from "@chakra-ui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdSend } from "react-icons/md";

const ChatContentFooter = ({ onSendMessage, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm({});

  useEffect(() => {
    const message = document.getElementById("message");
    message?.focus();
  }, []);
  return (
    <Box
      // bg={"gray.400"}
      w={"full"}
      borderRadius={6}
      mb={1}
      px={2}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('assets/img/BlackNoise.webp')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <InputGroup
        w={"full"}
        gap={2}
        justifyContent="space-between"
        alignItems="center"
      >
        <Input
          id="message"
          type="text"
          variant="filled"
          bg="pong_bg_secondary"
          w={"full"}
          placeholder="Type a message"
          autoFocus
          {...register("message", {
            required: "This is required",
          })}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(onSendMessage)();
              reset({
                message: "",
              });
            }
          }}
          borderColor={"pong_cl_primary"}
          _hover={{
            borderColor: "pong_cl_primary",
          }}
        />
        <IconButton
          aria-label="Send message"
          color={"white"}
          bg={"pong_cl_primary"}
          size={"md"}
          isRound
          isLoading={isLoading}
          isDisabled={isSubmitting}
          onClick={() => {
            handleSubmit(onSendMessage)();
            reset({
              message: "",
            });
          }}
          icon={<Icon as={MdSend} />}
          _hover={{
            bg: "white",
            color: "pong_cl_primary",
          }}
        />
      </InputGroup>
    </Box>
  );
};

export default ChatContentFooter;
