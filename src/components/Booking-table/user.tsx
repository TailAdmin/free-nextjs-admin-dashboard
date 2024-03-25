'use client'
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const UserDetails: React.FC = () => {
  const router = useRouter();
  const userId = "66015c8f8dfd0daff4571cf5"; // Assuming userId is provided as a query parameter

  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Replace 'your_bearer_token' with your actual bearer token
        const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibmVoZW1pYWgxMjNAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzExMzY1MjYzLCJleHAiOjE3MTM5NTcyNjN9.-zO1QD0zwiNPxQQ-oBEwuSZqKclwgmWQSB856PJR4VQ';
        
        const response = await fetch(`https://flexstay-backend.onrender.com/api/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json' // Add other headers as needed
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to fetch user details");
        }
      } catch (error) {
        console.error("Error occurred:", error);
        toast.error("Failed to fetch user details");
      }
    };

    if (userId) {
      fetchUserDetails();
    }
  }, [userId]);

  return (
    <div className="min-h-screen flex items-center justify-center w-full dark:bg-gray-950 px-4">
      <div className="bg-white dark:bg-gray-900 shadow-md rounded-lg px-8 py-6 max-w-sm w-full">
        <h1 className="text-2xl font-bold text-center mb-4 dark:text-gray-200">User Details</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
          <p className="text-gray-900 dark:text-gray-100">{userData.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
          <p className="text-gray-900 dark:text-gray-100">{userData.email}</p>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
