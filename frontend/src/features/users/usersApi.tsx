import { apiSlice } from "src/app/api/apiSlice";
import { setCurrentUser } from "./usersSlice";
import { createSocketClient } from "src/app/socket/client";

const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder: any) => ({
    getUsers: builder.query({
      query: () => "users",
      providesTags: ["getUsers"],
      async onCacheEntryAdded(_arg: any, {
        updateCachedData,
        cacheDataLoaded,
        cacheEntryRemoved,
      }: any) {
        const socket = createSocketClient({
          api_url: import.meta.env.VITE_SERVER_USER_SOCKET_URL as string,
        });
        try {
          await cacheDataLoaded;
          socket.on("newuser", (data: any) => {
            updateCachedData((draft: any) => {
              const user = draft?.find((u: any) => u.id === data?.data?.id);
              if (!user?.id) draft?.push(data?.data);
            });

          });
        } catch (error) {
          // console.log("error: ", error);
          await cacheEntryRemoved;
          socket.disconnect();
        }
      },
    }),
    getUserById: builder.query({
      query: (id: number) => `users/user/${id}`,
    }),
    getUserByUsername: builder.query({
      query: (username: string) => `users/username/${username}`,
      async onQueryStarted(_arg: any, { queryFulfilled }: any) {
        try {
          await queryFulfilled;
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
    getUserByEmail: builder.query({
      query: (email: string) => `users/email/${email}`,
      async onQueryStarted(_arg: any, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
    getCurrentUser: builder.query({
      query: (currentUserId: number) => ({
        url: `/users/currentuser/${currentUserId}`,
        method: "GET",
        // mode: "no-cors"
      }),
      providesTags: ["getCurrentUser"],
      async onQueryStarted(_arg: any, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
    updateUserSettings: builder.mutation({
      query: ({ id, formData }: { id: number; formData: FormData }) => ({
        url: `users/${id}/settings`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["getUsers"],
      async onQueryStarted(_arg: any, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          // console.log("error: ", error);

        }
      },
    }),
    getFriends: builder.query({
      query: (id: number) => `users/${id}/friends`,
    }),
    addFriend: builder.mutation({
      query: ({ currentUserId, friendId }) => ({
        url: `users/${currentUserId}/friends`,
        method: "POST",
        body: { friendId },
      }),
      async onQueryStarted(_arg: any, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
    deleteFriend: builder.mutation({
      query: ({
        currentUserId,
        friendId,
      }: {
        currentUserId: number;
        friendId: number;
      }) => ({
        url: `users/${currentUserId}/friends/${friendId}`,
        method: "DELETE",
      }),
      async onQueryStarted(_arg: any, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
    generateOTP: builder.mutation({
      query: (userId: number) => ({
        url: `otp/generate`,
        method: "POST",
        body: { userId },
      }),
    }),
    verifyOTP: builder.mutation({
      query: ({ userId, userPin }: { userId: number; userPin: string }) => ({
        url: `otp/verify`,
        method: "POST",
        body: { userId, userPin },
      }),
      async onQueryStarted(_arg: any, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
    validateOTP: builder.mutation({
      query: ({ userId, userPin }: { userId: number; userPin: string }) => ({
        url: `otp/validate`,
        method: "POST",
        body: { userId, userPin },
      }),
      async onQueryStarted(_arg: any, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
    disableOTP: builder.mutation({
      query: (userId: number) => ({
        url: `otp/disable`,
        method: "POST",
        body: { userId },
      }),
      async onQueryStarted(_arg: any, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
    checkProfileCompleted: builder.mutation({
      query: (userId: number) => ({
        url: `users/profile-check-completed`,
        method: "POST",
        body: { userId },
      }),
      async onQueryStarted(_arg: any, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
    blockUser: builder.mutation({
      query: ({
        id,
        blockedUserId,
      }: {
        id: number;
        blockedUserId: number;
      }) => ({
        url: `users/${id}/blockuser`,
        method: "PATCH",
        body: { blockedUserId },
      }),
      async onQueryStarted(_arg: any, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
    unblockUser: builder.mutation({
      query: ({
        id,
        blockedUserId,
      }: {
        id: number;
        blockedUserId: number;
      }) => ({
        url: `users/${id}/unblockuser`,
        method: "PATCH",
        body: { blockedUserId },
      }),
      async onQueryStarted(_arg: any, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          const user = result?.data;
          await dispatch(setCurrentUser(user));
        } catch (error) {
          // console.log("error: ", error);
        }
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useGetUserByUsernameQuery,
  useGetUserByEmailQuery,
  useGetFriendsQuery,
  useAddFriendMutation,
  useGetCurrentUserQuery,
  useDeleteFriendMutation,
  useUpdateUserSettingsMutation,
  useGenerateOTPMutation,
  useVerifyOTPMutation,
  useValidateOTPMutation,
  useDisableOTPMutation,
  useCheckProfileCompletedMutation,
  useBlockUserMutation,
  useUnblockUserMutation,
} = usersApi;

export default usersApi;
