import { Avatar, Box, Flex, Icon, Stack, Text, useToast } from "@chakra-ui/react";
import { GiGamepadCross } from "react-icons/gi";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { useNavigate } from "react-router-dom";
import { useGetUserRecentGamesQuery } from "src/features/game/gameApi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import { BeatLoader } from "react-spinners";
dayjs.extend(relativeTime);

const RecentGames = (
  { userId }: { userId: number }
) => {
  const { currentUser } = useSelector((state: any) => state?.user);
  const { data: recentGames = [], isLoading, isFetching, isError } = useGetUserRecentGamesQuery(userId, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,

  });
  const navigate = useNavigate();
  const toast = useToast();

  if (isLoading || isFetching)
    return (
      <BeatLoader size={8} color="#FF8707" />
    )

  if (isError) {
    toast({
      title: "Error",
      description: "Error fetching recent games",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top",
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
      <Flex direction="row" align="center" justify="center" gap={1.5}>
        <Icon boxSize="22px" as={GiGamepadCross} color="white" />
        <Text
          fontSize="20px"
          fontWeight="semibold"
          color="whiteAlpha.900"
          letterSpacing={1}
        >
          Recent Games
        </Text>
      </Flex>
      <Box w="100%" h="100%" borderRadius="xl" p={1} mb={2} overflow="hidden">
        <ScrollArea.Root className="ScrollAreaRoot">
          <ScrollArea.Viewport className="ScrollAreaViewport">
            <Flex
              direction="column"
              w="100%"
              h="100%"
              p={2}
              gap={"10px"}
              justify="center"
              align="center"
              wrap="wrap"
              overflow="hidden"
              mr={2}
            >
              {recentGames?.length > 0 ? (
                recentGames
                  .slice()
                  ?.map(({ id, playerOne, playerTwo, createdAt, winnerId }) => (
                    <Flex
                      key={id}
                      direction="row"
                      justify="center"
                      align="start"
                      gap={"18px"}
                      borderColor={
                        winnerId === currentUser?.id
                          ? "green.400"
                          : "red.400"
                      }
                      borderWidth="1px"
                      borderRadius="15px"
                      p={2}
                    >
                      <Stack direction="column" spacing={2} align="center">
                        <Avatar
                          size="lg"
                          name={playerOne?.name}
                          src={playerOne?.avatar}
                          borderRadius="15px"
                        />
                        <Text
                          fontSize="12px"
                          fontWeight="medium"
                          color="whiteAlpha.800"
                        >
                          {playerOne?.username}
                        </Text>
                      </Stack>
                      <Stack direction="column" spacing={0.5} align="center">
                        <Text
                          fontSize="10px"
                          fontWeight="normal"
                          color="gray.400"
                        >
                          {dayjs(createdAt).fromNow()}
                        </Text>
                        <Text
                          fontSize="20px"
                          fontWeight="semibold"
                          color="whiteAlpha.900"
                        >
                          {`${playerOne?.score} - ${playerTwo?.score}`}
                        </Text>
                        <Text
                          fontSize="13px"
                          fontWeight="semibold"
                          color="pong_cl_primary"
                        >
                          {"FINISHED"}
                        </Text>
                      </Stack>
                      <Stack direction="column" spacing={2} align="center">
                        <Avatar
                          size="lg"
                          name={playerTwo?.name}
                          src={playerTwo?.avatar}
                          borderRadius="15px"
                          cursor={"pointer"}
                          onClick={() =>
                            navigate(`/profile/${playerTwo?.username}`)
                          }
                        />
                        <Text
                          fontSize="12px"
                          fontWeight="medium"
                          color="whiteAlpha.800"
                        >
                          {playerTwo?.username}
                        </Text>
                      </Stack>
                    </Flex>
                  ))
              ) : (
                <Text
                  fontSize="12px"
                  fontWeight="medium"
                  color="whiteAlpha.800"
                >
                  No games played
                </Text>
              )}
            </Flex>
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
    </Stack>
  );
};

export default RecentGames;
