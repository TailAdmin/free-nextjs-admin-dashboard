"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface BellIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface BellIconProps extends HTMLMotionProps<"div"> {
    size?: number;
    duration?: number;
    isAnimated?: boolean;
}

const BellIcon = forwardRef<BellIconHandle, BellIconProps>(
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
        ref
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
            [controls, reduced, isAnimated, onMouseEnter]
        );

        const handleLeave = useCallback(
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (!isControlled.current) {
                    controls.start("normal");
                } else {
                    onMouseLeave?.(e as any);
                }
            },
            [controls, onMouseLeave]
        );

        const bellVariants: Variants = {
            normal: { rotate: 0 },
            animate: {
                rotate: [0, -18, 15, -10, 6, -3, 0],
                transition: {
                    duration: 1.6 * duration,
                    repeat: 0,
                    ease: "easeInOut",
                },
            },
        };

        const clapperVariants: Variants = {
            normal: { x: 0 },
            animate: {
                x: [0, -4, 4, -2, 2, 0],
                transition: {
                    duration: 1.6 * duration,
                    repeat: 0,
                    ease: "easeInOut",
                },
            },
        };

        return (
            <motion.div
                className={cn("relative inline-flex", className)}
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
                    variants={bellVariants}
                >
                    <motion.path d="M10.268 21a2 2 0 0 0 3.464 0" variants={clapperVariants} />
                    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326" />
                </motion.svg>
            </motion.div>
        );
    }
);

BellIcon.displayName = "BellIcon";
export { BellIcon };
