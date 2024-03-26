import { useState, useEffect } from 'react';

const useFetchUserData = (token: unknown) => {
  const [userData, setUserData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('https://flexstay-backend.onrender.com/api/user', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const userData = await response.json();
        setUserData(userData);
        setLoading(false);
      } catch (error) {
        // setError(":error");
        setLoading(false);
      }
    };

    if (token) {
      fetchUserData();
    }
  }, [token]);

  return { userData, loading, error };
};

export default useFetchUserData;
