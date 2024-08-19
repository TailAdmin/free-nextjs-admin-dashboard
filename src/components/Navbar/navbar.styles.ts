import { tv } from "@nextui-org/react";

// NEEDS TO BE REFACTORED

export const StyledBurgerButton = tv({
  base: "absolute flex flex-col justify-around w-6 h-6 bg-transparent border-none cursor-pointer padding-0 z-[202] focus:outline-none [&_div]:w-6 [&_div]:h-px [&_div]:bg-default-900 [&_div]:rounded-xl  [&_div]:transition-all  [&_div]:relative  [&_div]:origin-[1px] ",

  variants: {
    open: {
      true: "[&",
    },
  },
  //   "",
  //   "& div": {

  //     "&:first-child": {
  //       transform: "translateY(-4px) rotate(0deg)",
  //       height: "1px",
  //       marginTop: "10px",
  //     },
  //     "&:nth-child(2)": {
  //       transform: "translateY(4px) rotate(0deg)",
  //       height: "1px",
  //       marginBottom: "10px",
  //     },
  //   },
  //   variants: {
  //     open: {
  //       true: {
  //         "& div": {
  //           "&:first-child": {
  //             marginTop: "0px",
  //             transform: "translateY(1px) rotate(45deg)",
  //           },
  //           "&:nth-child(2)": {
  //             marginBottom: "0px",
  //             transform: "translateY(4px) rotate(-45deg)",
  //           },
  //         },
  //       },
  //     },
  //   },
});