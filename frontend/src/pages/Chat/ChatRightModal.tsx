import {
  Avatar,
  CloseButton,
  Flex,
  Heading,
  Icon,
  IconButton,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import {
  HiOutlineMail,
  HiOutlineStatusOnline,
  HiOutlineUserCircle,
} from "react-icons/hi";
import { FiMessageSquare } from "react-icons/fi";
import { AiOutlineUserAdd } from "react-icons/ai";
import { IoGameControllerOutline } from "react-icons/io5";
import { MdBlockFlipped } from "react-icons/md";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import usersApi, { useGetUserByIdQuery } from "src/features/users/usersApi";
import Loader from "src/components/Utils/Loader";
import conversationApi from "src/features/conversations/conversationsApi";
import { v4 as uuidv4 } from "uuid";
import { useCreateConversationWithoutMessageMutation } from "src/features/conversations/conversationsApi";
import { useSelector } from "react-redux";
import notificationsApi from "src/features/notifications/notificationsApi";
import { CgUnblock } from "react-icons/cg";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

const ChatRightModal = ({ participantUserId, isOpen, toggleProfileDrawer }) => {
  // console.log("participantUserId: ", participantUserId);
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  // const prefetchUser = usersApi.usePrefetch("getCurrentUser", {
  //   force: true,
  // });
  const navigate = useNavigate();
  const toast = useToast();

  const {
    data: participantUser = {} as any,
    isLoading: isLoadingParticipantUser,
    isFetching: isFetchingParticipantUser,
  } = useGetUserByIdQuery(participantUserId, {
    refetchOnMountOrArgChange: true,
  });

  const [
    triggerGetConversationByMembersEmails,
    { isLoading: isLoadingGetConversationByMembersEmails },
  ] = conversationApi.endpoints.getConversationByMembersEmails.useLazyQuery();

  const [
    createConversationWithoutMessage,
    { isLoading: isLoadingCreateConversationWithoutMessage },
  ] = useCreateConversationWithoutMessageMutation();

  const [blockUser] = usersApi.useBlockUserMutation();

  const [unblockUser] = usersApi.useUnblockUserMutation();

  const [sendNotification] = notificationsApi.useSendNotificationMutation();

  if (isLoadingParticipantUser || isFetchingParticipantUser) return <Loader />;

  const handleSendDirectMessage = async () => {
    try {
      const conversations = await triggerGetConversationByMembersEmails({
        firstMemberEmail: currentUser?.email,
        secondMemberEmail: participantUser?.email,
      }).unwrap();
      let id;
      if (conversations?.length > 0) {
        const conversation = conversations[0];
        id = conversation.id;
      } else {
        const conversation = {
          id: uuidv4(),
          name: [currentUser?.name, participantUser?.name],
          avatar: [
            {
              id: currentUser?.id,
              avatar: currentUser?.avatar,
            },
            {
              id: participantUser?.id,
              avatar: participantUser?.avatar,
            },
          ],
          members: [currentUser?.email, participantUser?.email],
          firstMember: currentUser?.id,
          secondMember: participantUser?.id,
          lastMessageContent: "",
          lastMessageCreatedAt: dayjs().valueOf(),
        };
        await createConversationWithoutMessage(conversation).unwrap();
        id = conversation.id;
      }
      toggleProfileDrawer();
      navigate(`/chat/conversation/${id}`);
    } catch (error) {
      // console.log("error: ", error);
      toast({
        title: "Error",
        description: "Error happened while opening the conversation",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleSendFriendNotification = async () => {
    if (currentUser?.friends.includes(participantUser?.id)) {
      toast({
        title: "Info",
        description: "He is already your friend",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
      // re-render the component
      toggleProfileDrawer();
      return;
    }
    try {
      const notification = {
        id: uuidv4(),
        type: "friendRequest",
        senderId: currentUser?.id,
        receiverId: participantUser?.id,
      };
      await sendNotification(notification).unwrap();

      toast({
        title: "Friend request sent",
        description: "Friend request sent successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      toggleProfileDrawer();
    } catch (error: any) {
      // console.log("error accepting friend request: ", error);
      // console.log("error: ", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Error happened",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleSendGameChallengeNotification = async () => {
    try {
      const notification = {
        id: uuidv4(),
        type: "gameRequest",
        senderId: currentUser?.id,
        receiverId: participantUser?.id,
      };
      await sendNotification(notification).unwrap();
      toast({
        title: "Game request sent",
        description: "Game request sent successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      toggleProfileDrawer();
    } catch (error: any) {
      // console.log("error: ", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Error happened",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleUnBlockUser = async () => {
    try {
      await unblockUser({
        id: currentUser?.id,
        blockedUserId: participantUser?.id,
      }).unwrap();
      toast({
        title: "User unblocked",
        description: "User unblocked successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      toggleProfileDrawer();
    } catch (error: any) {
      // console.log("error: ", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Error happened",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleBlockUser = async () => {
    try {
      await blockUser({
        id: currentUser?.id,
        blockedUserId: participantUser?.id,
      }).unwrap();
      toast({
        title: "User blocked",
        description: "User blocked successfully",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      toggleProfileDrawer();
    } catch (error: any) {
      // console.log("error: ", error);
      toast({
        title: "Error",
        description: error?.data?.message || "Error happened",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Drawer
      open={isOpen}
      onClose={toggleProfileDrawer}
      direction="right"
      enableOverlay={false}
      duration={0}
      style={{
        position: "absolute",
        width: 250,
        height: "100%",
        marginRight: "1px",
        borderTopRightRadius: "26px",
        borderBottomRightRadius: "26px",
        backgroundColor: "rgba(51, 51, 51, 0.9)",
      }}
    >
      <Stack
        w="full"
        h="full"
        p={2}
        spacing={4}
        borderTopRightRadius="26px"
        borderBottomRightRadius="26px"
      >
        <Flex w="full" justify={"space-between"} align={"center"} p={1}>
          <Heading fontSize="md" fontWeight="semibold">
            Chat Profile
          </Heading>
          <CloseButton
            size="sm"
            color="pong_cl_primary"
            bg={"white"}
            borderRadius={"50%"}
            onClick={toggleProfileDrawer}
          />
        </Flex>
        <Flex justify="center" align="center" w="full">
          <Avatar
            boxSize={"160px"}
            name={participantUser?.name}
            src={participantUser?.avatar}
            borderColor="green.400"
            borderWidth="3px"
          />
        </Flex>
        <Flex justify="space-around" align="center" w="full" gap={5}>
          <Text
            fontSize="14px"
            fontStyle={"normal"}
            fontWeight="semibold"
            color="whiteAlpha.900"
            lineHeight={"28px"}
            letterSpacing={1}
          >
            {participantUser?.name}
          </Text>
          <Flex justify="center" align="center" gap={1}>
            <Icon
              as={HiOutlineStatusOnline}
              boxSize={"20px"}
              borderRadius={"50%"}
              color={"green.400"}
            />
            <Text fontSize="12px" fontWeight="light" color="whiteAlpha.900">
              {participantUser?.status}
            </Text>
          </Flex>
        </Flex>
        <Stack direction="column" spacing={1} align="start" w="full">
          <Text fontSize="14px" fontWeight="semibold">
            Contact information
          </Text>
          <Flex direction="row" gap={2} justify="center" align="center">
            <Icon
              ml={2}
              boxSize={5}
              as={HiOutlineMail}
              color="whiteAlpha.600"
            />
            <Stack spacing={1} align="start">
              <Text
                fontSize="12px"
                fontWeight="medium"
                color="whiteAlpha.600"
                w={"full"}
              >
                Email
              </Text>
              <Text fontSize="12px" fontWeight="light" color="pong_cl_primary">
                {participantUser?.email}
              </Text>
            </Stack>
          </Flex>
        </Stack>
        <Flex
          direction="row"
          gap="8px"
          bg="pong_bg_secondary"
          w="full"
          h="40px"
          justify="center"
          align="center"
          borderRadius={8}
        >
          <IconButton
            size="sm"
            fontSize="lg"
            bg={"pong_cl_primary"}
            color={"white"}
            borderRadius={8}
            aria-label="Send a message"
            icon={<FiMessageSquare />}
            _hover={{ bg: "white", color: "pong_cl_primary" }}
            onClick={handleSendDirectMessage}
            isLoading={
              isLoadingGetConversationByMembersEmails ||
              isLoadingCreateConversationWithoutMessage
            }
            disabled={
              isLoadingGetConversationByMembersEmails ||
              isLoadingCreateConversationWithoutMessage
            }
          />
          <IconButton
            size="sm"
            fontSize="lg"
            bg={"pong_cl_primary"}
            color={"white"}
            borderRadius={8}
            aria-label="View profile"
            icon={<HiOutlineUserCircle />}
            _hover={{ bg: "white", color: "pong_cl_primary" }}
            onClick={() => {
              toggleProfileDrawer();
              navigate(`/profile/${participantUser?.username}`);
            }}
          />
          {!participantUser?.friends.includes(currentUser?.id) && (
            <IconButton
              size="sm"
              fontSize="lg"
              bg={"pong_cl_primary"}
              color={"white"}
              borderRadius={8}
              aria-label="Send friend request"
              icon={<AiOutlineUserAdd />}
              _hover={{ bg: "white", color: "pong_cl_primary" }}
              onClick={handleSendFriendNotification}
            />
          )}
          {
            !currentUser?.blocked.includes(participantUser?.id) &&
            (
              <IconButton
                size="sm"
                fontSize="lg"
                bg={"pong_cl_primary"}
                color={"white"}
                borderRadius={8}
                aria-label="Send game request"
                icon={<IoGameControllerOutline />}
                _hover={{ bg: "white", color: "pong_cl_primary" }}
                onClick={handleSendGameChallengeNotification}
              />
            )
          }
          {currentUser?.blocked.includes(participantUser?.id) ? (
            <IconButton
              size="sm"
              fontSize="lg"
              bg={"green.500"}
              color={"white"}
              borderRadius={8}
              aria-label="Block"
              icon={<CgUnblock />}
              _hover={{ bg: "white", color: "green.500" }}
              onClick={handleUnBlockUser}
            />
          ) : (
            <IconButton
              size="sm"
              fontSize="lg"
              bg={"pong_cl_primary"}
              color={"white"}
              borderRadius={8}
              aria-label="Block"
              icon={<MdBlockFlipped />}
              _hover={{ bg: "white", color: "pong_cl_primary" }}
              onClick={handleBlockUser}
            />
          )}
        </Flex>
        <Stack direction="column" spacing={2} align="start" w="full">
          <Text fontSize="md" fontWeight="medium">
            About me
          </Text>
          <Stack spacing={4} justify="start">
            <Flex direction={"column"} gap={1}>
              <Text fontSize="14px" fontWeight="medium" color="whiteAlpha.600">
                Login 42
              </Text>
              <Text fontSize="12px" fontWeight="medium" color="whiteAlpha.400">
                {participantUser?.username}
              </Text>
            </Flex>
            <Flex direction={"column"} gap={1}>
              <Text fontSize="14px" fontWeight="medium" color="whiteAlpha.600">
                Intra Profile
              </Text>
              <Link
                as={RouterLink}
                to={`https://profile.intra.42.fr/users/${participantUser?.originalUsername}`}
                isExternal
                fontSize="12px"
                fontWeight="medium"
                color="pong_cl_primary"
              >
                42 Profile <ExternalLinkIcon mx="2px" />
              </Link>
            </Flex>
            <Flex direction={"column"} gap={1}>
              <Text fontSize="14px" fontWeight="medium" color="whiteAlpha.600">
                Campus
              </Text>
              <Text fontSize="12px" fontWeight="medium" color="whiteAlpha.400">
                {participantUser?.campus}
              </Text>
            </Flex>
          </Stack>
        </Stack>
      </Stack>
    </Drawer>
  );
};

export default ChatRightModal;
