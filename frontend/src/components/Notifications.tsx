import {
  Box,
  Flex,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { css } from "@emotion/react";
import { FaBell, FaCheck } from "react-icons/fa";
import { useGetNotificationsQuery } from "src/features/notifications/notificationsApi";
import Loader from "./Utils/Loader";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigate } from "react-router-dom";
import { useDeleteNotificationMutation } from "src/features/notifications/notificationsApi";
import { CloseIcon } from "@chakra-ui/icons";
import usersApi, { useAddFriendMutation } from "src/features/users/usersApi";
// import { useAcceptGameChallengeMutation } from "src/features/game/gameApi";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { createSocketClient } from "src/app/socket/client";
import store from "src/app/store";

dayjs.extend(relativeTime);

function Notifications() {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const toast = useToast();
  const navigate = useNavigate();
  const socket = useRef<any>();

  useEffect(() => {
    socket.current = createSocketClient({
      api_url: import.meta.env.VITE_SERVER_MATCHMAKING_SOCKET_URL as string,
    });

    return () => {
      socket?.current?.disconnect();
    };
  }, []);

  const {
    data: notifications = [],
    isLoading: isNotificationsLoading,
    isFetching: isNotificationsFetching,
    refetch,
  } = useGetNotificationsQuery({
    subscribe: true,
    refetchOnMountOrArgChange: true,
  });

  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();

  const [addFriend, { isLoading: isAddingFriend }] = useAddFriendMutation();

  // const [acceptGameChallenge] =
  //   useAcceptGameChallengeMutation();

  const [triggerGetCurrentUser, { isLoading: isLoadingGetCurrentUser }] =
    usersApi.useLazyGetCurrentUserQuery();

  const handleMessageNotification = async ({
    notificationId,
    conversationId,
  }: {
    notificationId: string;
    conversationId: string;
  }) => {
    try {
      await deleteNotification(notificationId).unwrap();
      refetch();
      navigate(`/chat/conversation/${conversationId}`);
    } catch (error) {
    }
  };

  const handleAcceptFriendRequest = async ({ id, sender }) => {
    try {
      await deleteNotification(id).unwrap();
      await addFriend({
        currentUserId: currentUser?.id,
        friendId: sender?.id,
      }).unwrap();
      refetch();
      await triggerGetCurrentUser(currentUser?.id).unwrap();
      toast({
        title: "Success",
        description: "Friend request accepted",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.data?.message || "Error accepting friend request",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleAcceptGameChallenge = async ({ id, sender }) => {
    try {
      await deleteNotification(id).unwrap();
      if (store.getState().user.statusInGame)
        return ;
      
      socket?.current?.emit("accept_game_challenge", {
        challengedUserId: currentUser?.id,
        challengerUserId: sender?.id,
      });
      refetch();
    } catch (error: any) {
      
    }
  };

  const handleRejectNotification = async ({
    notificationId,
  }: {
    notificationId: string;
  }) => {
    try {
      await deleteNotification(notificationId).unwrap();
      refetch();
    } catch (error) {
      // // console.log("Error rejecting request: ", error);
      toast({
        title: "Error",
        description: "Error rejecting request",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box position="relative">
      <Menu placement={"bottom-end"}>
        <MenuButton
          as={IconButton}
          css={css`
            position: relative !important;
          `}
          py={"2"}
          colorScheme={"gray"}
          aria-label={"Notifications"}
          size="md"
          fontSize="lg"
          bg={"pong_cl_primary"}
          color={"white"}
          borderRadius={"50%"}
          icon={
            <>
              <FaBell color={"gray.750"} />
              <Box
                as={"span"}
                position={"absolute"}
                top={"2px"}
                right={"6px"}
                fontSize={"0.7rem"}
                zIndex={9999}
                p={"1px"}
              >
                {
                   store.getState().user.statusInGame ? 
                   notifications?.filter(
                    (notification) =>
                    notification?.receiverId === currentUser?.id && notification.type !== "gameRequest"
                    ).length
                   : 
                     notifications?.filter(
                       (notification) =>
                       notification?.receiverId === currentUser?.id 
                       ).length
                }
              </Box>
            </>
          }
          _hover={{
            bg: "white",
            color: "pong_cl_primary",
          }}
          _active={{
            bg: "white",
            color: "pong_cl_primary",
          }}
        />
        <MenuList
          bg={"pong_cl.600"}
          // bg={"transparent"}
          opacity={0}
          color={"whiteAlpha.900"}
          border={"1px solid rgba(251, 102, 19, 0.2)"}
        >
          {isNotificationsLoading || isNotificationsFetching ? (
            <MenuItem minH="40px" bg={"transparent"}>
              <Loader size="sm" />
            </MenuItem>
          ) : notifications?.length > 0 ? (
            notifications
              .slice()
              .sort((a, b) => dayjs(b?.createdAt).diff(dayjs(a?.createdAt))) // in descending order from the newest to the oldest
              .map((notification) =>
                notification?.type === "message" &&
                  notification?.receiverId === currentUser?.id ? (
                  <MenuItem
                    key={notification?.id}
                    as={Flex}
                    justify={"space-between"}
                    align={"center"}
                    gap={2}
                    minH="40px"
                    bg={"pong_bg.100"}
                    cursor={"pointer"}
                    borderBottom={"1px solid rgba(255, 255, 255, 0.1)"}
                  >
                    <Stack
                      direction={"column"}
                      align={"start"}
                      justify={"center"}
                      spacing={1}
                      onClick={() => {
                        handleMessageNotification({
                          notificationId: notification?.id,
                          conversationId: notification?.conversationId,
                        });
                      }}
                    >
                      <span>
                        New message from {""}
                        {notification?.sender?.name}
                      </span>
                      <Text
                        as={"span"}
                        color={"whiteAlpha.800"}
                        fontSize={"0.7rem"}
                      >
                        {dayjs(notification?.createdAt).fromNow()}
                      </Text>
                    </Stack>
                    <IconButton
                      aria-label={"Ignore friend request"}
                      bg={"transparent"}
                      fontSize={"2rem"}
                      size={"md"}
                      color={"white"}
                      icon={<Icon boxSize={"14px"} as={CloseIcon} />}
                      isLoading={isDeleting}
                      isDisabled={isDeleting}
                      _hover={{
                        bg: "transparent",
                        color: "white",
                      }}
                      onClick={() => {
                        handleRejectNotification({
                          notificationId: notification?.id,
                        });
                      }}
                    />
                  </MenuItem>
                ) : notification?.type === "friendRequest" &&
                  notification?.receiverId === currentUser?.id ? (
                  <MenuItem
                    key={notification?.id}
                    as={Flex}
                    justify={"space-between"}
                    align={"center"}
                    gap={4}
                    minH="40px"
                    bg={"transparent"}
                    cursor={"pointer"}
                    borderBottom={"1px solid rgba(255, 255, 255, 0.1)"}
                  >
                    <Stack
                      direction={"column"}
                      align={"start"}
                      justify={"center"}
                      spacing={1}
                    >
                      <span>
                        Friend request from {""}
                        {notification?.sender?.name}
                      </span>
                      <Text
                        as={"span"}
                        color={"whiteAlpha.800"}
                        fontSize={"0.7rem"}
                      >
                        {dayjs(notification?.createdAt).fromNow()}
                      </Text>
                    </Stack>
                    <Flex
                      direction={"row"}
                      align={"center"}
                      justify={"center"}
                      gap={1.5}
                    >
                      <IconButton
                        aria-label={"Reject friend request"}
                        isRound
                        bg={"red.500"}
                        fontSize={"2rem"}
                        size={"md"}
                        color={"white"}
                        icon={<Icon boxSize={"14px"} as={CloseIcon} />}
                        isLoading={isDeleting}
                        isDisabled={isDeleting}
                        _hover={{
                          bg: "white",
                          color: "red.600",
                        }}
                        onClick={() => {
                          handleRejectNotification({
                            notificationId: notification?.id,
                          });
                        }}
                      />
                      <IconButton
                        aria-label={"Accept friend request"}
                        isRound
                        bg={"green.500"}
                        size={"md"}
                        color={"white"}
                        icon={<Icon as={FaCheck} />}
                        isLoading={
                          isAddingFriend ||
                          isDeleting ||
                          isLoadingGetCurrentUser
                        }
                        isDisabled={
                          isAddingFriend ||
                          isDeleting ||
                          isLoadingGetCurrentUser
                        }
                        _hover={{
                          bg: "white",
                          color: "green.500",
                        }}
                        onClick={() => {
                          handleAcceptFriendRequest(notification);
                        }}
                      />
                    </Flex>
                  </MenuItem>
                ) : notification?.type === "gameRequest" &&
                  notification?.receiverId === currentUser?.id && !store.getState().user.statusInGame ? (
                  <MenuItem
                    key={notification?.id}
                    as={Flex}
                    justify={"space-between"}
                    align={"center"}
                    gap={4}
                    minH="40px"
                    bg={"pong_bg.100"}
                    borderRadius={5}
                    cursor={"pointer"}
                    borderBottom={"1px solid rgba(255, 255, 255, 0.1)"}
                  >
                    <Stack
                      direction={"column"}
                      align={"start"}
                      justify={"center"}
                      spacing={1}
                    >
                      <span>
                        <span
                          style={{
                            color: "#FF8707",
                            fontWeight: "semibold",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                            paddingRight: "2px",
                          }}
                        >
                          Game
                        </span>
                        challenge from {""}
                        <span
                          style={{
                            color: "#FF8707",
                            fontWeight: "semibold",
                            textTransform: "uppercase",
                            letterSpacing: "1px",
                          }}
                        >
                          {notification?.sender?.name}
                        </span>
                      </span>
                      <Text
                        as={"span"}
                        color={"whiteAlpha.800"}
                        fontSize={"0.7rem"}
                      >
                        {dayjs(notification?.createdAt).fromNow()}
                      </Text>
                    </Stack>
                    <Flex
                      direction={"row"}
                      align={"center"}
                      justify={"center"}
                      gap={1.5}
                    >
                      <IconButton
                        aria-label={"Reject game challenge"}
                        isRound
                        bg={"red.400"}
                        fontSize={"2rem"}
                        size={"md"}
                        color={"white"}
                        icon={<Icon boxSize={"14px"} as={CloseIcon} />}
                        isLoading={isDeleting}
                        isDisabled={isDeleting}
                        _hover={{
                          bg: "white",
                          color: "red.600",
                        }}
                        onClick={() => {
                          handleRejectNotification({
                            notificationId: notification?.id,
                          });
                        }}
                      />
                      <IconButton
                        aria-label={"Accept friend request"}
                        isRound
                        bg={"green.500"}
                        size={"md"}
                        color={"white"}
                        icon={<Icon as={FaCheck} />}
                        isLoading={
                          isDeleting ||
                          isLoadingGetCurrentUser
                          // isAcceptingGameChallenge
                        }
                        isDisabled={
                          isDeleting ||
                          isLoadingGetCurrentUser
                          // isAcceptingGameChallenge
                        }
                        _hover={{
                          bg: "white",
                          color: "green.500",
                        }}
                        onClick={() => {
                          handleAcceptGameChallenge(notification);
                        }}
                      />
                    </Flex>
                  </MenuItem>
                ) : null
              )
          ) : (
            <MenuItem minH="40px" bg={"transparent"}>
              <span>No notifications yet</span>
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Box>
  );
}

export default Notifications;
