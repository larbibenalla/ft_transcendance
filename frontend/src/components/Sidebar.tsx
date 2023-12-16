import {
  Box,
  Button,
  Flex,
  Icon,
  Stack,
  Text,
  Tooltip,
  Image,
} from "@chakra-ui/react";
import { GoPlay } from "react-icons/go";
import { HiOutlineStatusOnline } from "react-icons/hi";
import { IoChatbubbleEllipsesSharp, IoSettingsOutline } from "react-icons/io5";
import { MdSpaceDashboard, MdContactSupport } from "react-icons/md";
import { BiSolidLogOutCircle } from "react-icons/bi";
// import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import store from "src/app/store";
import authApi from "src/features/auth/authApi";

const NavigationPanel = [
  {
    name: "Overview",
    icon: MdSpaceDashboard,
    path: "/",
  },
  {
    name: "Settings",
    icon: IoSettingsOutline,
    path: "/settings",
  },
  {
    name: "Play",
    icon: GoPlay,
    path: "/game",
  },
  {
    name: "Chat",
    icon: IoChatbubbleEllipsesSharp,
    path: "/chat",
  },
  {
    name: "Support",
    icon: MdContactSupport,
    path: "/support",
  },
  {
    name: "Logout",
    icon: BiSolidLogOutCircle,
    path: "/login",
  },
];

const Sidebar = () => {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  const onlineUsers = useSelector((state: any) => state?.user?.onlineUsers);
  const navigate = useNavigate();

  return (
    <Stack spacing={5} align="center" w="full" pos="relative">
      <Image
        src="/assets/svg/brand_icon.svg"
        w={{ base: "40px" }}
        h={{ base: "40px" }}
        onClick={() => navigate("/")}
        cursor="pointer"
      />

      <Box
        as="span"
        w="full"
        h="2px"
        background="linear-gradient(270deg, rgba(255, 255, 255, 0.00) 0%, #FFF 55.73%, rgba(255, 255, 255, 0.00) 100%)"
      />
      <Stack spacing={2} align="center" justify="center" w="full">
        <Text
          fontSize="15px"
          fontStyle={"normal"}
          fontWeight="semibold"
          color="whiteAlpha.900"
          lineHeight={"28px"}
          letterSpacing={1}
          textAlign={"center"}
          maxW="120px"
          overflow={"hidden"}
        >
          {currentUser?.name}
        </Text>

        <Text
          fontSize="12px"
          fontStyle={"normal"}
          fontWeight="medium"
          color="pong_cl_primary"
        >
          Level {"   "} {currentUser?.level}
        </Text>
        <Flex w="full" justify="center" align="center" gap={1}>
          <Icon
            as={HiOutlineStatusOnline}
            boxSize={"20px"}
            borderRadius={"50%"}
            color={"green.400"}
          />
          <Text fontSize="10px" fontWeight="light" color="whiteAlpha.900">
            {onlineUsers} {"   "} players online
          </Text>
        </Flex>
      </Stack>

      <Box
        as="span"
        w="full"
        h="2px"
        background="linear-gradient(270deg, rgba(255, 255, 255, 0.00) 0%, #FFF 55.73%, rgba(255, 255, 255, 0.00) 100%)"
      />
      <Stack spacing={0} align="end" w="full">
        <Flex direction={"column"} justify="center" align="center" gap={5}>
          {NavigationPanel.map((nav, index) => (
            <Tooltip
              label={nav.name}
              aria-label={nav.name}
              placement="right"
              key={index}
              closeOnClick
              hasArrow
              bg={nav.name === "Logout" ? "#E53E3E" : "#FB6613"}
            >
              <Button
                key={index}
                w="120px"
                size="lg"
                color={"white"}
                bg={"none"}
                pr={{ base: 0, md: "10px", lg: "20px" }}
                alignItems={"center"}
                alignSelf={"stretch"}
                borderRight="7px solid rgba(253, 127, 44, 0)"
                leftIcon={
                  <Icon as={nav.icon} boxSize={"22px"} borderRadius={"50%"} />
                }
                _hover={{
                  background:
                    nav.name === "Logout"
                      ? "linear-gradient(90deg, rgba(229,62,62,0.2) 3.89%, rgba(253,127,44,0.12) 47.44%, rgba(133,30,30,0.5) 80.48%)"
                      : "linear-gradient(270deg, rgba(118, 56, 20, 0.60) 3.89%, rgba(253, 127, 44, 0.12) 47.44%, rgba(253, 127, 44, 0.15) 80.48%)",
                  borderRight:
                    nav.name === "Logout"
                      ? "7px solid #E53E3E"
                      : "7px solid #FB6613",
                  borderRadius:
                    nav.name === "Logout"
                      ? "6px 0px 6px 6px"
                      : "6px 0px 0px 6px",
                  color: nav.name === "Logout" ? "#E53E3E" : "#FB6613",
                }}
                onClick={async () => {
                  if (nav.name === "Logout") {
                    await store.dispatch(
                      authApi.endpoints.sendLogOut.initiate(currentUser?.id)
                    );
                    navigate(nav.path, { replace: true });
                  } else {
                    navigate(nav.path);
                  }
                }}
              />
            </Tooltip>
          ))}
        </Flex>
      </Stack>
      <Box
        as="span"
        w="full"
        h="2px"
        background="linear-gradient(270deg, rgba(255, 255, 255, 0.00) 0%, #FFF 55.73%, rgba(255, 255, 255, 0.00) 100%)"
      />
    </Stack>
  );
};

export default Sidebar;
