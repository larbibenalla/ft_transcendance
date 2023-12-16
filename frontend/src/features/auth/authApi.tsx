import { apiSlice } from "../../app/api/apiSlice";
import { removeUser, setCurrentUser } from "../users/usersSlice";
import { setUserLoggedIn, setUserLoggedOut } from "./authSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    sendLogOut: builder.mutation({
      query: (userId) => ({
        url: "/auth/logout",
        method: "POST",
        body: { userId },
      }),
      async onQueryStarted(_arg: any, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          dispatch(setUserLoggedOut());
          dispatch(removeUser());
        } catch (err: any) {
          // console.log(`err: `, err);
          return;
        }
      },
    }),
    getNewAccessToken: builder.mutation({
      query: () => ({
        url: "/auth/refresh",
        method: "GET",
      }),
      async onQueryStarted(_arg: any, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            setUserLoggedIn({
              accessToken: result?.data?.accessToken,
              userId: Number(result?.data?.user.id),
            })
          );

          dispatch(setCurrentUser(result?.data?.user));
        } catch (err: any) {
          // console.log(`err: `, err);
          return;
        }
      },
    }),
  }),
});

export const { useSendLogOutMutation, useGetNewAccessTokenMutation } = authApi;

export default authApi;
