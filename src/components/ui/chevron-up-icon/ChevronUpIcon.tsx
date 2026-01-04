"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface ChevronUpIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface ChevronUpIconProps extends HTMLMotionProps<"div"> {
    size?: number;
    duration?: number;
    isAnimated?: boolean;
}

const ChevronUpIcon = forwardRef<ChevronUpIconHandle, ChevronUpIconProps>(
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

        const leadingArrow: Variants = {
            normal: { y: 0, opacity: 1 },
            animate: {
                y: [0, -4, 0],
                opacity: [1, 0.6, 1],
                transition: {
                    duration: 0.8 * duration,
                    repeat: 0,
                },
            },
        };

        const trailingArrow: Variants = {
            normal: { y: 0, opacity: 0.5 },
            animate: {
                y: [0, -6, 0],
                opacity: [0.5, 0.2, 0.5],
                transition: {
                    duration: 0.8 * duration,
                    repeat: 0,
                    delay: 0.2,
                },
            },
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
                    animate={controls}
                    initial="normal"
                >
                    <motion.path
                        d="m18 15-6-6-6 6"
                        variants={trailingArrow}
                        stroke="currentColor"
                    />
                    <motion.path
                        d="m18 15-6-6-6 6"
                        variants={leadingArrow}
                        stroke="currentColor"
                    />
                </motion.svg>
            </motion.div>
        );
    },
);

ChevronUpIcon.displayName = "ChevronUpIcon";
export { ChevronUpIcon };
