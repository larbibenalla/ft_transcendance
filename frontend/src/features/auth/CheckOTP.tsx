import { Outlet } from "react-router-dom";
import useOTP from "src/hooks/useOTP";
import TwoFactorAccessBlocker from "src/components/Modals/TwoFactorAccessBlocker";
import { useDisclosure } from "@chakra-ui/react";

const CheckOTP = () => {
  const isOTPEnabledAndValidated = useOTP();
  const { onToggle } = useDisclosure({ defaultIsOpen: false });
  // // console.log(`isOTPEnabledAndValidated: ${isOTPEnabledAndValidated}`);

  let content;

  if (isOTPEnabledAndValidated) {
    content = (
      <TwoFactorAccessBlocker
        isOTPAccessBlockerOpen={true}
        onOTPAccessBlockerToggle={onToggle}
      />
    );
  } else {
    content = <Outlet />;
  }

  return content;
};

export default CheckOTP;
