import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  useToast,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useDeleteConversationMutation } from "src/features/conversations/conversationsApi";

const DeleteConversationAlert = ({
  conversationId,
  isOpen,
  onClose,
  cancelRef,
}) => {
  const navigate = useNavigate();
  const toast = useToast();
  const [deleteConversation, { isLoading }] = useDeleteConversationMutation();

  const handleDelete = async () => {
    try {
      await deleteConversation(conversationId).unwrap();
      navigate("/chat", { replace: true });
      toast({
        title: "Conversation deleted.",
        description: "Conversation deleted successfully.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      // console.log("error: ", error);
      toast({
        title: "Error",
        description: "Error happened during deleting conversation.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }

    onClose();
    navigate("/chat", { replace: true });
  };

  return (
    <>
      {/* <Button colorScheme="red" onClick={onOpen}>
        Delete Conversation
      </Button> */}
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent
            border="1px solid rgba(251, 102, 19, 0.3)"
            boxShadow="0px 4px 24px -1px rgba(0, 0, 0, 0.35)"
            backdropFilter={"blur(20px)"}
            bgImage={`url('assets/img/BlackNoise.webp')`}
            bgSize="cover"
            bgRepeat="no-repeat"
            bg="transparent"
          >
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Conversation
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This will remove the conversation from your inbox
              including all its messages.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={handleDelete}
                ml={3}
                isLoading={isLoading}
                isDisabled={isLoading}
              >
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default DeleteConversationAlert;
