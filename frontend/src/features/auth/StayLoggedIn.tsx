import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useGetNewAccessTokenMutation } from "./authApi";
import { BeatLoader } from "react-spinners";

const StayLoggedIn = () => {
  const accessToken = useSelector((state: any) => state?.auth?.accessToken);
  const navigate = useNavigate();
  const [
    getNewAccessToken,
    { isLoading, isUninitialized, isError, isSuccess },
  ] = useGetNewAccessTokenMutation();

  useEffect(() => {
    const getNewAccessTokenAsync = async () => {
      try {
        await getNewAccessToken({}).unwrap();
      } catch (err: any) {
        return;
      }
    };

    if (!accessToken) {
      getNewAccessTokenAsync();
    } else {
      navigate("/", { replace: true });
    }
  }, []);

  if ((isLoading || isUninitialized) && !accessToken) return <BeatLoader size={8} color="#FF8707" />;

  if (isError) return <Outlet />;

  if (isSuccess || accessToken) return <Navigate to="/" replace />;

  return <Outlet />;
};

export default StayLoggedIn;
