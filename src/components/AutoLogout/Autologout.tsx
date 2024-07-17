// components/AutoLogoutWrapper.tsx
import { ReactNode } from "react";
import { useAutoLogout } from "@/hooks/useAutoLogout";

type AutoLogoutWrapperProps = {
  children: ReactNode;
};

const AutoLogoutWrapper = ({ children }: AutoLogoutWrapperProps) => {
  const logout = () => {
    console.log("Logout function called");
    // Тут ваш код для выхода из системы
  };

  useAutoLogout({ logoutFunction: logout });

  return <>{children}</>;
};

export default AutoLogoutWrapper;
