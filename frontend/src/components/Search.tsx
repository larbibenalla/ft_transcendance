import { SearchIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Flex,
  InputGroup,
  InputLeftElement,
  Text,
  useToast,
} from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";
import { useNavigate } from "react-router-dom";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import "src/styles/scrollbar.css";
import { BeatLoader } from "react-spinners";
import { useGetUsersQuery } from "src/features/users/usersApi";
import { useState } from "react";

const Search = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const [query, setQuery] = useState("");

  const {
    data: users = [] as any,
    isLoading,
    isFetching,
    isError,
  } = useGetUsersQuery({
    refetchOnMountOrArgChange: true,
    // refetchOnFocus: true,
    // refetchOnReconnect: true,
  });

  if (isError) {
    toast({
      title: "Error",
      description: "Something went wrong",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  }

  return (
    <Flex direction="row" align="center" justify="center"
    >
      <AutoComplete
        isLoading={isLoading || isFetching}
        openOnFocus
        listAllValuesOnFocus
        closeOnSelect={true}
        flip={false}

      >
        <InputGroup mr={4}>
          <InputLeftElement
            pointerEvents="none"
            children={<SearchIcon />}
            bg="pong_cl_primary"
            color="white"
            px={2}
            py={1}
            border="1px solid var(--white, #FFF)"
            borderRadius="50%"
            cursor="pointer"
          />
          <AutoCompleteInput
            onChange={(e) => setQuery(e.target.value)}
            value={query}
            ml={2}
            flex={1}
            variant="filled"
            bg="pong_bg.400"
            type="text"
            color="white"
            placeholder="Search for a player"
            _placeholder={{
              fontSize: 12,
              letterSpacing: 0.5,
              fontWeight: "light",
              opacity: 0.7,
              color: "gray.400",
            }}
            loadingIcon={<BeatLoader size={8} color="#FF8707" />}
          />
        </InputGroup>

        <AutoCompleteList
          loadingState={<BeatLoader color="#FF8707" />}
          style={{
            borderRadius: "24px",
            border: "1px solid rgba(251, 102, 19, 0.39)",
            boxShadow: "0px 4px 24px -1px rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(20px)",
            backgroundImage: "url('assets/img/BlackNoise.webp')",
            bgSize: "cover",
            bgRepeat: "no-repeat",
            backgroundColor: "#FF7F00",
            backgroundBlendMode: "normal",
          }}
          closeOnSelect={false}
          p={1}
          mr={2}
          w="full"

        >
          <ScrollArea.Root
            style={{
              width: "100%",
              height: "100px",
            }}
            className="ScrollAreaRoot"
          >
            <ScrollArea.Viewport className="ScrollAreaViewport">
              {users?.length > 0 &&
                users?.map((user) => (
                  <AutoCompleteItem
                    key={user?.id}
                    value={user?.name}
                    textTransform="capitalize"
                    bg="transparent"
                    borderRadius={8}
                    my={1}
                    _hover={{
                      bg: "pong_bg.400",
                    }}
                    _focus={{
                      backgroundColor: "transparent",
                    }}
                    _selected={{
                      backgroundColor: "transparent",
                    }}
                  >
                    <Flex
                      direction="row"
                      justify="space-between"
                      align="center"
                      w="full"
                    >
                      <Flex
                        direction="row"
                        gap="3px"
                        align="center"
                        w={"full"}
                        onClick={() => {
                          setQuery("");
                          navigate(`/profile/${user?.username}`, {
                            state: { user },
                          });
                        }}
                      >
                        <Avatar
                          size="sm"
                          name={user?.name}
                          src={user?.avatar}
                          borderWidth="1px"
                        />
                        <Text
                          color="white"
                          fontSize="14px"
                          fontWeight="medium"
                          ml={2}
                          flex={1}
                        >
                          {user?.name}
                        </Text>
                      </Flex>
                    </Flex>
                  </AutoCompleteItem>
                ))}
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
        </AutoCompleteList>
      </AutoComplete>
    </Flex>
  );
};

export default Search;
