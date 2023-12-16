import { Avatar, Flex, Stack, Text } from "@chakra-ui/react";

const ChannelMessage = ({
  message,
  currentUser,
  setParticipantUserId,
  toggleProfileDrawer,
}: {
  message: any;
  currentUser: any;
  setParticipantUserId: any;
  toggleProfileDrawer: any;
}) => {
  return (
    <Flex
      id="first_flex"
      key={message?.id}
      direction="row"
      w="full"
      //   h="full"
      gap={1}
      align="center"
      justify="start"
      borderRadius={6}
      p={1}
      // display={
      //   currentUser?.blocked?.includes(message?.sender?.id)
      //     ? "none"
      //     : "flex"
      // }
      filter={
        currentUser?.blocked?.includes(message?.sender?.id)
          ? "blur(6px)"
          : "none"
      }
    >
      {message?.sender?.id !== currentUser?.id && (
        <Avatar
          // size="sm"
          name={message?.sender?.name}
          src={message?.sender?.avatar}
          style={{ width: "36px", height: "36px" }}
          cursor="pointer"
          onClick={() => {
            setParticipantUserId(message?.sender?.id);
            toggleProfileDrawer();
          }}
        />
      )}
      <Stack
        w="full"
        justify="center"
        align={message?.sender?.id === currentUser?.id ? "end" : "start"}
      >
        <Text
          fontSize="12px"
          fontWeight="medium"
          color="whiteAlpha.900"
          bg={message?.sender?.id === currentUser?.id ? "gray.600" : "gray.700"}
          //   minW="300px"
          maxW={"300px"}
          p={2}
          px={2}
          mx={1}
          textAlign={message?.sender?.id === currentUser?.id ? "right" : "left"}
        >
          {message?.content}
        </Text>
      </Stack>
    </Flex>
  );
};

export default ChannelMessage;
