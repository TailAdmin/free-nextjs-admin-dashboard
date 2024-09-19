"use client"
import { createContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { createClient } from "@repo/infrastucture/createClient";

export const AdminContext = createContext<any>(null);

export const AdminContextProvider = ({ children }: { children: ReactNode }) => {
    // const ls = typeof window !== "undefined" ? window.localStorage : null;
    const supabase = createClient();
    const [user, setUser] = useState({} as any);

    useEffect(() => {
        async function fetchData() {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        fetchData();
    }, []);



//   useEffect(() => {
//     const Client = localStorage.getItem("Client");
//     if (client) {
//       setClient(JSON.parse(Client));
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem("Client", JSON.stringify(Client));
//   }, [Client]);


  return (
    <AdminContext.Provider value={{ user }}>
      {children}
    </AdminContext.Provider>
  );
};