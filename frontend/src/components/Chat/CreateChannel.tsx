import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Stack,
  Textarea,
  Tooltip,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateChannelMutation } from "src/features/channels/channelsApi";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

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
        .min(5, "Minimum length should be 5")
        .max(20, "Maximum length should be 20")
        .trim();
    },
  }),
});

const CreateChannel = ({
  isOpenCreateChannel,
  onToggleCreateChannel,
}: {
  isOpenCreateChannel: boolean;
  onToggleCreateChannel: () => void;
}) => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const [isProtected, setIsProtected] = useState<boolean>(false);
  const [openTooltip, setOpenTooltip] = useState<string>("");
  const passRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
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
  const [createChannel, { isLoading: isLoadingCreatingChannel }] =
    useCreateChannelMutation();

  const onCreateChannel = async (data: any) => {
    try {
      await createChannel({
        id: uuidv4(),
        ...data,
        ownerId: currentUser?.id,
        banned: [],
        members: [
          {
            id: currentUser?.id,
            name: currentUser?.name,
            username: currentUser?.username,
            avatar: currentUser?.avatar,
            role: "owner",
          },
        ],
        createdAt: dayjs().valueOf(),
      }).unwrap();
      reset({
        name: "",
        description: "",
        privacy: "public",
        password: "",
      });
      if (isProtected) setIsProtected(false);
      onToggleCreateChannel();
      navigate(`/chat/channel/${data.name}`);
      toast({
        title: "Channel created.",
        description: "Channel has been created successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Channel not created.",
        description: error?.data?.message || "Channel has not been created.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    reset({
      name: "",
      description: "",
      privacy: "public",
      password: "",
    });
  };

  return (
    <Modal
      isOpen={isOpenCreateChannel}
      onClose={onToggleCreateChannel}
      closeOnEsc={false}
      closeOnOverlayClick={false}
    >
      <ModalOverlay />
      <ModalContent
        // bg="green"
        borderRadius={40}
        // maxH="350px"
        maxW="400px"
        mt={4}
        border="1px solid rgba(251, 102, 19, 0.3)"
        boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
        backdropFilter={"blur(20px)"}
        bgImage={`url('assets/img/BlackNoise.webp')`}
        bgSize="cover"
        bgRepeat="no-repeat"
        bg="transparent"
      >
        <ModalHeader>Create a New Channel</ModalHeader>
        <ModalCloseButton onClick={onToggleCreateChannel} />
        <ModalBody p={2} borderRadius={40}>
          <Stack
            mt={0}
            spacing={4}
            //  w={{ base: "full", sm: "full", md: 620 }}
            align="center"
            borderRadius={40}
            pl={3}
            pr={2}
          >
            <FormControl isInvalid={!!errors.name} mt={0} isRequired>
              <FormLabel htmlFor="name" fontSize="lg">
                Name
              </FormLabel>
              <Input
                id="name"
                type="text"
                placeholder="Channel name"
                autoComplete="off"
                {...register("name")}
              />
              {/* {errors?.name && (
                <FormErrorMessage>{errors?.name?.message}</FormErrorMessage>
              )} */}
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
                      field.onChange(inputValue);
                      setIsProtected(inputValue === "protected");
                    }}
                  >
                    <Stack direction="row">
                      <Tooltip
                        label="Anyone can join the channel"
                        aria-label="A tooltip"
                        placement="top"
                        closeOnClick={true}
                        hasArrow
                        bg={"#FB6613"}
                        closeDelay={300}
                        isOpen={openTooltip === "public"}
                        closeOnEsc={true}
                      >
                        <Radio
                          colorScheme={"orange"}
                          value="public"
                          onClick={() => setOpenTooltip("public")}
                        >
                          Public
                        </Radio>
                      </Tooltip>
                      <Tooltip
                        label="Only people invited by the channel owner or admins can join the channel"
                        aria-label="A tooltip"
                        placement="top"
                        closeOnClick
                        hasArrow
                        bg={"#FB6613"}
                        closeDelay={300}
                        isOpen={openTooltip === "private"}
                        closeOnPointerDown={true}
                      >
                        <Radio
                          colorScheme={"orange"}
                          value="private"
                          onClick={() => setOpenTooltip("private")}
                        >
                          Private
                        </Radio>
                      </Tooltip>
                      <Tooltip
                        label="Only people with the channel password can join the channel"
                        aria-label="A tooltip"
                        placement="top"
                        closeOnClick
                        hasArrow
                        bg={"#FB6613"}
                        closeDelay={300}
                        isOpen={openTooltip === "protected"}
                      >
                        <Radio
                          colorScheme={"orange"}
                          value="protected"
                          onClick={() => setOpenTooltip("protected")}
                        >
                          Protected
                        </Radio>
                      </Tooltip>
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
                autoComplete="off"
                {...register("password")}
              />
              <FormErrorMessage>
                {errors.password && errors.password.message}
              </FormErrorMessage>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter p={3} onClick={() => setOpenTooltip("")}>
          <Button
            bg={"white"}
            color={"orange.500"}
            letterSpacing={1}
            mr={3}
            onClick={onToggleCreateChannel}
          >
            Close
          </Button>
          <Button
            bg={"orange.500"}
            color={"white"}
            mr={3}
            letterSpacing={1}
            isLoading={isLoadingCreatingChannel}
            // isLoading={isFetching}
            isDisabled={isLoadingCreatingChannel}
            cursor="pointer"
            onClick={handleSubmit(onCreateChannel)}
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
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateChannel;
