import { apiSlice } from "src/app/api/apiSlice";

const leaderboardApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLeaderboard: builder.query({
      query: () => "users/leaderboard",
    }),
    getRecentGames: builder.query({
      query: (id) => `users/${id}/recentgames/`,
    }),
  }),
});

export const { useGetLeaderboardQuery } = leaderboardApi;

export default leaderboardApi;
