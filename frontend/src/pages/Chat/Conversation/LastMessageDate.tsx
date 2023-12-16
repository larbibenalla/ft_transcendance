import { Text } from "@chakra-ui/react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useState } from "react";
dayjs.extend(relativeTime);

const LastMessageDate = ({ lastMessageCreatedAt }) => {
  const [updateTime, setUpdateTime] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setUpdateTime(!updateTime);
    }, 60000); // 1 minute
    return () => clearInterval(interval);
  }, [updateTime]);
  return (
    <Text
      overflow={"hidden"}
      fontSize={{
        base: "8px",
        sm: "9px",
        md: "9px",
      }}
      fontWeight="regular"
      color="whiteAlpha.500"
      alignSelf={"stretch"}
      whiteSpace={"nowrap"}
      letterSpacing={1}
    >
      {dayjs(lastMessageCreatedAt).fromNow()}
    </Text>
  );
};

export default LastMessageDate;
