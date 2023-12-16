import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useToast } from "@chakra-ui/react";
import { useRef } from "react";
import { Icon, InputGroup } from "@chakra-ui/react";
import { FiFile } from "react-icons/fi";
import usersApi from "src/features/users/usersApi";
import { useSelector } from "react-redux";

interface ProfileDetailsFormModalProps {
  isOpen: boolean;
  onToggle: () => void;
}

const ProfileDetailsFormModal = ({
  isOpen,
  onToggle,
}: ProfileDetailsFormModalProps) => {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      username: "",
      avatar: undefined,
    },
  });
  const [checkProfileCompleted] = usersApi.useCheckProfileCompletedMutation();

  const [updateUserSettings, { isLoading: isUpdatingUserSettings }] =
    usersApi.useUpdateUserSettingsMutation();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const { ref, ...rest } = register("avatar", {
    validate: (value: any) => {
      if (value?.length > 0) {
        if (value[0]?.size > 3000000) {
          return "Max file size is 3mb!";
        }
        if (
          value[0]?.type !== "image/jpg" &&
          value[0]?.type !== "image/jpeg" &&
          value[0]?.type !== "image/png" &&
          value[0]?.type !== "image/webp"
        ) {
          return "Only jpg, jpeg, png, webp are accepted";
        }
      }
      return true;
    },
  });

  const onUpdateProfileDetails = async (data: any) => {
    if (
      (data.avatar.length === 0 && data.username === "") ||
      data.username === currentUser?.username
    ) {
      toast({
        title: "Nothing to update.",
        description: "Please update at least one field.",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const formData = new FormData();
    formData.append("username", data.username);
    formData.append("avatar", data.avatar[0]);
    try {
      await updateUserSettings({
        id: currentUser?.id,
        formData,
      }).unwrap();
      await checkProfileCompleted(currentUser?.id).unwrap();
      onToggle();
      toast({
        title: "Profile updated.",
        description: "Profile updated successfully.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      reset({
        username: "",
        avatar: undefined,
      });
    } catch (error: any) {
      // console.log("error: ", error);
      toast({
        title: "Error.",
        description: error?.data?.message || "Something went wrong.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onToggle}>
      <ModalOverlay onClick={onToggle} />
      <ModalContent
        border="1px solid rgba(251, 102, 19, 0.3)"
        boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
        backdropFilter={"blur(20px)"}
        bgImage={`url('assets/img/BlackNoise.webp')`}
        bgSize="cover"
        bgRepeat="no-repeat"
        bg="transparent"
        minW={{ base: "350px", sm: "450px", md: "700px" }}
      >
        <ModalHeader>Complete your profile</ModalHeader>
        <ModalCloseButton
          color="pong_cl_primary"
          bg={"white"}
          onClick={async () => {
            await checkProfileCompleted(currentUser?.id).unwrap();
            onToggle();
          }}
        />
        <ModalBody borderRadius={40}>
          <Stack
            direction={{ base: "column-reverse", md: "row" }}
            align={{ base: "center", md: "flex-start" }}
            justify="center"
            mt={4}
            spacing={{ base: 4, md: 8 }}
          >
            <form
              onSubmit={handleSubmit(onUpdateProfileDetails)}
              encType="multipart/form-data"
            >
              <Stack
                mt={{ base: 0, md: 4 }}
                spacing={8}
                w={{ base: "full", md: "350px" }}
                align="center"
                justify="center"
              >
                <Stack
                  spacing={4}
                  w="full"
                  h="full"
                  align="start"
                  justify="start"
                >
                  <FormControl isInvalid={!!errors.username} mt={6}>
                    <FormLabel htmlFor="username" fontSize="lg">
                      Username
                    </FormLabel>
                    <Input
                      id="username"
                      type="text"
                      placeholder="username"
                      {...register("username", {
                        validate: (value) => {
                          if (value) {
                            if (value.length < 3) {
                              return "Minimum length should be 3";
                            }
                            if (value.length > 20) {
                              return "Maximum length should be 20";
                            }
                            if (value.includes(" ")) {
                              return "Username should not contain spaces";
                            }
                          }
                          return true;
                        },
                      })}
                    />
                    <FormErrorMessage>
                      {errors.username && errors.username.message}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={!!errors.avatar}>
                    <FormLabel htmlFor="avatar" fontSize="lg">
                      Avatar
                    </FormLabel>
                    <InputGroup onClick={() => inputRef.current?.click()}>
                      <Input
                        id="avatar"
                        type="file"
                        hidden
                        accept="image/*"
                        {...rest}
                        ref={(e) => {
                          ref(e);
                          inputRef.current = e;
                        }}
                      />
                      <Button leftIcon={<Icon as={FiFile} />}>Upload</Button>
                    </InputGroup>

                    <FormErrorMessage>
                      {errors.avatar && errors?.avatar.message}
                    </FormErrorMessage>
                  </FormControl>
                </Stack>
                <Button
                  w="full"
                  letterSpacing={2}
                  colorScheme="orange"
                  mr={3}
                  isLoading={isUpdatingUserSettings}
                  isDisabled={isUpdatingUserSettings}
                  cursor="pointer"
                  type="submit"
                >
                  Save
                </Button>
              </Stack>
            </form>
            <Box>
              <Image
                boxSize={{ base: "300px", md: "350px" }}
                src="/assets/svg/complete_profile.svg"
                alt="profile illustration"
                borderRadius={20}
              />
            </Box>
          </Stack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ProfileDetailsFormModal;
