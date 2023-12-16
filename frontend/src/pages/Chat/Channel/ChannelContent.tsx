import { Flex, Stack, Text, useDisclosure, useToast } from "@chakra-ui/react";
import ChatContentFooter from "../ChatContentFooter";
import ChatContentHeader from "../ChatContentHeader";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "src/components/Utils/Loader";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useGetSingleChannelByNameQuery } from "src/features/channels/channelsApi";
import {
  useGetMessagesByChannelNameQuery,
  useCreateChannelMessageMutation,
} from "src/features/channelMessages/channelMessagesApi";
import ChannelContentBody from "./ChannelContentBody";
import { useEffect } from "react";

dayjs.extend(relativeTime);

const ChannelContent = () => {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const navigate = useNavigate();
  const { isOpen: isProfileDrawerOpen, onToggle: toggleProfileDrawer } =
    useDisclosure();
  const toast = useToast();
  let { channelname } = useParams();

  const {
    data: channels,
    isLoading: isLoadingChannels,
    isFetching: isFetchingChannels,
    isUninitialized: isUninitializedChannels,
    isError: isErrorGettingChannels,
  } = useGetSingleChannelByNameQuery(channelname, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: messages,
    isLoading: isLoadingMessages,
    isFetching: isFetchingMessages,
    isError: isErrorGettingMessages,
  } = useGetMessagesByChannelNameQuery(channelname);

  const [createChannelMessage, { isLoading: isCreatingChannelMsg }] =
    useCreateChannelMessageMutation();

  useEffect(() => {
    if (isUninitializedChannels) return;
    if (channels?.length > 0) {
      const channel = channels[0];
      if (!channel.members.map((m) => m.id).includes(currentUser?.id)) {
        navigate("/chat", { replace: true });
      }
    }
  }, [channels]);

  if (isErrorGettingChannels || isErrorGettingMessages) {
    toast({
      title: "An error occurred.",
      description: "Unable to get channels or messages.",
      status: "error",
      duration: 4000,
      isClosable: true,
    });
  }

  const onSendMessage = async (data: any) => {
    const { message } = data;
    if (channels?.length === 0 || !message) return;
    const channel = channels[0];
    const msg = {
      id: uuidv4(),
      channelId: channel.id,
      channelName: channel?.name,
      sender: {
        id: currentUser?.id,
        name: currentUser?.name,
        avatar: currentUser?.avatar,
      },
      senderId: currentUser?.id,
      content: message,
      lastMessageCreatedAt: dayjs().valueOf(),
    };

    try {
      await createChannelMessage(msg).unwrap();
    } catch (error: any) {
      // console.log("error ", error);
      toast({
        title: "Message not sent.",
        description: error?.data?.message || "Message not sent to the channel.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      if (
        error?.data?.message === "Member not found in channel." ||
        error?.data?.message === "Channel not found."
      ) {
        navigate("/chat", { replace: true });
      }
    }
  };

  return (
    <Flex
      // bg={"pong_bg_secondary"}
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
      //   gap={6}
    >
      <Stack
        // bg={"gray"}
        justify="start"
        align="center"
        w={"full"}
        // h={"1000px"}
        h={"full"}
        borderRightRadius={26}
        spacing={1}
        pl={{ base: 1 }}
      >
        {isLoadingMessages ||
        isLoadingChannels ||
        isFetchingChannels ||
        isFetchingMessages ? (
          <Flex
            justify="center"
            align="center"
            h="100%"
            w="100%"
            color="white"
            fontSize="xl"
            fontWeight="semibold"
          >
            <Loader />
          </Flex>
        ) : channels?.length > 0 ? (
          channels[0]?.members.map((m) => m.id).includes(currentUser?.id) ? (
            <>
              <ChatContentHeader
                toggleProfileDrawer={toggleProfileDrawer}
                type={"Channel"}
                channel={channels[0]}
              />
              <ChannelContentBody
                messages={messages}
                toggleProfileDrawer={toggleProfileDrawer}
                isProfileDrawerOpen={isProfileDrawerOpen}
              />
              <ChatContentFooter
                onSendMessage={onSendMessage}
                isLoading={isCreatingChannelMsg}
              />
            </>
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
                You are not a member of this channel
              </Text>
            </Flex>
          )
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
              Channel not found
            </Text>
          </Flex>
        )}
      </Stack>
    </Flex>
  );
};

export default ChannelContent;
