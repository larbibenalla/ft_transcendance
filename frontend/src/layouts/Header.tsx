import { Flex, IconButton, useDisclosure } from "@chakra-ui/react";
import Search from "src/components/Search";
import Notifications from "src/components/Notifications";
import { CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import MobileSidebar from "src/components/Modals/MobileSidebar";

const Header = () => {
  const { isOpen, onToggle: onToggleMobileSidebar } = useDisclosure();
  return (
    <Flex
      direction="row"
      justify="space-between"
      align="center"
      w="full"
      padding={"8px 12px 8px 12px"}
      // mr={4}
      // bg="pong_bg_secondary"
      // outline="2px solid yellow"
      bg="pong_bg_secondary"
      borderRadius={24}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('assets/img/BlackNoise.webp')`}
      bgSize="cover"
      bgRepeat="no-repeat"
      zIndex={2}
    >
      <Search />
      <Flex direction="row" gap={3} ml={10}>
        <IconButton
          display={{ base: "1", lg: "none" }}
          onClick={onToggleMobileSidebar}
          size="md"
          fontSize="md"
          bg={"pong_cl_primary"}
          color={"white"}
          borderRadius={8}
          aria-label="Open Sidebar Menu"
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
        />
        {isOpen && <MobileSidebar isOpen onToggle={onToggleMobileSidebar} />}

        <Notifications />
      </Flex>
    </Flex>
  );
};

export default Header;
