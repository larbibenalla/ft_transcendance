import {
  Flex,
  InputGroup,
  InputRightElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteGroup,
  AutoCompleteGroupTitle,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useNavigate } from "react-router-dom";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { BeatLoader } from "react-spinners";
import { BiSearchAlt } from "react-icons/bi";
import { useGetChannelsByMemberIdQuery } from "src/features/channels/channelsApi";
import { useGetConversationsQuery } from "src/features/conversations/conversationsApi";
import { useSelector } from "react-redux";

const SearchDMsChannels = () => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const navigate = useNavigate();
  const toast = useToast();

  const {
    data: channels = [],
    isLoading: isLoadingChannels,
    isFetching: isFetchingChannels,
    error: errorChannels,
  } = useGetChannelsByMemberIdQuery(currentUser?.id, {
    refetchOnMountOrArgChange: true,
  });

  const {
    data: conversations = [],
    isLoading: isLoadingConversations,
    isFetching: isFetchingConversations,
    error: errorConversations,
  } = useGetConversationsQuery(currentUser?.email, {
    refetchOnMountOrArgChange: true,
  });

  if (errorChannels) {
    toast({
      title: "An error occurred.",
      description: "Unable to fetch channels.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }
  if (errorConversations) {
    toast({
      title: "An error occurred.",
      description: "Unable to fetch conversations.",
      status: "error",
      duration: 5000,
      isClosable: true,
    });
  }

  return (
    <Flex direction="row" align="center" justify="center">
      {isLoadingChannels ||
      isLoadingConversations ||
      isFetchingChannels ||
      isFetchingConversations ? (
        <BeatLoader size={8} color="#FF8707" />
      ) : (
        <AutoComplete
          isLoading={isLoadingConversations || isLoadingChannels}
          openOnFocus
          listAllValuesOnFocus
          closeOnSelect={true}
        >
          <InputGroup mr={4}>
            <AutoCompleteInput
              mr={2}
              flex={1}
              variant="filled"
              bg="pong_bg.400"
              type="text"
              color="white"
              placeholder="Search DMs, Channels"
              _placeholder={{
                fontSize: 12,
                letterSpacing: 0.5,
                fontWeight: "light",
                opacity: 0.7,
                color: "gray.400",
              }}
              loadingIcon={<BeatLoader size={8} color="#FF8707" />}
            />
            <InputRightElement
              pointerEvents="none"
              children={<BiSearchAlt />}
              bg="pong_cl_primary"
              color="white"
              px={2}
              py={1}
              border="1px solid var(--white, #FFF)"
              borderRadius="10px"
              cursor="pointer"
            />
          </InputGroup>

          <AutoCompleteList
            loadingState={<BeatLoader color="#FF8707" />}
            style={{
              borderRadius: "24px",
              border: "1px solid rgba(251, 102, 19, 0.39)",
              boxShadow: "0px 4px 24px -1px rgba(0, 0, 0, 0.25)",
              backdropFilter: "blur(20px)",
              backgroundImage: "url('assets/img/BlackNoise.webp')",
              bgSize: "cover",
              bgRepeat: "no-repeat",
              backgroundColor: "#FF7F00",
            }}
            closeOnSelect={false}
            p={1}
            mr={2}
            w="full"
          >
            <ScrollArea.Root className="ScrollAreaRoot">
              <ScrollArea.Viewport className="ScrollAreaViewport">
                {Object.entries({ channels, conversations })?.map(
                  ([c, v], i) => (
                    <AutoCompleteGroup key={i} showDivider>
                      <AutoCompleteGroupTitle
                        textTransform="capitalize"
                        color="white"
                        fontSize="15px"
                        fontWeight="semibold"
                      >
                        {c === "channels" ? "Channels" : "Direct Messages"}
                      </AutoCompleteGroupTitle>
                      {v?.map((data, i) => (
                        <AutoCompleteItem
                          key={i}
                          value={
                            c === "channels"
                              ? data?.name
                              : data?.name.filter(
                                  (name) => name != currentUser?.name
                                )[0]
                          }
                          textTransform="capitalize"
                          bg="transparent"
                          borderRadius={5}
                          my={1}
                          _hover={{
                            bg: "pong_bg.500",
                          }}
                          _focus={{
                            backgroundColor: "transparent",
                          }}
                          _selected={{
                            backgroundColor: "transparent",
                          }}
                        >
                          <Flex
                            direction="row"
                            justify="space-between"
                            align="center"
                            w="full"
                            key={data?.id}
                          >
                            <Flex
                              direction="row"
                              gap="3px"
                              align="center"
                              w={"full"}
                              onClick={() => {
                                c === "channels"
                                  ? navigate(`/chat/channel/${data.name}`)
                                  : navigate(`/chat/conversation/${data.id}`);
                              }}
                            >
                              <Text
                                color="whiteAlpha.800"
                                fontSize="14px"
                                fontWeight="medium"
                                ml={2}
                                flex={1}
                              >
                                {c === "channels"
                                  ? data?.name
                                  : data?.name.filter(
                                      (name) => name != currentUser?.name
                                    )[0]}
                              </Text>
                            </Flex>
                          </Flex>
                        </AutoCompleteItem>
                      ))}
                    </AutoCompleteGroup>
                  )
                )}
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
          </AutoCompleteList>
        </AutoComplete>
      )}
    </Flex>
  );
};

export default SearchDMsChannels;
