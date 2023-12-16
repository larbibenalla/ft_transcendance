import { apiSlice } from "src/app/api/apiSlice";

const gameApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getGames: builder.query({
      query: () => "games",
    }),
    getGameById: builder.query({
      query: (id) => `games/${id}`,
    }),
    acceptGameChallenge: builder.mutation({
      query: (id) => ({
        url: `users/${id}/challenge/accept`,
        method: "POST",
      }),
    }),
    getUserRecentGames: builder.query({
      query: (id) => `users/${id}/recentgames`,
    }),
  }),
});

export const {
  useGetGamesQuery,
  useGetGameByIdQuery,
  useAcceptGameChallengeMutation,
  useGetUserRecentGamesQuery,
} = gameApi;

export default gameApi;
