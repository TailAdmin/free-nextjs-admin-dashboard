import { useEffect } from "react";
import AutoLogoutWrapper from "@/components/AutoLogout/Autologout";

type UseAutoLogoutProps = {
  logoutFunction: () => void;
  timeout?: number; // Теперь таймаут является необязательным
};

export const useAutoLogout = ({
  logoutFunction,
  timeout,
}: UseAutoLogoutProps) => {
  useEffect(() => {
    const effectiveTimeout =
      timeout || Number(process.env.AUTO_LOGOUT_TIMEOUT || 60000);
    console.log(effectiveTimeout);
    let timeoutId: NodeJS.Timeout;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(logoutFunction, effectiveTimeout);
    };

    window.addEventListener("mousemove", resetTimer);
    window.addEventListener("keypress", resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", resetTimer);
      window.removeEventListener("keypress", resetTimer);
    };
  }, [logoutFunction, timeout]);
};
