import { Box, Flex, Link, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import "/src/styles/loginButtonStyles.css";

const MotionBox = motion(Box);

const Login = () => {
  const handleLogin = async () => {
    window.location.replace(
      `${import.meta.env.VITE_API_URL}/auth/login
        `
    );
  };

  return (
    <Flex
      pos="relative"
      justify="center"
      align="center"
      w={{ base: "full", md: 750, lg: 972, xl: 1260 }}
      minH={{ base: 750 }}
      bg="pong_bg_primary"
    >
      <MotionBox
        pos="absolute"
        w={{ base: "300px", sm: "400px", md: "550px" }}
        h={{ base: "300px", sm: "400px", md: "550px" }}
        bgImage="url('assets/img/cropped_circle_pong.webp')"
        bgPosition="center"
        bgSize="contain"
        bgRepeat="no-repeat"
        bgBlendMode="lighten"
        animate={{ rotate: 360 }}
        transition={{ ease: "linear", duration: 5, repeat: Infinity }}
        opacity={0.9}
      />
      <VStack
        pos="relative"
        justify="center"
        align="center"
        // w={{ base: "200px", sm: "300px", md: "400px" }}
        // h={{ base: "90px", sm: "120px", md: "168px" }}
        borderRadius={{ base: "15px", sm: "25px", md: "40px" }}
        border="1px solid rgba(251, 102, 19, 0.1)"
        boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
        backdropFilter={"blur(20px)"}
        bgImage={`url('assets/img/BlackNoise.webp')`}
        bgSize="cover"
        bgRepeat="no-repeat"
        p={{ base: 5 }}
      >
        <Link color="#000" onClick={handleLogin}>
          <span></span>
          <span></span>
          <span></span>
          <span></span>
          CLICK TO EXPLORE
        </Link>
      </VStack>
    </Flex>
  );
};

export default Login;
