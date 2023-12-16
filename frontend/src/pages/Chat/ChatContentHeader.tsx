import {
  Avatar,
  AvatarBadge,
  Flex,
  Icon,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { FaHashtag } from "react-icons/fa";
import { FiInfo } from "react-icons/fi";
import ChannelInfoAbout from "src/components/Chat/ChannelInfoAbout";

const ChatContentHeader = ({
  toggleProfileDrawer,
  type,
  receiverUser = {} as any,
  channel = {} as any,
}) => {
  const { isOpen: isOpenChannelInfo, onToggle: onToggleChannelInfo } =
    useDisclosure();
  return (
    <Flex
      id="chat-content-header"
      w={"full"}
      height={"full"}
      justify="start"
      align="center"
      h={20}
      borderRadius={6}
      p={4}
      gap={3}
      //   alignSelf={"stretch"}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('assets/img/BlackNoise.webp')`}
      bgSize="cover"
      bgRepeat="no-repeat"
      bg="pong_bg_first"
    >
      {type === "DM" ? (
        <Flex
          direction="row"
          gap={4}
          align="center"
          justify={"start"}
          w="full"
          onClick={toggleProfileDrawer}
          cursor="pointer"
        >
          <Avatar
            size="lg"
            name={receiverUser?.name}
            src={receiverUser?.avatar}
            borderColor="green.400"
            borderWidth="3px"
          >
            <AvatarBadge
              boxSize="0.6em"
              border="3px solid white"
              bg={"green.400"}
            />
          </Avatar>
          <Stack direction="column" spacing={1} align="start">
            <Text fontSize="18px" fontWeight="semibold" color="whiteAlpha.900">
              {receiverUser?.name}
            </Text>
          </Stack>
        </Flex>
      ) : (
        <Stack
          w="full"
          h="full"
          direction="row"
          spacing={1}
          align="center"
          justify={"start"}
        >
          <Flex
            w="full"
            direction="row"
            align="center"
            justify={"space-between"}
          >
            <Flex
              w="full"
              direction="row"
              align="center"
              justify={"start"}
              gap={3}
            >
              <Icon as={FaHashtag} boxSize="20px" color="whiteAlpha.900" />
              <Text
                fontSize="18px"
                fontWeight="semibold"
                color="whiteAlpha.900"
              >
                {channel?.name}
              </Text>
            </Flex>
            <Flex direction="row" align="center" justify={"start"} ml={4}>
              <IconButton
                size="sm"
                fontSize="lg"
                bg={"pong_bg_secondary"}
                color={"white"}
                borderRadius={8}
                aria-label="Channel info"
                icon={<FiInfo />}
                _hover={{ bg: "white", color: "pong_bg_secondary" }}
                onClick={onToggleChannelInfo}
              />
            </Flex>
          </Flex>

          {isOpenChannelInfo && (
            <ChannelInfoAbout
              isOpenChannelInfo={isOpenChannelInfo}
              onToggleChannelInfo={onToggleChannelInfo}
              channel={channel}
            />
          )}
        </Stack>
      )}
    </Flex>
  );
};

export default ChatContentHeader;
