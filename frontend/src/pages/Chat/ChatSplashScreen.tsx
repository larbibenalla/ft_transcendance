import { Box, Flex, Image, Stack, Text } from "@chakra-ui/react";

const ChatSplashScreen = () => {
  return (
    <Flex
      pos="relative"
      alignSelf={"stretch"}
      justify="center"
      // align="center"
      p={0}
      borderRightRadius={6}
      flex={1}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('assets/img/BlackNoise.webp')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <Stack
        justify="center"
        align="center"
        w={"full"}
        h={"full"}
        borderRightRadius={20}
        spacing={6}
        p={{ base: 2, sm: 4, md: 8, lg: 12 }}
      >
        <Flex justify="center" align="center">
          <Image
            src="/assets/svg/messaging_girl.svg"
            alt="Messaging girl"
            borderRadius={20}
          />
        </Flex>
        <Stack spacing={2} align={"start"} justify={"center"}>
          <Box
            fontSize={{
              base: "24px",
              md: "28px",
              lg: "32px",
            }}
            fontWeight="semibold"
          >
            Choose
          </Box>
          <Box
            fontSize={{
              base: "24px",
              md: "28px",
              lg: "32px",
            }}
            fontWeight="semibold"
            color={"whiteAlpha.900"}
          >
            a{" "}
            <Text
              as="span"
              fontSize={{
                base: "24px",
                md: "28px",
                lg: "32px",
              }}
              fontWeight={"extrabold"}
              color={"pong_cl_primary"}
            >
              Channel
            </Text>{" "}
            or{" "}
            <Text
              as="span"
              fontSize={{
                base: "24px",
                md: "28px",
                lg: "32px",
              }}
              fontWeight={"extrabold"}
              color={"pong_cl_primary"}
            >
              DM
            </Text>{" "}
            to start
          </Box>
          <Box
            fontSize={{
              base: "24px",
              md: "28px",
              lg: "32px",
            }}
            fontWeight="semibold"
            color={"whiteAlpha.900"}
          >
            from the left panel
          </Box>
        </Stack>
      </Stack>
    </Flex>
  );
};

export default ChatSplashScreen;
