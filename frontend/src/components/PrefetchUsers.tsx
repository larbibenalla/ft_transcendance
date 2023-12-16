import store from "src/app/store";
import { Outlet } from "react-router-dom";
import { useGetCurrentUserQuery } from "src/features/users/usersApi";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setOnlineUsers } from "src/features/users/usersSlice";
import { createSocketClient } from "src/app/socket/client";
import { BeatLoader } from "react-spinners";

const PrefetchUsers = () => {
  const dispatch = useDispatch();
  const [skip, setSkip] = useState(true);
  const {
    isLoading: isLoadingCurrentUser,
    isUninitialized,
    isFetching,
  } = useGetCurrentUserQuery(store.getState().auth.userId, {
    skip,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    const socket = createSocketClient({
      api_url: import.meta.env.VITE_SERVER_USER_SOCKET_URL as string,
    });
    socket.on("connect", () => {
      socket.on("onlineUsers", (data) => {
        setSkip(false);
        dispatch(setOnlineUsers(data?.data));
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  return isLoadingCurrentUser || isUninitialized || isFetching ? (
    <BeatLoader size={8} color="#FF8707" />
  ) : (
    <Outlet />
  );
};

export default PrefetchUsers;
