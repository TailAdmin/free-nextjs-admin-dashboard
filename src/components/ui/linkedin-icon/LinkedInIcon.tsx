"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface LinkedInIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface LinkedInIconProps extends HTMLMotionProps<"div"> {
    size?: number;
    duration?: number;
    isAnimated?: boolean;
}

const LinkedInIcon = forwardRef<LinkedInIconHandle, LinkedInIconProps>(
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

        const iconVariants: Variants = {
            normal: {
                scale: 1,
                rotate: 0,
            },
            animate: {
                scale: [1, 1.06, 1],
                rotate: 0,
                transition: {
                    duration: 0.45 * duration,
                    ease: "easeOut",
                },
            },
        };

        const mainPathVariants: Variants = {
            normal: {
                pathLength: 1,
                opacity: 1,
            },
            animate: {
                pathLength: [0.3, 1],
                opacity: [0.6, 1],
                transition: {
                    duration: 0.6 * duration,
                    ease: "easeInOut",
                },
            },
        };

        const secondaryVariants: Variants = {
            normal: {
                pathLength: 1,
                opacity: 1,
            },
            animate: {
                pathLength: [0, 1],
                opacity: [0, 1],
                transition: {
                    duration: 0.45 * duration,
                    delay: 0.12 * duration,
                    ease: "easeInOut",
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
                    variants={iconVariants}
                >
                    <motion.path
                        d="M16 8a6 6 0 0 1 6 6v7h-4v-7
              a2 2 0 0 0-2-2 
              2 2 0 0 0-2 2v7h-4v-7
              a6 6 0 0 1 6-6z"
                        variants={mainPathVariants}
                    />
                    <motion.rect
                        width="4"
                        height="12"
                        x="2"
                        y="9"
                        variants={secondaryVariants}
                    />
                    <motion.circle cx="4" cy="4" r="2" variants={secondaryVariants} />
                </motion.svg>
            </motion.div>
        );
    },
);

LinkedInIcon.displayName = "LinkedInIcon";
export { LinkedInIcon };
