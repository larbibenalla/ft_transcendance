import { Stack } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
const GameLayout = () => {
  return (
    <Stack
      pos="relative"
      w={"full"}
      h={"full"}
      minH={"800px"}

      justify="center"
      align="center"
      p={2}
      borderRadius={26}
    >
      <Outlet />
    </Stack>
  );
};

export default GameLayout;
