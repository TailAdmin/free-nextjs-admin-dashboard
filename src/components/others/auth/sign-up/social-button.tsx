"use client";

import { cn } from "@/utils";
import { socialProviders } from "./data";
import { SocialAuthProvider } from "./types";

export interface SocialButtonProps {
  provider: SocialAuthProvider;
  onClick?: () => void;
  className?: string;
}

export default function SocialButton({
  provider,
  onClick,
  className,
}: SocialButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center justify-center gap-3 rounded-lg bg-gray-100 px-7 py-3 text-sm font-normal text-gray-700 transition-colors hover:bg-gray-200 hover:text-gray-800 dark:bg-white/5 dark:text-white/90 dark:hover:bg-white/10",
        className,
      )}
    >
      {provider.icon}
      Sign up with {provider.name}
    </button>
  );
}

export interface SocialButtonsProps {
  providers?: SocialAuthProvider[];
  className?: string;
  onSelectProvider?: (providerId: string) => void;
}

export function SocialButtons({
  providers = socialProviders,
  className,
  onSelectProvider,
}: SocialButtonsProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5",
        className,
      )}
    >
      {providers.map((provider) => (
        <SocialButton
          key={provider.id}
          provider={provider}
          onClick={
            onSelectProvider ? () => onSelectProvider(provider.id) : undefined
          }
        />
      ))}
    </div>
  );
}
