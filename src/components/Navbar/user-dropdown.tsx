import {
    Avatar,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    NavbarItem,
} from "@nextui-org/react";
import React, { useCallback } from "react";
import { useRouter } from "next/navigation";
import useUserData from "@/hooks/useUserData";
import { signOut } from "next-auth/react";
  //import { deleteAuthCookie } from "@/actions/auth.action";

export const UserDropdown = () => {
    const router = useRouter();
    const { userData, isLoading, error } = useUserData();
    const userImage = userData?.image || undefined;
    const userInitial = userData?.fullname?.charAt(0).toUpperCase() || "";
    const handleLogout = async () => {

        signOut();
                
    };
    return (
        <Dropdown>
            <NavbarItem>
                <DropdownTrigger>
                    <Avatar
                        as='button'
                        color='secondary'
                        size='md'
                        src={userImage}
                        fallback={userInitial || <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#ccc' }} />}
                    />
                </DropdownTrigger>
            </NavbarItem>
        <DropdownMenu
          aria-label='User menu actions'
          onAction={(actionKey) => console.log({ actionKey })}>
          <DropdownItem
            key='profile'
            className='flex flex-col justify-start w-full items-start'>
            <p>Signed in as</p>
            <p>{userData?.email}</p>
          </DropdownItem>

          <DropdownItem
            key='logout'
            color='danger'
            className='text-danger'
            onPress={handleLogout}>
            Log Out
          </DropdownItem>

        </DropdownMenu>
      </Dropdown>
    );
  };