import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";
import Members from "./Members";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import ChannelSettings from "./ChannelSettings";
import ChannelAbout from "./ChannelInfo";
dayjs.extend(relativeTime);

interface ChannelInfoAboutType {
  isOpenChannelInfo: boolean;
  onToggleChannelInfo: () => void;
  channel: {
    id: number;
    name: string;
    description: string;
    createdAt: string;
    ownerId: number;
    owner: {
      id: number;
      name: string;
    };
    members: [
      {
        id: number;
        name: string;
        username: string;
        avatar: string;
        role: string;
        isMuted: boolean;
      }
    ];
    banned: number[];
  };
}

const ChannelInfoAbout = ({
  isOpenChannelInfo,
  onToggleChannelInfo,
  channel,
}: ChannelInfoAboutType) => {
  return (
    <>
      <Modal
        isOpen={isOpenChannelInfo}
        onClose={onToggleChannelInfo}
        closeOnEsc={false}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent
          borderRadius={40}
          // maxH="350px"
          // maxW={{ base: "full", sm: "350px", md: 450 }}
          maxW={{ base: "350px", lg: "550px" }}
          mt={4}
          border="1px solid rgba(251, 102, 19, 0.3)"
          boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
          backdropFilter={"blur(20px)"}
          bgImage={`url('assets/img/BlackNoise.webp')`}
          bgSize="cover"
          bgRepeat="no-repeat"
          bg="transparent"
          //   w={{ base: "full", sm: "full", md: 820 }}
        >
          <ModalHeader># {channel?.name}</ModalHeader>
          <ModalCloseButton onClick={onToggleChannelInfo} />
          <ModalBody p={2} borderRadius={40}>
            <Stack
              mt={0}
              spacing={4}
              //  w={{ base: "full", sm: "full", md: 620 }}
              align="center"
              borderRadius={40}
              pl={3}
              pr={2}
              w="full"
            >
              <Flex
                direction="row"
                align="center"
                justify="center"
                mt={4}
                w="full"
              >
                <Tabs
                  variant="soft-rounded"
                  colorScheme="orange"
                  align="center"
                  isFitted
                  isLazy
                  w="full"
                >
                  <TabList>
                    <Tab
                      _selected={{ color: "white", bg: "orange.500" }}
                      _focus={{ boxShadow: "none" }}
                      _hover={{ color: "orange.500", bg: "white" }}
                      borderRadius={40}
                      letterSpacing={1}
                      fontSize="md"
                      fontWeight="bold"
                      px={4}
                      py={2}
                      mr={2}
                    >
                      About
                    </Tab>
                    <Tab
                      _selected={{ color: "white", bg: "orange.500" }}
                      _focus={{ boxShadow: "none" }}
                      _hover={{ color: "orange.500", bg: "white" }}
                      borderRadius={40}
                      letterSpacing={1}
                      fontSize="md"
                      fontWeight="bold"
                      px={4}
                      py={2}
                      mr={2}
                    >
                      Members
                    </Tab>
                    <Tab
                      _selected={{ color: "white", bg: "orange.500" }}
                      _focus={{ boxShadow: "none" }}
                      _hover={{ color: "orange.500", bg: "white" }}
                      borderRadius={40}
                      letterSpacing={1}
                      fontSize="md"
                      fontWeight="bold"
                      px={4}
                      py={2}
                      mr={2}
                    >
                      Settings
                    </Tab>
                  </TabList>
                  <TabPanels p={0}>
                    <TabPanel>
                      <ChannelAbout channel={channel} />
                    </TabPanel>
                    <TabPanel>
                      <Members channel={channel} />
                    </TabPanel>
                    <TabPanel>
                      <ChannelSettings
                        channel={channel}
                        onToggleChannelInfo={onToggleChannelInfo}
                      />
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </Flex>
            </Stack>
          </ModalBody>

          <ModalFooter p={4}>
            <Button
              bg={"white"}
              color={"orange.500"}
              letterSpacing={1}
              mr={3}
              onClick={onToggleChannelInfo}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChannelInfoAbout;
