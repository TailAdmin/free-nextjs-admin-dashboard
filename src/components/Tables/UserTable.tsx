"use client"

import React, { useEffect, useState } from 'react'
import { UserRepository } from '@repo/domain/UserRepository'

const userRepo = new UserRepository()

export const UserTable = () => {
    const [userData, setUserData] = useState([])
    useEffect(() => {
        // API call to fetch data
        try {
            async function getUsers() {
                const users = await userRepo.getAllUsers()
                setUserData(users)
            }
            getUsers()
          } catch (error) {
            console.log(error)
        }
    }, [])

    return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        Top Channels
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Source
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Visitors
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Revenues
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Sales
            </h5>
          </div>
          <div className="hidden p-2.5 text-center sm:block xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Conversion
            </h5>
          </div>
        </div>

        {userData.map((user, key) => (
          <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === key - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
            <div className="flex items-center gap-3 p-2.5 xl:p-5">
              <div className="flex-shrink-0">
                {/* <Image src={user.logo} alt="Brand" width={48} height={48} /> */}
              </div>
              <p className="hidden text-black dark:text-white sm:block">
                {/* {user.user_id} */}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
