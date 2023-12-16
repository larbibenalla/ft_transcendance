import { Box, Flex, Stack, Text } from "@chakra-ui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbarChatBody.css";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import ChatRightModal from "../ChatRightModal";
import ChannelMessage from "./ChannelMessage";

interface ChannelContentBodyType {
  messages: any;
  toggleProfileDrawer: () => void;
  isProfileDrawerOpen: boolean;
  error?: any;
}

const ChannelContentBody = ({
  messages = [],
  toggleProfileDrawer,
  isProfileDrawerOpen,
  error = null,
}: ChannelContentBodyType) => {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const messagesRef = useRef<HTMLDivElement>(null);
  const [participantUserId, setParticipantUserId] = useState(0);

  const scrollToBottom = () => {
    messagesRef?.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (messagesRef.current) {
      scrollToBottom();
    }
    return () => {
      scrollToBottom();
    };
  }, [messages]);

  return (
    <Stack
      justify={"start"}
      w={"full"}
      // h={"full"}
      h={"800px"}
      borderRadius={6}
      p={2}
      spacing={4}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('assets/img/BlackNoise.webp')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      {error ? (
        <Flex
          justify="center"
          align="center"
          h="100%"
          w="100%"
          color="white"
          fontSize="xl"
          fontWeight="semibold"
        >
          <Text fontSize="xl" fontWeight="normal" color="white">
            This channel does not exist 🤷‍♂️
          </Text>
        </Flex>
      ) : (
        <ScrollArea.Root id="ScrollArea.Root" className="ScrollAreaRoot">
          <ScrollArea.Viewport
            id="ScrollArea.Viewport"
            className="ScrollAreaViewport"
          >
            {messages?.length > 0 ? (
              messages?.map((message) => (
                <ChannelMessage
                  message={message}
                  currentUser={currentUser}
                  setParticipantUserId={setParticipantUserId}
                  toggleProfileDrawer={toggleProfileDrawer}
                />
              ))
            ) : (
              <Flex
                justify="center"
                align="center"
                h="100%"
                w="100%"
                color="white"
                fontSize="xl"
                fontWeight="semibold"
              >
                <Text fontSize="xl" fontWeight="normal" color="white">
                  Start the conversation 🚀
                </Text>
              </Flex>
            )}
            <Box ref={messagesRef} />
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar
            className="ScrollAreaScrollbar"
            orientation="vertical"
          >
            <ScrollArea.Thumb className="ScrollAreaThumb" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Scrollbar
            className="ScrollAreaScrollbar"
            orientation="horizontal"
          >
            <ScrollArea.Thumb className="ScrollAreaThumb" />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner className="ScrollAreaCorner" />
        </ScrollArea.Root>
      )}
      {isProfileDrawerOpen && participantUserId !== currentUser?.id && (
        <ChatRightModal
          participantUserId={participantUserId}
          isOpen={isProfileDrawerOpen}
          toggleProfileDrawer={toggleProfileDrawer}
        />
      )}
    </Stack>
  );
};

export default ChannelContentBody;
