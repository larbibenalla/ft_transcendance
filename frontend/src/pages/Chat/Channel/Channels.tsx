import {
  Box,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { ChevronDownIcon, ChevronRightIcon } from "@chakra-ui/icons";
import { FiHash, FiPlus, FiSearch } from "react-icons/fi";
import SearchForChannel from "src/components/Chat/SearchForChannel";
import CreateChannel from "src/components/Chat/CreateChannel";
import { useGetChannelsByMemberIdQuery } from "src/features/channels/channelsApi";
import Loader from "src/components/Utils/Loader";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const menuBtnStyle = {
  background: "none",
  boxShadow: "none",
  border: "none",
};

const Channels = () => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen: isOpenCreateChannel, onToggle: onToggleCreateChannel } =
    useDisclosure();
  const { isOpen: isOpenSearchChannel, onToggle: onToggleSearchChannel } =
    useDisclosure();

  const {
    data: channels,
    isLoading: isLoadingChannels,
    isFetching: isFetchingChannels,
    error: errorGettingsChannels,
  } = useGetChannelsByMemberIdQuery(currentUser?.id, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoadingChannels || isFetchingChannels) return <Loader size="md" />;

  if (errorGettingsChannels)
    toast({
      title: "An error occurred.",
      description: "Unable to get channels.",
      status: "error",
      duration: 9000,
      isClosable: true,
    });

  return (
    <Stack justify="start" align="start" w="full" gap="0px">
      <Flex direction="row" justify="space-between" align="center" w="full">
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
          >
            {({ isOpen }) => (
              <>
                <MenuButton
                  isActive={isOpen}
                  as={Button}
                  leftIcon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                  sx={{
                    fontSize: "14px",
                    fontWeight: "semibold",
                    color: "white",
                    padding: "0px",
                    height: "auto",
                    background: "none",
                    boxShadow: "none",
                    border: "none",
                    "&:hover": menuBtnStyle,
                    "&:active": menuBtnStyle,
                    "&:focus": menuBtnStyle,
                    "&:selected": menuBtnStyle,
                  }}
                  _active={menuBtnStyle}
                  _focus={menuBtnStyle}
                  _hover={menuBtnStyle}
                  _selected={menuBtnStyle}
                >
                  Channels
                </MenuButton>
                <MenuList
                  p={0}
                  bg={"trasparent"}
                  w={{ base: "250px", sm: "360px", md: "284px" }}
                  h="250px"
                  borderRadius={"16px"}
                  border={"none"}
                >
                  <ScrollArea.Root className="ScrollAreaRoot">
                    <ScrollArea.Viewport className="ScrollAreaViewport">
                      {channels?.length > 0 ? (
                        channels?.map((channel) => (
                          <MenuItem
                            key={channel?.id}
                            bg={"trasparent"}
                            borderRadius={"6px"}
                            icon={<FiHash />}
                            _focus={{ bg: "pong_bg.200" }}
                            _hover={{ bg: "pong_bg.200" }}
                            _selected={{ bg: "pong_bg.200" }}
                            fontSize={{
                              base: "13px",
                              sm: "14px",
                              md: "15px",
                            }}
                            onClick={() => {
                              navigate(`/chat/channel/${channel?.name}`);
                            }}
                          >
                            {channel?.name}
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
            aria-label="Search for a channel"
            icon={<FiSearch />}
            _hover={{ bg: "white", color: "pong_bg_secondary" }}
            onClick={onToggleSearchChannel}
          />

          <IconButton
            size="xs"
            fontSize="lg"
            bg={"pong_bg_secondary"}
            color={"white"}
            borderRadius={8}
            aria-label="Add a channel"
            icon={<FiPlus />}
            _hover={{ bg: "white", color: "pong_bg_secondary" }}
            onClick={onToggleCreateChannel}
          />
        </Flex>
      </Flex>
      <Box mt={3} w="full" height="255px"></Box>

      {isOpenSearchChannel && (
        <SearchForChannel
          isOpenSearchChannel={isOpenSearchChannel}
          onToggleSearchChannel={onToggleSearchChannel}
        />
      )}

      {isOpenCreateChannel && (
        <CreateChannel
          isOpenCreateChannel={isOpenCreateChannel}
          onToggleCreateChannel={onToggleCreateChannel}
        />
      )}
    </Stack>
  );
};

export default Channels;
