import GridShape from "@/components/common/grid-shape";
import ThemeToggler from "@/components/common/theme-toggler";
import { ThemeProvider } from "@/context/theme-context";
import { Link } from "@/i18n/navigation";
import Image from "next/image";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative z-1 bg-white p-6 sm:p-0 dark:bg-gray-900">
      <ThemeProvider>
        <div className="relative flex h-screen w-full flex-col justify-center sm:p-0 lg:flex-row dark:bg-gray-900">
          {children}
          <div className="relative hidden h-full w-full items-center justify-center bg-brand-950 lg:grid lg:w-1/2 dark:bg-white/5">
            <div className="z-1 flex h-full items-center justify-center">
              <GridShape />

              <div className="flex max-w-xs flex-col items-center">
                <Link href="/" className="mb-4 block">
                  <Image
                    width={231}
                    height={48}
                    src="/images/logo/auth-logo.svg"
                    alt="Logo"
                  />
                </Link>
                <p className="text-center text-gray-400 dark:text-white/60">
                  Free and Open-Source Tailwind CSS Admin Dashboard Template
                </p>
              </div>
            </div>
          </div>

          <div className="fixed inset-e-6 bottom-6 z-50 hidden sm:block">
            <ThemeToggler />
          </div>
        </div>
      </ThemeProvider>
    </div>
  );
}
