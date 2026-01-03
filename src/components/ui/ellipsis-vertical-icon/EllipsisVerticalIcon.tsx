"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface EllipsisVerticalIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface EllipsisVerticalIconProps extends HTMLMotionProps<"div"> {
    size?: number;
    duration?: number;
    isAnimated?: boolean;
}

const EllipsisVerticalIcon = forwardRef<
    EllipsisVerticalIconHandle,
    EllipsisVerticalIconProps
>(
    (
        {
            onMouseEnter,
            onMouseLeave,
            className,
            size = 24,
            duration = 1,
            isAnimated = true,
            ...props
        },
        ref,
    ) => {
        const controls = useAnimation();
        const reduced = useReducedMotion();
        const isControlled = useRef(false);

        useImperativeHandle(ref, () => {
            isControlled.current = true;
            return {
                startAnimation: () =>
                    reduced ? controls.start("normal") : controls.start("animate"),
                stopAnimation: () => controls.start("normal"),
            };
        });

        const handleEnter = useCallback(
            (e?: React.MouseEvent<HTMLDivElement>) => {
                if (!isAnimated || reduced) return;
                if (!isControlled.current) controls.start("animate");
                else onMouseEnter?.(e as any);
            },
            [controls, reduced, isAnimated, onMouseEnter],
        );

        const handleLeave = useCallback(
            (e?: React.MouseEvent<HTMLDivElement>) => {
                if (!isControlled.current) controls.start("normal");
                else onMouseLeave?.(e as any);
            },
            [controls, onMouseLeave],
        );

        const dotVariants: Variants = {
            normal: { x: 0 },
            animate: (i: number) => ({
                x: [0, -3, 0],
                transition: {
                    duration: 0.35 * duration,
                    delay: i * 0.12,
                    ease: "easeInOut",
                },
            }),
        };

        return (
            <motion.div
                className={cn("inline-flex items-center justify-center", className)}
                onMouseEnter={handleEnter}
                onMouseLeave={handleLeave}
                {...props}
            >
                <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={size}
                    height={size}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial="normal"
                    animate={controls}
                >
                    <motion.circle cx="12" cy="5" r="1" variants={dotVariants} custom={0} />
                    <motion.circle cx="12" cy="12" r="1" variants={dotVariants} custom={1} />
                    <motion.circle cx="12" cy="19" r="1" variants={dotVariants} custom={2} />
                </motion.svg>
            </motion.div>
        );
    },
);

EllipsisVerticalIcon.displayName = "EllipsisVerticalIcon";
export { EllipsisVerticalIcon };
