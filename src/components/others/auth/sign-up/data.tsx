import { GoogleIcon, TwitterXIcon } from "@/icons";
import { SocialAuthProvider } from "./types";

export const socialProviders: SocialAuthProvider[] = [
  {
    id: "google",
    name: "Google",
    icon: <GoogleIcon className="size-5" />,
  },
  {
    id: "x",
    name: "X",
    icon: <TwitterXIcon className="size-5 fill-current" />,
  },
];

export const socialAuthData = socialProviders;
