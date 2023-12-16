import { apiSlice } from "src/app/api/apiSlice";
import { createSocketClient } from "src/app/socket/client";
import conversationApi from "../conversations/conversationsApi";
import notificationsApi from "../notifications/notificationsApi";
import { v4 as uuidv4 } from "uuid";

const messagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessagesByConversationId: builder.query({
      query: (conversationId: string) =>
        `conversations/messages?conversationId=${conversationId}&page=${1}`,
      // transformResponse: (response: any) => {
      //   const messages = response?.messages?.reverse();
      //   const totalPages = response?.totalPages;
      //   return { messages, totalPages };
      // },
      async onCacheEntryAdded(
        _arg: any,
        { getState, updateCachedData, cacheDataLoaded, cacheEntryRemoved }: any
      ) {
        const socket = createSocketClient({
          api_url: import.meta.env.VITE_SERVER_CHAT_SOCKET_URL as string,
        });
        const currentUserId = getState()?.user?.currentUser?.id;

        try {
          await cacheDataLoaded;
          socket.on("conversationMessage", (data) => {
            const sender = data.data.sender;
            const receiver = data.data.receiver;
            if (currentUserId === sender || currentUserId === receiver) {
              updateCachedData((draft) => {
                const message = draft?.messages?.find(
                  (m) => m.id === data?.data?.id
                );
                if (!message?.id) {
                  draft?.messages?.unshift(data?.data); // recent message on top
                }
              });
            }
          });
        } catch (error) {
          // console.log("error: ", error);
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
    getMoreMessagesByConversationId: builder.query({
      query: ({
        conversationId,
        page,
      }: {
        conversationId: string;
        page: number;
      }) =>
        `conversations/messages?conversationId=${conversationId}&page=${page}`,
      // transformResponse: (response: any) => {
      //   const messages = response?.messages?.reverse();
      //   const totalPages = response?.totalPages;
      //   return { messages, totalPages };
      // },
      async onQueryStarted(arg, { dispatch, queryFulfilled }: any) {
        const { conversationId } = arg;
        try {
          const result = await queryFulfilled;
          const messages = result?.data?.messages;
          const totalPages = result?.data?.totalPages;
          if (messages?.length > 0) {
            dispatch(
              messagesApi.util.updateQueryData(
                "getMessagesByConversationId",
                conversationId,
                (draft) => {
                  draft?.messages?.push(...messages); // older messages on bottom
                  draft.totalPages = Number(totalPages);
                }
              )
            );
          }
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
    addMessage: builder.mutation({
      query: (msgData: {
        id: string;
        conversationId: string;
        sender: number;
        receiver: number;
        content: string;
        lastMessageCreatedAt: number;
      }) => ({
        url: `conversations/addmessage`,
        method: "POST",
        body: { ...msgData },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }: any) {
        const messageData = arg;
        const { conversationId, content, lastMessageCreatedAt } = messageData;
        const patchResultMsg = dispatch(
          messagesApi?.util?.updateQueryData(
            "getMessagesByConversationId",
            conversationId.toString(),
            (draft) => {
              draft?.messages?.unshift(messageData);
            }
          )
        );
        const patchResultCOnv = dispatch(
          conversationApi?.util?.updateQueryData(
            "getConversations",
            getState()?.user?.currentUser?.email,
            (draft) => {
              const conversation = draft?.find((c) => c.id === conversationId);
              if (conversation?.id) {
                conversation.lastMessageContent = content;
                conversation.lastMessageCreatedAt = lastMessageCreatedAt;
                draft = { ...draft, ...conversation };
              }
            }
          )
        );
        try {
          await queryFulfilled;
          dispatch(
            conversationApi.endpoints.updateConversation.initiate({
              id: conversationId,
              message: {
                lastMessageContent: content,
                lastMessageCreatedAt: lastMessageCreatedAt,
              },
            })
          );
          dispatch(
            notificationsApi.endpoints.sendNotification.initiate({
              id: uuidv4(),
              conversationId: messageData.conversationId,
              type: "message",
              senderId: messageData.sender,
              receiverId: messageData.receiver,
            })
          );
        } catch (error) {
          // console.log("error : ", error);
          patchResultMsg.undo();
          patchResultCOnv.undo();
        }
      },
    }),
    createMessage: builder.mutation({
      query: (data: {
        id: string;
        conversationId: string;
        sender: number;
        receiver: number;
        content: string;
        lastMessageCreatedAt: number;
      }) => ({
        url: `conversations/addmessage`,
        method: "POST",
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }: any) {
        const messageData = arg;
        const { conversationId } = messageData;
        // optimistic update
        const patchResultMsg = dispatch(
          messagesApi?.util?.updateQueryData(
            "getMessagesByConversationId",
            conversationId,
            (draft) => {
              draft?.messages?.unshift(messageData);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          // console.log("error : ", error);
          patchResultMsg.undo();
        }
      },
    }),
  }),
});

export const {
  useGetMessagesByConversationIdQuery,
  useAddMessageMutation,
  useCreateMessageMutation,
  useGetMoreMessagesByConversationIdQuery,
} = messagesApi;

export default messagesApi;
