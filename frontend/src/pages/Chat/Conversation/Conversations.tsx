import {
  Avatar,
  AvatarBadge,
  Box,
  Button,
  CloseButton,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FiPlus } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useGetConversationsQuery } from "src/features/conversations/conversationsApi";
import { useSelector } from "react-redux";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LastMessageDate from "./LastMessageDate";
import { useEffect, useRef, useState } from "react";
import DeleteConversationAlert from "./DeleteConversationAlert";
import AddDirectMessage from "src/components/Chat/AddDirectMessage";
import Loader from "src/components/Utils/Loader";
import { createSocketClient } from "src/app/socket/client";
dayjs.extend(relativeTime);

const Conversations = () => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const navigate = useNavigate();
  const [conversationIdToDelete, setConversationIdToDelete] = useState("");
  const { isOpen: isOpenDM, onToggle: onToggleDM } = useDisclosure();
  const {
    isOpen: isAlertDialogOpen,
    onOpen: onOpenAlertDialog,
    onClose: onCloseAlertDialog,
  } = useDisclosure();
  const cancelRef = useRef();

  const {
    data: conversations,
    isLoading: isLoadingConversations,
    isFetching: isFetchingConversations,
    refetch: refetchConversations,
  } = useGetConversationsQuery(currentUser?.email, {
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const socket = createSocketClient({
      api_url: import.meta.env.VITE_SERVER_CHAT_SOCKET_URL as string,
    });
    socket.on("deleteConversation", (data = {} as any) => {
      if (conversations?.map((c) => c.id).includes(data?.data?.id)) {
        refetchConversations();
      }
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  if (isLoadingConversations || isFetchingConversations)
    return <Loader size="md" />;

  return (
    <>
      <Flex direction="row" justify="space-between" align="center">
        <Flex justify="start" align="center" direction="row" gap="2px">
          <Menu
            gutter={14}
            computePositionOnMount={true}
            defaultIsOpen
            preventOverflow={true}
            boundary="scrollParent"
            closeOnBlur={false}
            strategy="absolute"
            closeOnSelect={false}
            flip={false}
            isLazy={true}
          >
            {({ isOpen }) => (
              <>
                <MenuButton
                  isActive={isOpen}
                  as={Button}
                  leftIcon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  sx={{
                    "&:hover": {
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    },
                    "&:active": {
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    },
                    "&:focus": {
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    },
                    "&:selected": {
                      background: "none",
                      boxShadow: "none",
                      border: "none",
                    },
                    fontSize: "14px",
                    fontWeight: "semibold",
                    color: "white",
                    padding: "0px",
                    height: "auto",
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                  _active={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                  _focus={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                  _hover={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                  _selected={{
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                  }}
                >
                  Direct Messages
                </MenuButton>
                <MenuList
                  as={Stack}
                  p={0}
                  bg={"trasparent"}
                  w={{ base: "250px", sm: "360px", md: "284px" }}
                  height="350px"
                  borderRadius={"16px"}
                  spacing={0}
                  border={"none"}
                >
                  <ScrollArea.Root className="ScrollAreaRoot">
                    <ScrollArea.Viewport className="ScrollAreaViewport">
                      {conversations.length > 0 ? (
                        conversations
                          ?.slice() // array copy
                          .sort(
                            (c1, c2) =>
                              dayjs(c2?.lastMessageCreatedAt).diff(
                                dayjs(c1?.lastMessageCreatedAt)
                              ) // in descending order from the newest to the oldest
                          )
                          .map((conversation, index) => (
                            <MenuItem
                              key={index}
                              bg={"trasparent"}
                              borderRadius={"6px"}
                              _focus={{ bg: "pong_bg.200" }}
                              _hover={{ bg: "pong_bg.200" }}
                              _selected={{ bg: "pong_bg.200" }}
                            >
                              <Flex
                                direction="row"
                                gap="6px"
                                align="center"
                                justify="space-between"
                                w={"full"}
                              >
                                <Flex
                                  direction="row"
                                  gap="10px"
                                  align="center"
                                  justify={"start"}
                                  w={"full"}
                                  onClick={() => {
                                    navigate(
                                      `/chat/conversation/${conversation.id}`
                                    );
                                  }}
                                >
                                  <Avatar
                                    size="md"
                                    name={
                                      conversation.name.filter(
                                        (name) => name != currentUser?.name
                                      )[0]
                                    }
                                    src={
                                      conversation.avatar.filter(
                                        (user) => user.id !== currentUser?.id
                                      )[0]?.avatar
                                    }
                                    borderColor="green.400"
                                    borderWidth="3px"
                                  >
                                    <AvatarBadge
                                      boxSize="0.7em"
                                      border="2px solid white"
                                      bg={"green.400"}
                                      position="absolute"
                                      bottom={"-15%"}
                                      right={"0%"}
                                      translateY={"50%"}
                                    ></AvatarBadge>
                                  </Avatar>
                                  <Stack
                                    direction="column"
                                    spacing={0}
                                    justify="start"
                                    //   alignContent="stretch"
                                    w="full"
                                  >
                                    <Text
                                      fontSize={{
                                        base: "12px",
                                        sm: "14px",
                                        md: "15px",
                                      }}
                                      fontWeight="normal"
                                      alignSelf={"stretch"}
                                      color={"whiteAlpha.900"}
                                      letterSpacing={0}
                                      lineHeight={"auto"}
                                      overflow={"hidden"}
                                      whiteSpace={"nowrap"}
                                      textOverflow={"ellipsis"}
                                      w={"160px"}
                                    >
                                      {
                                        conversation.name.filter(
                                          (name) => name != currentUser?.name
                                        )[0]
                                      }
                                    </Text>
                                    <Text
                                      overflow={"hidden"}
                                      fontSize={{
                                        base: "9px",
                                        sm: "10px",
                                        md: "11px",
                                      }}
                                      fontWeight="regular"
                                      color="whiteAlpha.600"
                                      alignSelf={"stretch"}
                                      whiteSpace={"nowrap"}
                                      textOverflow="ellipsis"
                                      w={"160px"}
                                    >
                                      {conversation.lastMessageContent}
                                    </Text>
                                    <LastMessageDate
                                      lastMessageCreatedAt={
                                        conversation.lastMessageCreatedAt
                                      }
                                    />
                                  </Stack>
                                </Flex>
                                <CloseButton
                                  onClick={() => {
                                    setConversationIdToDelete(conversation.id);
                                    onOpenAlertDialog();
                                  }}
                                  size="sm"
                                  color="white"
                                />
                              </Flex>
                            </MenuItem>
                          ))
                      ) : (
                        <Flex
                          justify="start"
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
                            No conversations yet !
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
                </MenuList>
              </>
            )}
          </Menu>
        </Flex>
        <Flex direction="row" gap="2px" align={"center"} justify="center">
          <IconButton
            size="xs"
            fontSize="lg"
            bg={"pong_bg_secondary"}
            color={"white"}
            borderRadius={8}
            aria-label="Search for a conversation"
            icon={<FiPlus />}
            _hover={{ bg: "white", color: "pong_bg_secondary" }}
            onClick={onToggleDM}
          />
        </Flex>
        {isAlertDialogOpen && (
          <DeleteConversationAlert
            conversationId={conversationIdToDelete}
            isOpen={isAlertDialogOpen}
            onClose={onCloseAlertDialog}
            cancelRef={cancelRef}
          />
        )}
      </Flex>
      <Box
        w="full"
        height="360px"
      //    bg={"red"}
      ></Box>

      {isOpenDM && (
        <AddDirectMessage isOpenDM={isOpenDM} onToggleDM={onToggleDM} />
      )}
    </>
  );
};

export default Conversations;
