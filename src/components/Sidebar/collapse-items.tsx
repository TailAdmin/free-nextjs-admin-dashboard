"use client";
import React, { useState } from "react";
import { ChevronDownIcon } from "../Icons/Sidebar/chevron-down-icon";
import { Accordion, AccordionItem } from "@nextui-org/react";

interface Props {
  icon: React.ReactNode;
  title: string;
  items: string[];
}

export const CollapseItems = ({ icon, items, title }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex gap-4 h-full items-center cursor-pointer">
      <Accordion className="px-0">
        <AccordionItem
          indicator={<ChevronDownIcon />}
          classNames={{
            indicator: "data-[open=true]:-rotate-180",
            trigger:
              "py-0 min-h-[44px] hover:bg-default-100 rounded-xl active:scale-[0.98] transition-transform px-3.5",

            title:
              "px-0 flex text-base gap-2 h-full items-center cursor-pointer",
          }}
          aria-label="Accordion 1"
          title={
            <div className="flex flex-row gap-2">
              <span>{icon}</span>
              <span>{title}</span>
            </div>
          }
        >
          <div className="pl-12">
            {items.map((item, index) => (
              <span
                key={index}
                className="w-full flex  text-default-500 hover:text-default-900 transition-colors"
              >
                {item}
              </span>
            ))}
          </div>
        </AccordionItem>
      </Accordion>
      {/* <Accordion
        title={
          <div
            className="flex items-center justify-between w-full py-5 px-7 rounded-8 transition-all duration-150 ease-in-out cursor-pointer hover:bg-accents2 active:scale-98"
            // css={{
            //   gap: "$6",
            //   width: "100%",
            //   py: "$5",
            //   px: "$7",
            //   borderRadius: "8px",
            //   transition: "all 0.15s ease",
            //   "&:active": {
            //     transform: "scale(0.98)",
            //   },
            //   "&:hover": {
            //     bg: "$accents2",
            //   },
            // }}
            // justify={"between"}
            onClick={handleToggle}
          >
            <div className="flex gap-4">
              {icon}
              <span
                className="text-default-900 font-medium text-base"
                //  span
                //  weight={"normal"}
                //  size={"$base"}
                //  css={{
                //    color: "$accents9",
                //  }}
              >
                {title}
              </span>
            </div>

            <ChevronUpIcon
              className={clsx(
                open ? "rotate-180" : "rotate-0",
                "transition-all duration-300 ease-in-out transform"
              )}
              //   css={{
              //     transition: "transform 0.3s ease",
              //     transform: open ? "rotate(-180deg)" : "rotate(0deg)",
              //   }}
            />
          </div>
        }
        //   css={{
        //     width: "100%",
        //     "& .nextui-collapse-view": {
        //       p: "0",
        //     },
        //     "& .nextui-collapse-content": {
        //       marginTop: "$1",
        //       padding: "0px",
        //     },
        //   }}
        divider={false}
        showArrow={false}
      >
        {items.map((item, index) => (
          <div
            className="flex flex-col pl-8"
            key={index}
            // direction={"column"}
            // css={{
            //   paddingLeft: "$16",
            // }}
          >
            <span
              className="text-default-400 font-normal text-md"
              //   span
              //   weight={"normal"}
              //   size={"$md"}
              //   css={{
              //     color: "$accents8",
              //     cursor: "pointer",
              //     "&:hover": {
              //       color: "$accents9",
              //     },
              //   }}
            >
              {item}
            </span>
          </div>
        ))}
      </Accordion> */}
    </div>
  );
};