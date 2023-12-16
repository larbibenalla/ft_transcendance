import { useEffect, useState } from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Flex,
  Icon,
  IconButton,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useToast,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  Button,
  Select,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { GiThreeFriends } from "react-icons/gi";
import { HiUserRemove } from "react-icons/hi";
import { MdBlockFlipped } from "react-icons/md";
import { BiMicrophone, BiSolidMicrophoneOff } from "react-icons/bi";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSelector } from "react-redux";
import channelsApi from "src/features/channels/channelsApi";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object().shape({
  username: yup.string().required("Username is required").trim(),
  role: yup.string().required("role is required").trim(),
});

interface ChannelType {
  channel: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    ownerId: number;
    owner: {
      id: number;
      name: string;
    };
    members: [
      {
        id: number;
        name: string;
        username: string;
        avatar: string;
        role: string;
        isMuted: boolean;
      }
    ];
    banned: number[];
  };
}

const Members = ({ channel }: ChannelType) => {
  const currentUser = useSelector((state: any) => state.user.currentUser);
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState<string>("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const [triggerAddUserOrEditMember, { isLoading: isAddingOrEditing }] =
    channelsApi.useOnAddUserOrEditMemberMutation();

  const [muteChannelMember] = channelsApi.useMuteChannelMemberMutation();
  const [unmuteChannelMember] = channelsApi.useUnmuteChannelMemberMutation();
  const [banChannelMember] = channelsApi.useBanChannelMemberMutation();
  const [kickChannelMember] = channelsApi.useKickChannelMemberMutation();

  const onAddUserOrEditMember = async (data: any) => {
    const { username, role } = data;
    try {
      if (username === currentUser?.username)
        throw new Error("You can't add yourself to the channel.");
      const res = await triggerAddUserOrEditMember({
        channelId: channel?.id,
        channelName: channel?.name,
        data: {
          username,
          role,
        },
      }).unwrap();
      toast({
        title: "Info",
        description: res?.message,
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Member not added.",
        description: error?.data?.message || "Member not added to the channel.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    reset({
      username: "",
      role: "member",
    });
  };

  const handleKickMember = async (memberId) => {
    try {
      await kickChannelMember({
        channelId: channel?.id,
        memberId,
        channelName: channel?.name,
      }).unwrap();
      toast({
        title: "Member Kicked.",
        description: "Member kicked from the channel.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Member not Kicked.",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleMuteMember = async (memberId) => {
    try {
      await muteChannelMember({
        channelId: channel?.id,
        userId: memberId,
        channelName: channel?.name,
      }).unwrap();
      toast({
        title: "Member Muted.",
        description: "Member has been muted.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      toast({
        title: "Error.",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleUnMuteMember = async (memberId) => {
    try {
      await unmuteChannelMember({
        channelId: channel?.id,
        userId: memberId,
        channelName: channel?.name,
      }).unwrap();
      toast({
        title: "Member UnMuted.",
        description: "Member has been unmuted.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      // console.log("error: ", error);
      toast({
        title: "Error.",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const handleBanMember = async (memberId: number) => {
    try {
      await banChannelMember({
        channelId: channel?.id,
        userId: memberId,
        channelName: channel?.name,
      }).unwrap();
      toast({
        title: "Member Banned.",
        description: "Member banned from the channel.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (error: any) {
      // console.log("error: ", error);
      toast({
        title: "Member not banned.",
        description: error.message || "Member not banned from the channel.",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {}, []);
  return (
    <Stack
      direction={{ base: "column" }}
      spacing="24px"
      w={{ base: "full", lg: "450px" }}
      h={{ base: "full" }}
      p={{ base: 4, md: 6 }}
      borderRadius={24}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('assets/img/BlackNoise.webp')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      <Flex direction="row" align="center" justify="center" gap={1.5}>
        <Icon boxSize="22px" as={GiThreeFriends} color="white" />
        <Text
          fontSize="20px"
          fontWeight="semibold"
          color="whiteAlpha.900"
          letterSpacing={1}
        >
          Members
        </Text>
      </Flex>
      <Flex direction="column" w="full" gap={2} align="start">
        <Flex direction="row" align="center" gap={2}>
          <Text
            fontSize="14px"
            fontWeight="regular"
            color="whiteAlpha.900"
            letterSpacing={1}
          >
            Members
          </Text>
          <AvatarGroup size="sm" max={4} color={"pong_bg_primary"}>
            {channel?.members.map((member) => (
              <Avatar
                key={member?.id}
                bg="pong_bg_secondary"
                p={0.5}
                ml={2}
                name={member?.name}
                src={member?.avatar}
              />
            ))}
          </AvatarGroup>
        </Flex>
      </Flex>
      <Stack
        w={"full"}
        direction="column"
        justify="start"
        align="center"
        spacing={5}
      >
        <FormControl isInvalid={!!errors.username} mt={0}>
          <FormLabel htmlFor="username" fontSize="lg">
            Member
          </FormLabel>
          <Input
            id="username"
            type="text"
            placeholder="username"
            {...register("username")}
          />
          <FormErrorMessage>
            {errors.username && errors.username.message}
          </FormErrorMessage>
        </FormControl>
        <FormControl isInvalid={!!errors.role} mt={0} isRequired>
          <FormLabel htmlFor="role" fontSize="lg">
            Member role
          </FormLabel>
          <Controller
            name="role"
            control={control}
            defaultValue="member"
            render={({ field }) => (
              <Select
                {...field}
                onChange={(inputValue) => {
                  field.onChange(inputValue);
                }}
                bg="pong_bg_secondary"
              >
                <option style={{ background: "transparent" }} value="member">
                  Member
                </option>
                <option style={{ background: "transparent" }} value="admin">
                  Admin
                </option>
              </Select>
            )}
          />
          <FormErrorMessage>
            {errors.role && errors.role.message}
          </FormErrorMessage>
        </FormControl>
        <Button
          colorScheme="orange"
          mt={0}
          w="full"
          isLoading={isAddingOrEditing}
          isDisabled={isAddingOrEditing}
          cursor="pointer"
          onClick={handleSubmit(onAddUserOrEditMember)}
        >
          Add / Manage Member
        </Button>
      </Stack>
      <Stack direction={"column"}>
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
            // isLoading={isLoading}
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
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(e.target.value)
                }
                value={query}
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
              }}
              closeOnSelect={false}
              p={1}
              mr={2}
            >
              <ScrollArea.Root className="ScrollAreaRoot">
                <ScrollArea.Viewport className="ScrollAreaViewport">
                  {channel?.members?.map((member) => (
                    <AutoCompleteItem
                      key={member?.id}
                      value={member?.name}
                      textTransform="capitalize"
                      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
                      backdropFilter={"blur(20px)"}
                      bgImage={`url('assets/img/BlackNoise.webp')`}
                      bgSize="cover"
                      bgRepeat="no-repeat"
                      borderRadius={50}
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
                      >
                        <Flex
                          direction="row"
                          gap="3px"
                          align="center"
                          w={"full"}
                          onClick={() =>
                            navigate(`/profile/${member.username}`)
                          }
                        >
                          <Avatar
                            size="sm"
                            name={member?.name}
                            src={member?.avatar}
                            borderColor={"green.400"}
                            borderWidth="2px"
                          >
                            <AvatarBadge
                              boxSize="0.9em"
                              border="1px solid white"
                              bg={"green.400"}
                            />
                          </Avatar>
                          <Text
                            color="white"
                            fontSize="14px"
                            fontWeight="medium"
                            ml={2}
                            flex={1}
                            textTransform={"capitalize"}
                          >
                            {member?.name}
                          </Text>
                        </Flex>
                        <Flex direction="row" gap="6px" mr={0}>
                          {
                            // (channel?.ownerId === currentUser?.id ||
                            //   channel?.members?.find(
                            //     (m) => m?.id === currentUser?.id
                            //   )?.role === "admin") && (
                            <>
                              {currentUser?.id !== member?.id &&
                              (channel?.members?.find(
                                (m) => m?.id === currentUser?.id
                              )?.role === "admin" ||
                              channel?.ownerId === currentUser?.id
                                ? !(
                                    channel?.members?.find(
                                      (m) => m?.id === member?.id
                                    )?.role === "admin" ||
                                    member?.id === channel?.ownerId
                                  ) ||
                                  (member.id !== channel.ownerId &&
                                    channel.ownerId === currentUser?.id)
                                : false) ? (
                                <>
                                  <IconButton
                                    size="xs"
                                    fontSize="md"
                                    bg={"white"}
                                    color={"red.500"}
                                    borderColor="red.500"
                                    borderWidth="1px"
                                    borderRadius={8}
                                    aria-label="Kick member"
                                    icon={<HiUserRemove />}
                                    _hover={{
                                      bg: "red.500",
                                      color: "white",
                                    }}
                                    onClick={() => handleKickMember(member?.id)}
                                  />
                                  {!channel?.banned
                                    // ?.map((member) => member?.id)
                                    ?.includes(member?.id) && (
                                    <IconButton
                                      size="xs"
                                      fontSize="md"
                                      bg={"white"}
                                      color={"red.500"}
                                      borderColor="red.500"
                                      borderWidth="1px"
                                      borderRadius={8}
                                      aria-label="Ban member"
                                      icon={<MdBlockFlipped />}
                                      _hover={{
                                        bg: "red.500",
                                        color: "white",
                                      }}
                                      onClick={() =>
                                        handleBanMember(member?.id)
                                      }
                                    />
                                  )}
                                  {member?.isMuted ? (
                                    <IconButton
                                      size="xs"
                                      fontSize="md"
                                      bg={"white"}
                                      color={"green.500"}
                                      borderColor="green.500"
                                      borderWidth="1px"
                                      borderRadius={8}
                                      aria-label="Mute member"
                                      icon={<BiMicrophone />}
                                      _hover={{
                                        bg: "green.500",
                                        color: "white",
                                      }}
                                      onClick={() =>
                                        handleUnMuteMember(member?.id)
                                      }
                                    />
                                  ) : (
                                    <IconButton
                                      size="xs"
                                      fontSize="md"
                                      bg={"white"}
                                      color={"red.500"}
                                      borderColor="red.500"
                                      borderWidth="1px"
                                      borderRadius={8}
                                      aria-label="Mute member"
                                      icon={<BiSolidMicrophoneOff />}
                                      _hover={{
                                        bg: "red.500",
                                        color: "white",
                                      }}
                                      onClick={() =>
                                        handleMuteMember(member?.id)
                                      }
                                    />
                                  )}
                                </>
                              ) : null}
                            </>
                            // )
                          }
                        </Flex>
                      </Flex>
                    </AutoCompleteItem>
                  ))}
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
    </Stack>
  );
};

export default Members;
