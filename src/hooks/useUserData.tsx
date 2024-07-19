
import { useState, useEffect } from "react";
import { UserData, UserDataResponse } from "@/types/user";
import { useAppSession } from "@/entities/session/use-app-session";

const useUserData = (): UserDataResponse => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const session = useAppSession();
  useEffect(() => {

    if (session.status === 'unauthenticated') {
      setUserData(null);
      setIsLoading(false);
    }
    else if (session.status === 'loading') {
      setIsLoading(true);
      setError(null);
    }
    else if (session.status === 'authenticated') {
      try {
        // Предположим, что данные пользователя уже в сессии
        const user = session.data?.user;
        if (user) {
          const userData: UserData = {
            fullname: user.name || null,
            email: user.email,
            image: user.image,
          };
          setUserData(userData);
        } else {
          setUserData(null);
        }
        setIsLoading(false);
      } catch (error) {
        console.error("User data loading error:", error);
        setError("Failed to load user data");
        setIsLoading(false);
      }  
    
    }
 
  }, [session]);

  return { userData, isLoading, error };
};

export default useUserData;
