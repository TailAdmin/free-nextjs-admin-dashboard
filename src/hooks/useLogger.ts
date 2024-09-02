import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';

export const useLogger = () => {
    const [isLogging, setIsLogging] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [user, setUser] = useState<string | null>(null);
    
    useEffect(() =>
        {
            const fetchSession = async () => {
                const session = await getSession();
                if (session && session.user) {
                    setUser(session.user.name || null);
                }
            }
            fetchSession();
        },[]);


    const logMessage = async (message: string) => {
        setIsLogging(true);
        setError(null);


        try {     

    
           
            const response = await fetch('/api/logger', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user, message }),
            });


        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('An unknown error occurred');
            }
        } finally {
            setIsLogging(false);
        }
    };

    return { logMessage };
};