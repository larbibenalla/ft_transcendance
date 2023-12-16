import { SearchIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useToast,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Input,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useState } from "react";
import { MdGroupAdd } from "react-icons/md";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import channelsApi, {
  useGetAllChannelsExceptPrivateOnesQuery,
} from "src/features/channels/channelsApi";
import { useSelector } from "react-redux";

interface SearchForChannelType {
  isOpenSearchChannel: boolean;
  onToggleSearchChannel: () => void;
}

const SearchForChannel = ({
  isOpenSearchChannel,
  onToggleSearchChannel,
}: SearchForChannelType) => {
  const [password, setPassword] = useState("");
  const [showPasswordInput, setShowPasswordInput] = useState("");
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const toast = useToast();
  const { data: channels, isLoading } = useGetAllChannelsExceptPrivateOnesQuery(
    {
      refetchOnMountOrArgChange: true,
    }
  );

  const [joinChannel, { isLoading: isJoininChannel }] =
    channelsApi.useJoinChannelMutation();

  const clearStates = () => {
    setPassword("");
    setShowPasswordInput("");
  };
  const handleJoinChannel = async (channel) => {
    try {
      await joinChannel({
        channelId: channel?.id,
        data: {
          userId: currentUser?.id,
          password: password,
        },
      }).unwrap();

      clearStates();
      onToggleSearchChannel();
      toast({
        title: "joined channel.",
        description: "You've joined the channel.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      // console.log("error ", error);
      toast({
        title: "Unable to join channel.",
        description: error?.data?.message || "Unable to join channel.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpenSearchChannel}
        onClose={onToggleSearchChannel}
        closeOnEsc={true}
        closeOnOverlayClick={true}
      >
        <ModalOverlay />
        <ModalContent
          borderRadius={40}
          // maxH="350px"
          // maxW={{ base: "full", sm: "350px", md: 450 }}
          maxW={{ base: "350px", lg: "450px" }}
          mt={4}
          border="1px solid rgba(251, 102, 19, 0.3)"
          boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
          backdropFilter={"blur(20px)"}
          bgImage={`url('assets/img/BlackNoise.webp')`}
          bgSize="cover"
          bgRepeat="no-repeat"
          bg="transparent"
          //   w={{ base: "full", sm: "full", md: 820 }}
        >
          <ModalHeader>Search for a channel</ModalHeader>
          <ModalCloseButton onClick={onToggleSearchChannel} />
          <ModalBody p={2} borderRadius={40}>
            <Stack direction={"column"} p={4}>
              <Stack
                pos="relative"
                direction="column"
                align="start"
                justify="start"
                gap={1.5}
                h={"420px"}
              >
                <AutoComplete
                  as={Stack}
                  rollNavigation
                  isLoading={isLoading}
                  openOnFocus
                  defaultIsOpen={true}
                  listAllValuesOnFocus
                  closeOnSelect={false}
                  flip={false}
                >
                  <InputGroup id="inputGroup" mr={4}>
                    <InputLeftElement
                      pointerEvents="none"
                      children={<SearchIcon />}
                      bg="pong_cl_primary"
                      color="white"
                      px={2}
                      py={1}
                      border="1px solid var(--white, #FFF)"
                      borderRadius="md"
                      cursor="pointer"
                    />
                    <AutoCompleteInput
                      ml={2}
                      flex={1}
                      variant="filled"
                      bg="pong_bg.400"
                      type="text"
                      color="white"
                      placeholder="username or email address"
                      _placeholder={{
                        fontSize: 14,
                        letterSpacing: 0.5,
                        fontWeight: "light",
                        opacity: 0.7,
                        color: "gray.500",
                      }}
                    />
                  </InputGroup>
                  <AutoCompleteList
                    style={{
                      borderRadius: "24px",
                      border: "1px solid rgba(251, 102, 19, 0.39)",
                      boxShadow: "0px 4px 24px -1px rgba(0, 0, 0, 0.25)",
                      backdropFilter: "blur(20px)",
                      backgroundImage: "url('assets/img/BlackNoise.webp')",
                      bgSize: "cover",
                      bgRepeat: "no-repeat",
                      backgroundColor: "transparent",
                      position: "absolute",
                      display: "block",
                      marginTop: "8px",
                      // marginRight: "4px",
                      // transform: "translate3d(20px, 40px, 0px)",
                    }}
                    closeOnSelect={false}
                    w="full"
                  >
                    <ScrollArea.Root className="ScrollAreaRoot">
                      <ScrollArea.Viewport className="ScrollAreaViewport">
                        {channels?.length > 0 ? (
                          channels?.map((channel) => (
                            <AutoCompleteItem
                              key={channel.id}
                              value={channel.name}
                              textTransform="capitalize"
                              boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
                              backdropFilter={"blur(20px)"}
                              bgImage={`url('assets/img/BlackNoise.webp')`}
                              bgSize="cover"
                              bgRepeat="no-repeat"
                              borderRadius={5}
                              _hover={{
                                bg: "transparent",
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
                              >
                                <Stack
                                  w="full"
                                  direction="column"
                                  justify={"start"}
                                  align="start"
                                  spacing={1}
                                >
                                  <Flex
                                    w="full"
                                    direction="row"
                                    justify="space-between"
                                    align="center"
                                    gap={3}
                                  >
                                    <Text
                                      color="white"
                                      fontSize="14px"
                                      fontWeight="medium"
                                      ml={2}
                                      flex={1}
                                    >
                                      {channel.name}
                                    </Text>
                                    {!channel?.members
                                      ?.map((m: { id: number }) => m.id)
                                      ?.includes(currentUser?.id) && (
                                      <IconButton
                                        aria-label="Join channel"
                                        size="sm"
                                        fontSize="lg"
                                        bg={"pong_cl_primary"}
                                        color={"white"}
                                        borderColor="red.500"
                                        borderWidth="1px"
                                        borderRadius={8}
                                        icon={<MdGroupAdd />}
                                        _hover={{
                                          bg: "white",
                                          color: "pong_cl_primary",
                                        }}
                                        isLoading={isJoininChannel}
                                        onClick={() => {
                                          if (channel.privacy === "public") {
                                            handleJoinChannel(channel);
                                          } else if (
                                            channel.privacy === "protected" &&
                                            password === ""
                                          ) {
                                            setShowPasswordInput(channel.id);
                                          } else if (
                                            channel.privacy === "protected" &&
                                            password !== ""
                                          ) {
                                            handleJoinChannel(channel);
                                          }
                                        }}
                                      />
                                    )}
                                  </Flex>

                                  <Box
                                    w="full"
                                    display={
                                      channel.privacy === "protected" &&
                                      showPasswordInput === channel.id
                                        ? "block"
                                        : "none"
                                    }
                                  >
                                    <Input
                                      id="password"
                                      type="password"
                                      placeholder="Protected channel password"
                                      onChange={(e) =>
                                        setPassword(e.target.value)
                                      }
                                      value={password}
                                    />
                                  </Box>
                                </Stack>
                              </Flex>
                            </AutoCompleteItem>
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
                            <Text
                              fontSize="md"
                              fontWeight="normal"
                              color="whiteAlpha.500"
                            >
                              No channels yet !
                            </Text>
                          </Flex>
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
              </Stack>
            </Stack>
          </ModalBody>

          <ModalFooter p={2}>
            <Button
              bg={"white"}
              color={"orange.500"}
              letterSpacing={1}
              mr={3}
              onClick={onToggleSearchChannel}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SearchForChannel;
