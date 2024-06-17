"use client";
import React, { useState, ReactNode } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { AuthProvider } from "react-oidc-context";


const oidcConfig = {
  /*onSignIn: () => {
    // Redirect?
  },*/
  authority: process.env.KEYCLOAK_URL,
  client_id: process.env.KEYCLOAK_CLIENT_ID,
  redirect_uri: process.env.KEYCLOAK_REDIRECT_URI,
  post_logout_redirect_uri: process.env.KEYCLOAK_POST_LOGOUT_REDIRECT_URI,
  extraQueryParams: {
    pres_req_conf_id: process.env.KEYCLOAK_PRES_REQ_CONF_ID,
  }
};


function onSigninCallback () {
       window.history.replaceState(
           {},
           document.title,
           window.location.pathname
       )
   }



export default function DefaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
    <AuthProvider {...oidcConfig} onSigninCallback={onSigninCallback}>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen overflow-hidden">
        {/* <!-- ===== Sidebar Start ===== --> */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* <!-- ===== Header Start ===== --> */}
          <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
          {/* <!-- ===== Header End ===== --> */}

          {/* <!-- ===== Main Content Start ===== --> */}
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
      </AuthProvider>
    </>
  );
}
