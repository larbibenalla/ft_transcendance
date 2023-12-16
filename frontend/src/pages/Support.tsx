import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import useWeb3forms from "use-web3forms";
import { useToast } from "@chakra-ui/react";
import useTitle from "src/hooks/useTitle";

interface FormData {
  name: string;
  email: string;
  msg: string;
}

function Support() {
  useTitle("Support");
  const toast = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const { submit } = useWeb3forms({
    apikey: import.meta.env.VITE_WEB3FORMS_API_KEY,
    onSuccess(successMessage) {
      toast({
        title: "Message sent.",
        description: successMessage,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    },
    onError: () => {
      toast({
        title: "Message not sent.",
        description: "Error happened during sending message.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  const onSubmit = async (data: any) => {
    try {
      await submit(data);
      reset({
        email: "",
        msg: "",
      });
    } catch (error) {
      // console.log("error: ", error);
    }
  };

  return (
    <Flex
      pos="relative"
      w={"full"}
      h={"full"}
      direction="row"
      justify="center"
      align="center"
      p={2}
      borderRadius={26}
    >
      <VStack mt={8} spacing={8} w={{ base: "full", sm: "380px", md: 520 }}>
        <VStack>
          <Text
            fontSize="3xl"
            style={{
              color: "white",
              fontWeight: "bold",
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            get in touch
          </Text>
          <Text mt={4} fontSize="lg" color="whiteAlpha.900">
            Having an problem or just want to say Hi ? Send us a message
          </Text>
        </VStack>

        <Box w={"full"}>
          <FormControl isInvalid={!!errors.email} mt={6}>
            <FormLabel htmlFor="email" fontSize="lg">
              Email
            </FormLabel>
            <Input
              type="email"
              id="email"
              placeholder="your@email.com"
              {...register("email", {
                required: "This is required",
                pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,}$/i,
              })}
            />
            <FormErrorMessage>
              {errors.email && typeof errors.email === "string" && null}
            </FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.msg} mt={6}>
            <FormLabel htmlFor="msg" fontSize="lg">
              Message
            </FormLabel>
            <Textarea
              id="msg"
              rows={5}
              placeholder="What you would like to say"
              w="full"
              {...register("msg", {
                required: "This field is required",
              })}
            />
            <FormErrorMessage>
              {errors.msg && typeof errors.msg === "string" ? errors.msg : null}
            </FormErrorMessage>
          </FormControl>

          <Flex
            mt={8}
            justify="center"
            w="full"
            h="full"
            cursor="pointer"
            overflow="hidden"
          >
            <Button
              maxW="md"
              colorScheme="orange"
              size="lg"
              letterSpacing={1}
              onClick={handleSubmit(onSubmit)}
            >
              Send Message
            </Button>
          </Flex>
        </Box>
      </VStack>
    </Flex>
  );
}

export default Support;
