import { Avatar, Flex, Image, Text } from "@chakra-ui/react";
import "src/styles/scrollbar.css";

interface LeaderboardPlayer {
  id: number;
  name: string;
  username: string;
  avatar: string;
  level: number;
}

interface LeaderboardCardProps {
  player: LeaderboardPlayer;
}

const LeaderboardCard = ({ player }: LeaderboardCardProps) => {
  const { name, username, avatar, level } = player;
  return (
    <>
      <Flex direction="row" gap={3} align="center" pl={2} pr={2}>
        <Text fontSize="12px" fontWeight="bold" color="#312244">
          {level}
        </Text>
        <Avatar size="sm" name={name} src={avatar} />
        <Text fontSize="14px" fontWeight="medium" color="#312244">
          {username}
        </Text>
      </Flex>
      <Image
        src={"/assets/svg/rank_icon.svg"}
        alt="rankIcon"
        boxSize="1.5rem" // 1rem = 16px ,  1.5rem = 24px, 2 rem = 32px
      />
    </>
  );
};
export default LeaderboardCard;
