import { Box, Flex, Icon, Stack, Text, useToast } from "@chakra-ui/react";
import { MdLeaderboard } from "react-icons/md";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { useGetLeaderboardQuery } from "src/features/leaderboard/leaderboardApi";
import LeaderboardCard from "./LeaderboardCard";
import TopThreePlayers from "./TopThreePlayers";
import { BeatLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";

interface LeaderboardPlayer {
  id: number;
  name: string;
  username: string;
  avatar: string;
  level: number;
  WonGames: number;
}

const Leaderboard = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const {
    data: leaderboardData,
    isLoading,
    isFetching,
    isError,
    // refetch,
  } = useGetLeaderboardQuery({}, { refetchOnMountOrArgChange: true });

  if (isError) {
    toast({
      title: "Error",
      description: "Error happened during fetching leaderboard.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }

  return (
    <Stack
      direction={{ base: "column" }}
      w={{ base: "380px" }}
      h={{ base: "600px" }}
      p={4}
      spacing="12px"
      borderRadius={24}
      border="1px solid rgba(251, 102, 19, 0.1)"
      boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
      backdropFilter={"blur(20px)"}
      bgImage={`url('assets/img/BlackNoise.webp')`}
      bgSize="cover"
      bgRepeat="no-repeat"
    >
      {isFetching || isLoading ? (
        <BeatLoader size={8} color="#FF8707" />
      ) : (
        <>
          <Flex
            direction="row"
            align="center"
            justify="center"
            gap={1.5}
            mt={0}
          >
            <Icon boxSize="22px" as={MdLeaderboard} color="white" />
            <Text
              fontSize="20px"
              fontWeight="semibold"
              color="whiteAlpha.900"
              letterSpacing={1}
            >
              Leaderboard
            </Text>
          </Flex>
          <TopThreePlayers top3Players={leaderboardData?.slice(0, 3)} />
          <Box
            w="100%"
            h="100%"
            borderRadius="xl"
            p={2}
            mb={0}
            overflow="hidden"
          >
            <ScrollArea.Root className="ScrollAreaRoot">
              <ScrollArea.Viewport className="ScrollAreaViewport">
                <Stack
                  id="scrollableStack"
                  gap={"12px"}
                  justify="center"
                  align="center"
                  wrap="wrap"
                  overflow="hidden"
                >
                  {leaderboardData?.length > 0 && (
                    leaderboardData?.slice()?.sort((a,b) => b.WonGames - a.WonGames)?.slice(0, 3)?.map((player: LeaderboardPlayer, i: number) => (
                      <Flex
                        key={player?.id}
                        direction="row"
                        justify="space-between"
                        w="220px"
                        h="40px"
                        px={2}
                        gap={2}
                        borderRadius="22px"
                        align="center"
                        cursor={"pointer"}
                        bgColor={
                          i == 0
                            ? "#FFCA28"
                            : i == 1
                              ? "#F4F4F4"
                              : i == 2
                                ? "#FF8228"
                                : "rgba(255, 255, 255, 0.2)"
                        }
                        onClick={() => navigate(`/profile/${player?.username}`)}
                      >

                        <LeaderboardCard player={player} />
                      </Flex>
                    ))
                  )
                      }
                  {leaderboardData?.length > 0 ? (
                    leaderboardData?.slice(3)?.sort((a,b) => b.WonGames - a.WonGames)?.map((player: LeaderboardPlayer) => (
                      <Flex
                        key={player?.id}
                        direction="row"
                        justify="space-between"
                        w="220px"
                        h="40px"
                        px={2}
                        gap={2}
                        borderRadius="22px"
                        align="center"
                        cursor={"pointer"}
                        bgColor={
                          "rgba(255, 255, 255, 0.2)"
                        }
                        onClick={() => navigate(`/profile/${player?.username}`)}
                      >

                        <LeaderboardCard player={player} />
                      </Flex>
                    ))
                  ) : (
                    <Text
                      fontSize="14px"
                      fontWeight="semibold"
                      color="whiteAlpha.800"
                    >
                      Leaderboard is empty
                    </Text>
                  )}
                </Stack>
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
          </Box>
        </>
      )}
    </Stack>
  );
};

export default Leaderboard;
