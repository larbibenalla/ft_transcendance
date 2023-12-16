import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUserLoggedOut } from "src/features/auth/authSlice";

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL as string,
  credentials: "include", // include cookies, credentials,
  prepareHeaders: (headers, { getState }: any) => {
    const accessToken = getState().auth.accessToken;
    if (accessToken) {
      headers.set("authorization", `Bearer ${accessToken}`);
    }
    return headers;
  },
});

const baseQueryJWTverify = async (args: any, api: any, extraOptions: any) => {
  const originalQuery = await baseQuery(args, api, extraOptions);
  if (originalQuery?.error?.status === 401) {
    //  access token  expired.  we get new access token using the refresh token.
    const retryQueryWithRefreshToken = await baseQuery(
      "/auth/refresh",
      api,
      extraOptions
    );
    if (retryQueryWithRefreshToken?.data) {
      // success to get new access token, we retry the original request, but with the new access token.
      const retryQueryWithNewToken = await baseQuery(args, api, extraOptions);
      return retryQueryWithNewToken;
    } else {
      // we failed to get a new access token, send logout, then redirect to login.
      if (retryQueryWithRefreshToken?.error?.status === 401) {
        api.dispatch(setUserLoggedOut());
      }
      return retryQueryWithRefreshToken;
    }
  }
  return originalQuery;
};

export const apiSlice = createApi({
  baseQuery: baseQueryJWTverify,
  tagTypes: ["getUsers", "getCurrentUser"],
  endpoints: () => ({}),
});
