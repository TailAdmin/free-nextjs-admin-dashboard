import Link from "next/link";
import DarkModeSwitcher from "./DarkModeSwitcher";
import DropdownUser from "./DropdownUser";
import Image from "next/image";
import useUserData from "@/hooks/useUserData";
//import { useUser } from "@auth0/nextjs-auth0/client";

const Header = (props: {
  sidebarOpen: string | boolean | undefined;
  setSidebarOpen: (arg0: boolean) => void;
}) => {
  const { userData, isLoading, error } = useUserData();

  return (
    <header className=" sticky top-0 z-999 flex w-full bg-white drop-shadow-1 dark:bg-boxdark dark:drop-shadow-none">
     
      <div className="flex flex-grow items-center justify-between px-4 py-4 shadow-2 md:px-6 2xl:px-11">
        <div className="flex items-center gap-2 sm:gap-4 lg:hidden">
          {/* <!-- Hamburger Toggle BTN --> */}
          <button
            aria-controls="sidebar"
            onClick={(e) => {
              e.stopPropagation();
              props.setSidebarOpen(!props.sidebarOpen);
            }}
            className="z-99999 block rounded-sm border border-stroke bg-white p-1.5 shadow-sm dark:border-strokedark dark:bg-boxdark lg:hidden"
          >
            <span className="relative block h-5.5 w-5.5 cursor-pointer">
              <span className="du-block absolute right-0 h-full w-full">
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-[0] duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-300"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-150 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "delay-400 !w-full"
                  }`}
                ></span>
                <span
                  className={`relative left-0 top-0 my-1 block h-0.5 w-0 rounded-sm bg-black delay-200 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!w-full delay-500"
                  }`}
                ></span>
              </span>
              <span className="absolute right-0 h-full w-full rotate-45">
                <span
                  className={`absolute left-2.5 top-0 block h-full w-0.5 rounded-sm bg-black delay-300 duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-[0]"
                  }`}
                ></span>
                <span
                  className={`delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-sm bg-black duration-200 ease-in-out dark:bg-white ${
                    !props.sidebarOpen && "!h-0 !delay-200"
                  }`}
                ></span>
              </span>
            </span>
          </button>
 


          {/* <!-- Hamburger Toggle BTN --> */}

          {/*<Link className="block flex-shrink-0 lg:hidden" href="/">*/}
          {/*  <Image*/}
          {/*    width={32}*/}
          {/*    height={32}*/}
          {/*    src={"/images/logo/logo.svg"}*/}
          {/*    alt="Logo"*/}
          {/*  />*/}
          {/*</Link>*/}

          { (
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>AghanimAdmin</p>
        )} 
        </div>


{!userData && (
          <p style={{ fontSize: "24px", fontWeight: "bold" }}>AghanimAdmin</p>
        )}
        <div className="hidden sm:block">
          {userData && (
            <form action="https://formbold.com/s/unique_form_id" method="POST">
              <div className="relative">
                
              </div>
            </form>
          )}
        </div>

        <div className="flex items-center gap-3 2xsm:gap-7">
          {userData && (
            <ul className="flex items-center gap-2 2xsm:gap-4">
              {/* <!-- Dark Mode Toggler --> */}
              <DarkModeSwitcher />
              {/* <!-- Dark Mode Toggler --> */}

              {/* <!-- Notification Menu Area --> */}
              {/* <DropdownNotification /> */}
              {/* <!-- Notification Menu Area --> */}

              {/* <!-- Chat Notification Area --> */}
              {/* <DropdownMessage /> */}
              {/* <!-- Chat Notification Area --> */}
            </ul>
          )}
          {/* <!-- User Area --> */}
          <DropdownUser />
          {/* <!-- User Area --> */}
        </div>
      </div>
    </header>
  );
};

export default Header;
