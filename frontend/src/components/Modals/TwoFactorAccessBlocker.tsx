import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  PinInput,
  PinInputField,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useToast } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useValidateOTPMutation } from "src/features/users/usersApi";
import store from "src/app/store";
import authApi from "src/features/auth/authApi";
import { Player } from "@lottiefiles/react-lottie-player";

const pinSchema = yup.object().shape({
  pin: yup
    .string()
    .required("Verification code is required")
    .min(6, "Minimum and Maximum length should be 6")
    .trim(),
});

const TwoFactorAccessBlocker = ({
  isOTPAccessBlockerOpen,
  onOTPAccessBlockerToggle,
}) => {
  const userId = useSelector((state: any) => state?.auth?.userId);
  const navigate = useNavigate();
  const toast = useToast();
  const {
    // register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(pinSchema),
  });

  const [validateOTP, { isLoading: isValidatingOTP }] =
    useValidateOTPMutation();

  const onOTPValidation = async (data: any) => {
    // // console.log("PIN: ", data);
    try {
      await validateOTP({
        userId: userId,
        userPin: data?.pin,
      }).unwrap();
      toast({
        title: "2FA Validation",
        description: "Access granted.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      reset({
        pin: "",
      });
      onOTPAccessBlockerToggle();
    } catch (error: any) {
      // console.log("error: ", error);
      toast({
        title: "Error",
        description: "Verification code is incorrect.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };
  return (
    <Modal
      isOpen={isOTPAccessBlockerOpen}
      onClose={onOTPAccessBlockerToggle}
      closeOnEsc={false}
      closeOnOverlayClick={false}
      isCentered={true}
    >
      <ModalOverlay />{" "}
      <ModalContent
        borderRadius={40}
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
        <ModalBody p={2} borderRadius={40}>
          <VStack
            mt={0}
            spacing={4}
            align="center"
            borderRadius={40}
            pl={3}
            pr={2}
          >
            <Flex justifyContent="center" alignItems="center">
              <Box display="block" p={6}>
                <Player
                  autoplay
                  loop
                  src="src/assets/lottie/animation_fingerprint.json"
                  style={{ height: "200px", width: "200px", color: "orange" }}
                />
              </Box>
            </Flex>

            <Stack spacing={3} w={"full"} align={"center"}>
              <Heading fontSize="lg" fontWeight="semibold">
                Authenticate Your Account
              </Heading>
              <Text fontSize="sm" fontWeight="medium" color={"whiteAlpha.700"}>
                Enter the access code generated by Google App
              </Text>
            </Stack>
            <Box w={"full"}>
              <FormControl isInvalid={!!errors.pin} mt={0} isRequired>
                <Flex
                  direction={"column"}
                  justify="center"
                  align="start"
                  w="full"
                >
                  <FormLabel
                    htmlFor="pin"
                    fontSize="md"
                    color={"whiteAlpha.700"}
                  >
                    Verification Code
                  </FormLabel>
                  <Controller
                    name="pin"
                    control={control}
                    defaultValue=""
                    render={({ field: { ref, ...restField } }) => (
                      <Flex justify="center" align="center" flex={1} w={"full"}>
                        <PinInput
                          size="lg"
                          {...restField}
                          errorBorderColor="red.300"
                          focusBorderColor="orange.300"
                          isInvalid={!!errors.pin}
                        >
                          <PinInputField ref={ref} />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                          <PinInputField />
                        </PinInput>
                      </Flex>
                    )}
                  />
                  {errors?.pin && (
                    <FormErrorMessage>{errors?.pin?.message}</FormErrorMessage>
                  )}
                </Flex>
              </FormControl>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter p={3}>
          <Button
            bg={"white"}
            color={"orange.500"}
            letterSpacing={1}
            mr={3}
            onClick={async () => {
              await store.dispatch(authApi.endpoints.sendLogOut.initiate({}));
              onOTPAccessBlockerToggle();
              navigate("/login", { replace: true });
            }}
            _hover={{
              bg: "WhiteAlpha.800",
            }}
            _active={{
              bg: "whiteAlpha.800",
            }}
            _focus={{
              bg: "whiteAlpha.800",
              boxShadow: "none",
            }}
          >
            Close
          </Button>
          <Button
            bg={"orange.500"}
            color={"white"}
            mr={3}
            letterSpacing={1}
            isLoading={isValidatingOTP}
            isDisabled={isValidatingOTP}
            cursor="pointer"
            onClick={handleSubmit(onOTPValidation)}
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
            Let me in
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TwoFactorAccessBlocker;
