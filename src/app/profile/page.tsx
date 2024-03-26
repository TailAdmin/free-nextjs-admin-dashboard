'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { Metadata } from "next";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Avatar from "react-avatar";
import { Button } from "@/components/ui/button";


const Profile = () => {
  const [userData, setUserData] = useState<any>({});
  const userToken = localStorage.getItem("token")
  const userId = localStorage.getItem("userId")

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch(`https://flexstay-backend.onrender.com/api/user/${userId}`, {
          headers: {
            'Authorization': `Bearer ${userToken}`,
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
        <div className="flex flex-col">
          <div className="flex flex-col w-full">
          <h1 className="font-bold text-center text-xl">{userData.firstName} {userData.lastName}</h1>
          <p className="text-center">{userData.email}</p>
          <p className="text-center">Hi my name is Nehemiah, i am a software developer</p>
          </div>

          <div className="flex items-center gap-x-3">
            <Button>Rooms</Button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export default Profile;
