import { Flex, Link } from "@chakra-ui/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import useTitle from "src/hooks/useTitle";
import { useLottie } from "lottie-react";
import animationData from "src/assets/lottie/404.json" assert { type: "json" };
import { useEffect } from "react";

const style = {
  width: "100%",
  height: "100%",
};
const options = {
  loop: true,
  autoplay: true,
  animationData,
};

const NotFoundPage = () => {
  useTitle("404 Not Found");
  const navigate = useNavigate();

  const { View } = useLottie(options, style);

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate("/");
    }, 1000);
    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <>
      <Flex
        justifyContent={"center"}
        align="center"
        w="full"
        h="full"
        bg="white"
      >
        <Link
          pos="relative"
          as={RouterLink}
          w="100vw"
          h="100vh"
          cursor="pointer"
          overflow="hidden"
        >
          {View}
        </Link>
      </Flex>
    </>
  );
};

export default NotFoundPage;
