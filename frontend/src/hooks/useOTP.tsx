import { useSelector } from "react-redux";

export default function useOTP() {
  const currentUser = useSelector((state: any) => state?.user?.currentUser);
  return currentUser?.is_otp_enabled && !currentUser?.is_otp_validated
    ? true
    : false;
}
