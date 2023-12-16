import { apiSlice } from "src/app/api/apiSlice";
import { createSocketClient } from "src/app/socket/client";
import channelMessagesApi from "../channelMessages/channelMessagesApi";

const channelsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllChannelsExceptPrivateOnes: builder.query({
      query: () => `/channels`,
      transformResponse: (channels: any) => {
        const filteredChannels = channels?.filter(
          (channel) => channel.privacy !== "private"
        );
        return filteredChannels;
      },
    }),
    getSingleChannelByName: builder.query({
      query: (name) => `channels?name=${name}`,
      async onCacheEntryAdded(
        _arg: any,
        { getState, updateCachedData, cacheDataLoaded, cacheEntryRemoved }: any
      ) {
        const socket = createSocketClient({
          api_url: import.meta.env.VITE_SERVER_CHAT_SOCKET_URL as string,
        });
        try {
          await cacheDataLoaded;
          socket.on("channel", (data) => {
            // console.log("incoming channel: ", data);
            const isDataBelongToThisUser = data.data.members.find(
              (m) => m.id === getState()?.user?.currentUser?.id
            );
            if (isDataBelongToThisUser) {
              updateCachedData((draft) => {
                const channel = draft?.find((c) => c.id === data?.data?.id);
                if (!channel?.id) {
                  draft?.unshift(data?.data);
                } else {
                  const channelIndex = draft?.findIndex(
                    (c) => c.id === data?.data?.id
                  );
                  if (channelIndex !== -1) {
                    draft[channelIndex] = data?.data;
                  }
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
    getChannelsByMemberId: builder.query({
      query: (currentUserId) => `channels/members/${currentUserId}`,
      async onCacheEntryAdded(
        _arg: any,
        { getState, updateCachedData, cacheDataLoaded, cacheEntryRemoved }: any
      ) {
        const socket = createSocketClient({
          api_url: import.meta.env.VITE_SERVER_CHAT_SOCKET_URL as string,
        });
        try {
          await cacheDataLoaded;
          socket.on("channel", (data) => {
            // // console.log("incoming channel data: ", data);
            const isDataBelongToThisUser = data.data.members.find(
              (m) => m.id === getState()?.user?.currentUser?.id
            );
            if (isDataBelongToThisUser) {
              updateCachedData((draft) => {
                const channel = draft?.find((c) => c.id === data?.data?.id);
                if (!channel?.id) {
                  draft?.unshift(data?.data);
                } else {
                  const channelIndex = draft?.findIndex(
                    (c) => c.id === data?.data?.id
                  );
                  if (channelIndex !== -1) {
                    draft[channelIndex] = data?.data;
                  }
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
    createChannel: builder.mutation({
      query: (data) => ({
        url: `/channels/create`,
        method: "POST",
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }: any) {
        // optimistic update
        const channelId = arg.id;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getChannelsByMemberId",
            getState()?.user.currentUser?.id,
            (draft) => {
              // console.log("draft: ", draft);
              const channel = draft?.find((c) => c.id === channelId);
              if (!channel?.id) {
                draft?.unshift(arg); // arg = channel data
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch (error) {
          // console.log("error: ", error);
          patchResult.undo();
        }
      },
    }),
    updateChannel: builder.mutation({
      query: ({ id, data }: { id: number; data: any }) => ({
        url: `/channels/${id}`,
        method: "PATCH",
        body: { ...data },
      }),
    }),
    editChannelInfo: builder.mutation({
      query: ({ id, data }) => ({
        url: `/channels/${id}/update`,
        method: "PATCH",
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }: any) {
        const channelId = arg.id;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.channelName,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (channelId && index !== -1) {
                draft[index].name = arg?.data?.name;
                draft[index].description = arg?.data?.description;
                draft[index].privacy = arg?.data?.privacy;
                draft[index].password = arg?.data?.password;
              }
            }
          )
        );

        const patchResult2 = dispatch(
          channelsApi.util.updateQueryData(
            "getChannelsByMemberId",
            getState()?.user.currentUser?.id,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (channelId && index !== -1) {
                draft[index].name = arg?.data?.name;
                draft[index].description = arg?.data?.description;
                draft[index].privacy = arg?.data?.privacy;
                draft[index].password = arg?.data?.password;
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          // console.log("error: ", error);
          patchResult.undo();
          patchResult2.undo();
        }
      },
    }),
    checkChannelPassword: builder.mutation({
      query: ({ channelId, data }) => ({
        url: `channels/${channelId}/checkpassword`,
        method: "POST",
        body: { ...data },
      }),
    }),
    deleteChannel: builder.mutation({
      query: ({ id }) => ({
        url: `/channels/${id}/delete`,
        method: "DELETE",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }: any) {
        const channelId = arg.id;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getChannelsByMemberId",
            getState()?.user.currentUser?.id,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (channelId && index !== -1) {
                draft?.splice(index, 1);
              }
            }
          )
        );

        const patchResult2 = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.name,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (channelId && index !== -1) {
                draft?.splice(index, 1);
              }
            }
          )
        );

        try {
          await queryFulfilled;
          await dispatch(
            channelMessagesApi.util.prefetch(
              "getMessagesByChannelName",
              arg?.name,
              {
                force: true,
              }
            )
          );

          await dispatch(
            channelMessagesApi.endpoints.getMessagesByChannelName.initiate(
              arg?.name,
              {
                forceRefetch: true,
              }
            )
          );
        } catch (error) {
          // console.log("error: ", error);
          patchResult.undo();
          patchResult2.undo();
        }
      },
    }),
    LeaveChannel: builder.mutation({
      query: ({
        channelId,
        memberId,
      }: {
        channelId: number;
        channelName?: string;
        memberId: number;
      }) => ({
        url: `channels/${channelId}/members/${memberId}/leave`,
        method: "PATCH",
      }),
      async onQueryStarted(arg, { dispatch, getState, queryFulfilled }: any) {
        const channelId = arg.channelId;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getChannelsByMemberId",
            getState()?.user.currentUser?.id,
            (draft) => {
              const channelIndex = draft?.findIndex((c) => c.id === channelId);
              if (channelIndex !== -1) {
                draft?.splice(channelIndex, 1);
              }
            }
          )
        );

        const patchResult2 = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.channelName,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (channelId && index !== -1) {
                draft?.splice(index, 1);
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          // console.log("error: ", error);
          patchResult.undo();
          patchResult2.undo();
        }
      },
    }),
    muteChannelMember: builder.mutation({
      query: ({ channelId, userId }) => ({
        url: `channels/${channelId}/members/${userId}/mute`,
        method: "PATCH",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }: any) {
        const channelId = arg.channelId;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.channelName,
            (draft) => {
              const channelIndex = draft?.findIndex((c) => c.id === channelId);
              if (channelIndex !== -1) {
                const mutedMemberIndex = draft[channelIndex].members.findIndex(
                  (m) => m.id === arg.userId
                );
                if (mutedMemberIndex !== -1) {
                  draft[channelIndex].members[mutedMemberIndex].isMuted = true;
                }
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          // console.log("error: ", error);
          patchResult.undo();
        }
      },
    }),
    unmuteChannelMember: builder.mutation({
      query: ({ channelId, userId }) => ({
        url: `/channels/${channelId}/members/${userId}/unmute`,
        method: "PATCH",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }: any) {
        const channelId = arg.channelId;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.channelName,
            (draft) => {
              const channelIndex = draft?.findIndex((c) => c.id === channelId);
              if (channelIndex !== -1) {
                const mutedMemberIndex = draft[channelIndex].members.findIndex(
                  (m) => m.id === arg.userId
                );
                if (mutedMemberIndex !== -1) {
                  draft[channelIndex].members[mutedMemberIndex].isMuted = false;
                }
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          // console.log("error: ", error);
          patchResult.undo();
        }
      },
    }),
    banChannelMember: builder.mutation({
      query: ({ channelId, userId }) => ({
        url: `channels/${channelId}/members/${userId}/ban`,
        method: "PATCH",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }: any) {
        const channelId = arg.channelId;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.channelName,
            (draft) => {
              const index = draft?.findIndex((c) => c.id === channelId);
              if (index !== -1) {
                draft[index].banned.push(arg.userId);
                const bannedMember = draft[index].members.find(
                  (member) => member?.id === arg.userId
                );
                if (bannedMember?.id) {
                  draft[index].members = draft[index].members.filter(
                    (member) => member?.id !== arg.userId
                  );
                }
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          // console.log("error: ", error);
          patchResult.undo();
        }
      },
    }),
    joinChannel: builder.mutation({
      query: ({ channelId, data }) => ({
        url: `channels/${channelId}/join`,
        method: "POST",
        body: { ...data },
      }),
      async onQueryStarted(
        _arg: any,
        { dispatch, getState, queryFulfilled }: any
      ) {
        try {
          await queryFulfilled;
          await dispatch(
            channelsApi.util.prefetch(
              "getChannelsByMemberId",
              getState()?.user.currentUser?.id,
              {
                force: true,
              }
            )
          );
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
    kickChannelMember: builder.mutation({
      query: ({ channelId, memberId }) => ({
        url: `channels/${channelId}/members/${memberId}/kick`,
        method: "PATCH",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }: any) {
        const channelId = arg.channelId;
        const patchResult = dispatch(
          channelsApi.util.updateQueryData(
            "getSingleChannelByName",
            arg?.channelName,
            (draft) => {
              const channelIndex = draft?.findIndex((c) => c.id === channelId);
              if (channelIndex !== -1) {
                const kickedMember = draft[channelIndex].members.find(
                  (m) => m?.id === arg.memberId
                );
                if (kickedMember?.id) {
                  draft[channelIndex].members = draft[
                    channelIndex
                  ].members.filter((m) => m?.id !== arg.memberId);
                }
              }
            }
          )
        );

        try {
          await queryFulfilled;
        } catch (error) {
          // console.log("error: ", error);
          patchResult.undo();
        }
      },
    }),
    onAddUserOrEditMember: builder.mutation({
      query: ({ channelId, data }) => ({
        url: `channels/${channelId}/members/edit`,
        method: "PATCH",
        body: { ...data },
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }: any) {
        try {
          await queryFulfilled;
          dispatch(
            await channelsApi.util.prefetch(
              "getSingleChannelByName",
              arg?.channelName,
              {
                force: true,
              }
            )
          );
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
  }),
});

export const {
  useGetAllChannelsExceptPrivateOnesQuery,
  useGetSingleChannelByNameQuery,
  useGetChannelsByMemberIdQuery,
  useCreateChannelMutation,
  useUpdateChannelMutation,
  useEditChannelInfoMutation,
  useCheckChannelPasswordMutation,
  useDeleteChannelMutation,
  useLeaveChannelMutation,
  useMuteChannelMemberMutation,
  useUnmuteChannelMemberMutation,
  useBanChannelMemberMutation,
  useJoinChannelMutation,
  useKickChannelMemberMutation,
  useOnAddUserOrEditMemberMutation,
} = channelsApi;

export default channelsApi;
