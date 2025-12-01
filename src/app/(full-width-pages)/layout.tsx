"use client";

import { useTheme, ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "sonner";


export default function FullWidthPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { theme } = useTheme();
  console.log(theme);
  return <ThemeProvider>
    <div>
      {children}  
      <Toaster theme={theme} position='top-right' richColors />
    </div>
  </ThemeProvider>
}
