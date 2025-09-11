'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  userName: string;
  userEmail: string;
  updateUser: (name: string, email?: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState('Musharof Chowdhury');
  const [userEmail, setUserEmail] = useState('randomuser@pimjo.com');

  const updateUser = (name: string, email: string = userEmail) => {
    setUserName(name);
    if (email) setUserEmail(email);
  };

  return (
    <UserContext.Provider value={{ userName, userEmail, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
