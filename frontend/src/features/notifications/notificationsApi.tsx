import { apiSlice } from "src/app/api/apiSlice";
import { createSocketClient } from "src/app/socket/client";

const notificationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => `notification`,
      async onCacheEntryAdded(
        _arg: any,
        {
          dispatch,
          getState,
          updateCachedData,
          cacheDataLoaded,
          cacheEntryRemoved,
        }: any
      ) {
        const socket = createSocketClient({
          api_url: import.meta.env.VITE_SERVER_NOTIFICATION_SOCKET_URL as string,
        });

        try {
          await cacheDataLoaded;
          socket.on("notification", (data) => {
            const currentUserId = getState()?.user?.currentUser?.id;
            const senderId = data.data.sender.id;
            const receiverId = data.data.receiverId;
            if (currentUserId !== senderId && currentUserId === receiverId) {
              updateCachedData((draft) => {
                const notification = draft?.find(
                  (n) => n.id === data?.data?.id
                );
                if (data?.data?.type === "message") {
                  if (
                    !notification?.id &&
                    getState()?.conversations?.conversationsId !==
                      data?.data?.conversationId
                  ) {
                    // // console.log("msg notification added to cache");
                    draft?.unshift(data?.data);
                  } else {
                    // // console.log("msg notification not added to cache, deleted");
                    dispatch(
                      notificationsApi?.endpoints?.deleteNotification?.initiate(
                        data?.data?.id
                      )
                    );
                  }
                } else if (
                  data?.data?.type === "friendRequest" ||
                  data?.data?.type === "gameRequest"
                ) {
                  if (!notification?.id) {
                    // // console.log("friend or game notification added to cache");
                    draft?.unshift(data?.data);
                  }
                }
              });
            }
          });
        } catch (error) {
          // console.log("error getNotifications endpoint: ", error);
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
    sendNotification: builder.mutation({
      query: (data) => ({
        url: `notification`,
        method: "POST",
        body: { ...data },
      }),
      async onQueryStarted(_arg: any, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
    deleteNotification: builder.mutation({
      query: (id) => ({
        url: `notification/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted(_arg: any, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
  }),
});

export const {
  useGetNotificationsQuery,
  useSendNotificationMutation,
  useDeleteNotificationMutation,
} = notificationsApi;

export default notificationsApi;
