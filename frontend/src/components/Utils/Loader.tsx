import { HStack, Spinner } from "@chakra-ui/react";

function Loader({ size = "xl" }) {
  return (
    <HStack justify={"center"} mt={4}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="pong_cl_primary"
        size={size}
      />
    </HStack>
  );
}

export default Loader;
