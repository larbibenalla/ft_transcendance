import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  PinInput,
  PinInputField,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Controller, useForm } from "react-hook-form";
import QRCode from "qrcode";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useEffect, useState } from "react";
import {
  useGenerateOTPMutation,
  useVerifyOTPMutation,
} from "src/features/users/usersApi";
import { useSelector } from "react-redux";
import Loader from "../Utils/Loader";

const pinSchema = yup.object().shape({
  pin: yup
    .string()
    .required("Verification code is required")
    .min(6, "Minimum and Maximum length should be 6")
    .trim(),
});

const TwoFactorActivation = ({ isOpen, onToggle }) => {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const toast = useToast();
  const {
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(pinSchema),
  });
  const [generateOTP, { isLoading: isGeneratingOTP }] =
    useGenerateOTPMutation();

  useEffect(() => {
    generateOTP(currentUser?.id)
      .unwrap()
      .then((data: any) => {
        QRCode.toDataURL(data?.otpAuthUrl)
          .then(setQrCodeUrl)
          .catch((err: any) => {
            console.error("err: ", err);
            toast({
              title: "Error",
              description: "Something went wrong while generating QR code.",
              status: "error",
              duration: 2000,
              isClosable: true,
            });
          });
      });
  }, [isOpen, onToggle]);

  const [verifyOTP, { isLoading: isVerifyingOTP }] = useVerifyOTPMutation();

  const onVerifyAndActivate2FA = async (data: any) => {
    try {
      await verifyOTP({
        userId: currentUser?.id,
        userPin: data?.pin,
      }).unwrap();

      toast({
        title: "2FA activated.",
        description: "You can now login with 2FA.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      reset({
        pin: "",
      });
      onToggle();
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
      isOpen={isOpen}
      onClose={onToggle}
      closeOnEsc={false}
      closeOnOverlayClick={false}
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
          <Stack
            mt={0}
            spacing={4}
            align="center"
            borderRadius={40}
            pl={3}
            pr={2}
          >
            <Flex justify="center" align="center" w="full">
              <Image
                src="/assets/svg/2fa_activation.svg"
                alt="Two Factor Authentication Activation"
                borderRadius={20}
                w="320px"
                h="300px"
              />
            </Flex>

            <Stack spacing={3} align={"center"}>
              <Heading fontSize="lg" fontWeight="semibold">
                Two Factor Authentication Activation
              </Heading>
              <Text fontSize="sm" fontWeight="medium" color={"whiteAlpha.700"}>
                Scan QR Code using Google App to verify this device qwqw qwqw
              </Text>
            </Stack>
            <Flex justify="center" align="center" w="full">
              {isGeneratingOTP ? (
                <Loader />
              ) : (
                <Image
                  src={qrCodeUrl}
                  alt="qr code"
                  w="240px"
                  h="240px"
                  border="1px solid"
                  borderColor="pong_cl_primary"
                  borderRadius={20}
                  objectFit={"contain"}
                />
              )}
            </Flex>
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
          </Stack>
        </ModalBody>

        <ModalFooter p={3}>
          <Button
            bg={"white"}
            color={"orange.500"}
            letterSpacing={1}
            mr={3}
            onClick={onToggle}
          >
            Close
          </Button>
          <Button
            bg={"orange.500"}
            color={"white"}
            mr={3}
            letterSpacing={1}
            _hover={{ bg: "orange.400" }}
            _active={{ bg: "orange.400" }}
            _focus={{ bg: "orange.400", boxShadow: "none" }}
            isLoading={isGeneratingOTP || isVerifyingOTP}
            isDisabled={isGeneratingOTP || isVerifyingOTP}
            cursor="pointer"
            onClick={handleSubmit(onVerifyAndActivate2FA)}
          >
            Verify & Activate
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default TwoFactorActivation;
