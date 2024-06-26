import { useState, useEffect } from "react";
import { UserData, UserDataResponse } from "@/types/user";

const useUserData = (): UserDataResponse => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/user`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response error");
        }
        return response.json();
      })
      .then((data) => {
        setUserData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Users data loading error:", error);
        setError(error);
        setIsLoading(false);
      });
  }, []);

  return { userData, isLoading, error };
};

export default useUserData;
