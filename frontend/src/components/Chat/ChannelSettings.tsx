import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useEditChannelInfoMutation } from "src/features/channels/channelsApi";

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Name is required")
    .min(3, "Minimum length should be 3")
    .max(20, "Maximum length should be 20")
    .trim(),
  description: yup
    .string()
    .required("Description is required")
    .min(10, "Minimum length should be 10")
    .max(100, "Maximum length should be 100")
    .trim(),
  privacy: yup.string().required("Privacy is required"),
  password: yup.string().when("privacy", {
    is: "protected",
    then(schema) {
      return schema
        .required("Password is required")
        .min(6, "Minimum length should be 6")
        .max(20, "Maximum length should be 20")
        .trim();
    },
  }),
});

const ChannelSettings = ({ channel, onToggleChannelInfo }) => {
  const [isProtected, setIsProtected] = useState(false);
  const passRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [editChannelInfo, { isLoading: isEditingChannelInfo }] =
    useEditChannelInfoMutation();

  const onEditChannel = async (data: any) => {
    try {
      await editChannelInfo({
        id: channel.id,
        channelName: channel.name,
        data: {
          ...data,
        },
      }).unwrap();
      toast({
        title: "Success",
        description: "Channel info edited successfully.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Error happened while editing channel info.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
    reset({
      name: "",
      description: "",
      password: "",
      privacy: "public",
    });
    if (isProtected) setIsProtected(false);
    onToggleChannelInfo();
  };

  return (
    <Stack
      mt={0}
      spacing={4}
      //  w={{ base: "full", sm: "full", md: 620 }}
      align="center"
      justify="center"
      borderRadius={40}
      p={2}
    >
      <FormControl isInvalid={!!errors.name} mt={0} isRequired>
        <FormLabel htmlFor="name" fontSize="lg">
          Name
        </FormLabel>
        <Input
          id="name"
          type="text"
          placeholder="Channel name"
          {...register("name")}
        />
        <FormErrorMessage>
          {errors.name && errors.name.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.name} mt={0} isRequired>
        <FormLabel htmlFor="description" fontSize="lg">
          Description
        </FormLabel>
        <Textarea
          placeholder="Brief description of the channel's purpose or topic"
          {...register("description")}
          resize={"none"}
          size={"md"}
        />
        <FormErrorMessage>
          {errors.description && errors.description.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl isInvalid={!!errors.privacy} mt={0} isRequired>
        <FormLabel htmlFor="privacy" fontSize="lg">
          Privacy Settings
        </FormLabel>
        <Controller
          name="privacy"
          control={control}
          defaultValue="public"
          render={({ field }) => (
            <RadioGroup
              {...field}
              onChange={(inputValue) => {
                //   // console.log("e: ", inputValue);
                //   // console.log("field: ", field);
                field.onChange(inputValue);
                setIsProtected(inputValue === "protected");
              }}
            >
              <Stack direction="row">
                <Radio colorScheme={"orange"} value="public">
                  Public
                </Radio>
                <Radio colorScheme={"orange"} value="private">
                  Private
                </Radio>
                <Radio colorScheme={"orange"} value="protected">
                  Protected
                </Radio>
              </Stack>
            </RadioGroup>
          )}
        />
        <FormErrorMessage>
          {errors.privacy && errors.privacy.message}
        </FormErrorMessage>
      </FormControl>
      <FormControl
        isInvalid={!!errors.password}
        mt={0}
        display={isProtected ? "block" : "none"}
        ref={passRef}
        isRequired
      >
        <FormLabel htmlFor="password" fontSize="lg">
          Password
        </FormLabel>
        <Input
          type="password"
          placeholder="Channel password"
          {...register("password")}
        />
        <FormErrorMessage>
          {errors.password && errors.password.message}
        </FormErrorMessage>
      </FormControl>
      <Button
        bg={"orange.500"}
        color={"white"}
        mt={3}
        w={"full"}
        letterSpacing={1}
        isLoading={isEditingChannelInfo}
        isDisabled={isEditingChannelInfo}
        cursor="pointer"
        onClick={handleSubmit(onEditChannel)}
        _hover={{
          bg: "orange.400",
        }}
        _active={{
          bg: "orange.400",
        }}
        _focus={{
          bg: "orange.400",
          boxShadow: "none",
        }}
      >
        Save
      </Button>
    </Stack>
  );
};

export default ChannelSettings;
