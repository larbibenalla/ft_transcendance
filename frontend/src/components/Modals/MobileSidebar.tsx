import {
  Box,
  Collapse,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerOverlay,
  Stack,
} from "@chakra-ui/react";
import { useEffect } from "react";
import Sidebar from "src/components/Sidebar";

const MobileSidebar = ({ isOpen, onToggle }) => {
  useEffect(() => {
    window.addEventListener("resize", onToggle);
    return () => {
      window.removeEventListener("resize", onToggle);
    };
  }, []);
  return (
    <Box
      display={{ base: "flex", lg: "none" }}
      pos="absolute"
      top="0"
      left="0"
      w="full"
      h="full"
      bg="blackAlpha.500"
    >
      <Collapse in={isOpen} animateOpacity>
        <Drawer
          autoFocus={false}
          size="menu"
          isOpen={isOpen}
          placement="left"
          onClose={onToggle}
        >
          <DrawerOverlay>
            <DrawerContent
              borderRadius={10}
              style={{
                width: "130px",
                padding: "0px",
                margin: "0px",
              }}
              bg="pong_bg_secondary"
            >
              <DrawerBody bg="pong_bg_secondary" borderRadius={10} p={0} m={0}>
                <Stack
                  h="full"
                  justify="start"
                  spacing={8}
                  pt={4}
                  pb={6}
                  borderRadius={24}
                  bg="pong_bg_secondary"
                  border="1px solid rgba(251, 102, 19, 0.1)"
                  boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
                  backdropFilter={"blur(20px)"}
                  bgImage={`url('assets/img/BlackNoise.webp')`}
                  bgSize="cover"
                  bgRepeat="no-repeat"
                >
                  <Sidebar />
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
      </Collapse>
    </Box>
  );
};

export default MobileSidebar;
