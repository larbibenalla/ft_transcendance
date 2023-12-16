import { apiSlice } from "src/app/api/apiSlice";
import channelsApi from "../channels/channelsApi";
import { createSocketClient } from "src/app/socket/client";

const channelMessagesApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMessagesByChannelName: builder.query({
      query: (channelName) => `/channels/messages?channelName=${channelName}`,
      async onCacheEntryAdded(
        _arg: any,
        { getState, updateCachedData, cacheDataLoaded, cacheEntryRemoved }: any
      ) {
        const currentUser = getState()?.user?.currentUser;
        const socket = createSocketClient({
          api_url: import.meta.env.VITE_SERVER_CHAT_SOCKET_URL as string,
        });

        try {
          await cacheDataLoaded;
          socket.on("channelMessage", (data) => {
            // console.log("incoming msg: ", data);
            if (data?.data?.receivers.includes(currentUser?.id)) {
              updateCachedData((draft) => {
                // if (draft?.map(m => m?.id)?.includes(data?.data?.channelId))
                // {
                  const message = draft?.find((m) => m.id === data?.data?.id);
                  const channel = draft?.find((m) => m.channelId === data?.data?.channelId);
                  // console.log("msg id channnel ", message?.channelId)
                   // console.log("channel ", channel);
                  if (!message?.id && channel)
                  {
                    // console.log("in")                    
                    draft?.push(data?.data);
                  }
                // }
              });
            }
          });
        } catch (error) {
          // console.log("error : ", error);
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
    createChannelMessage: builder.mutation({
      query: (msgData) => ({
        url: `/channels/addmessage`,
        method: "POST",
        body: { ...msgData },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }: any) {
        const message = arg;
        const { channelName } = message;
        // console.log("channelsname ", channelName);
        // optimistic update
        const patchResultMsg = dispatch(
          channelMessagesApi?.util?.updateQueryData(
            "getMessagesByChannelName",
            channelName,
            (draft) => {
              draft?.push(message);
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          // console.log("error : ", error);
          await dispatch(
            channelsApi.util.prefetch(
              "getChannelsByMemberId",
              getState()?.user?.currentUser?.id,
              {
                force: true,
              }
            )
          );
          patchResultMsg.undo();
        }
      },
    }),
  }),
});

export const {
  useGetMessagesByChannelNameQuery,
  useCreateChannelMessageMutation,
} = channelMessagesApi;

export default channelMessagesApi;
