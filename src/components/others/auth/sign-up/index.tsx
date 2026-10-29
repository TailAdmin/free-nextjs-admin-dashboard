"use client";

import { Link } from "@/i18n/navigation";
import { ChevronLeftIcon } from "@/icons";
import { cn } from "@/utils";
import AuthDivider from "../divider";
import SignUpFormFields from "./form";
import SignUpHeader from "./header";
import { SocialButtons } from "./social-button";

export default function SignUp() {
  return (
    <div
      className={cn(
        "no-scrollbar flex w-full flex-1 flex-col overflow-y-auto lg:w-1/2",
      )}
    >
      <div className="mx-auto mb-5 w-full max-w-md sm:pt-10">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="rtl:rotate-180" />
          Back to dashboard
        </Link>
      </div>

      <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">
        <div>
          <SignUpHeader />

          <div>
            <SocialButtons />
            <AuthDivider />
            <SignUpFormFields />

            <div className="mt-5">
              <p className="text-center text-sm font-normal text-gray-700 sm:text-start dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/signin"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
