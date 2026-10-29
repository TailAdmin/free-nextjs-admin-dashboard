import * as React from "react";
import BlankCard from "./blank-card";
import { BlankCardProps } from "./types";

export default function BlankPageContent(props: BlankCardProps) {
  return <BlankCard {...props} />;
}

export { default as BlankCard } from "./blank-card";
export * from "./types";
