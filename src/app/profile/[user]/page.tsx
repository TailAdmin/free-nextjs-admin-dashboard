'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Avatar from "react-avatar";


export function  Profile() {
  const router = useRouter();
  const userId = "66015c8f8dfd0daff4571cf5";

  const [userData, setUserData] = useState<any>({});

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const bearerToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibmVoZW1pYWgxMjNAZ21haWwuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNzExMzY1MjYzLCJleHAiOjE3MTM5NTcyNjN9.-zO1QD0zwiNPxQQ-oBEwuSZqKclwgmWQSB856PJR4VQ';
        const response = await fetch(`https://flexstay-backend.onrender.com/api/user/${userData._id}`, {
          headers: {
            'Authorization': `Bearer ${userData.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserData(data);
        } else {
          const errorData = await response.json();
          toast.error(errorData.message || "Failed to fetch user details");
          console.log(errorData.message)
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
    <DefaultLayout>
      <div className="mx-auto max-w-242.5">
        <Breadcrumb pageName="Profile" />

        <div>
          <div className=" h-40 overflow-hidden bg-gradient-to-tr from-slate-300 via-neutral-800" />
          <div className="flex justify-center px-5 -mt-12">
            <Avatar
              color="#5064ae"
              size="100"
              round={true}
              name={`${userData.firstName} ${userData.lastName}`}
            />
          </div>
        </div>
            <div className="flex items-center">

              <h1 className="font-bold text-xl">{userData.firstName}, {userData.lastName}</h1>
            </div>
      </div>
    </DefaultLayout>
  );
};

