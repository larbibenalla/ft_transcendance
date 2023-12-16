import { Flex } from "@chakra-ui/react";
import { useSelector } from "react-redux";
import Friends from "src/components/Overview/Friends";
import Leaderboard from "src/components/Overview/Leaderboard/Leaderboard";
import Profile from "src/components/Overview/Profile";
import RecentGames from "src/components/Overview/RecentGames";
import useTitle from "src/hooks/useTitle";

function Overview() {
  useTitle("Ping Pong");
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  return (
    <Flex
      w="full"
      h="full"
      direction={{ base: "column", md: "row" }}
      justify={{ base: "start", md: "space-evenly" }}
      align={{ base: "center", md: "start" }}
      borderRadius={40}
      gap={4}
      p={4}
    >
      <Flex direction={{ base: "column", xl: "column" }} gap={4}>
        <Profile user={currentUser} />
        <Leaderboard />
      </Flex>
      <Flex direction={{ base: "column", xl: "column" }} gap={4}>
        <Friends />
        <RecentGames userId={currentUser?.id} />
      </Flex>
    </Flex>
  );
}
export default Overview;
