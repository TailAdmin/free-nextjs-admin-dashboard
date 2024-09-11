"use client";

import "@/styles/globals.css";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Common/Loader";
import { Providers } from "./providers";
import { fontSans } from "@/fonts/fonts";
import clsx from "clsx";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
        <body suppressHydrationWarning={true}>
          <div 
          className={clsx("font-sans antialiased", fontSans.className)}
          >
            <Providers>
            {loading ? <Loader /> : children}
            </Providers>
          </div>
        </body>
    </html>
  );
}
