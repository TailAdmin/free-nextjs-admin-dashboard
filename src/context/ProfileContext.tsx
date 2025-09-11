"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileContextType {
  profileImage: string;
  setProfileImage: (image: string) => void;
  userName: string;
  setUserName: (name: string) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profileImage, setProfileImage] = useState("/images/user/owner.jpg");
  const [userName, setUserName] = useState("Musharof Chowdhury");

  return (
    <ProfileContext.Provider value={{ 
      profileImage, 
      setProfileImage, 
      userName, 
      setUserName 
    }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
}
