"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface FacebookIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface FacebookIconProps extends HTMLMotionProps<"div"> {
    size?: number;
    duration?: number;
    isAnimated?: boolean;
}

const FacebookIcon = forwardRef<FacebookIconHandle, FacebookIconProps>(
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
            (e: React.MouseEvent<HTMLDivElement>) => {
                if (!isControlled.current) {
                    controls.start("normal");
                } else {
                    onMouseLeave?.(e as any);
                }
            },
            [controls, onMouseLeave],
        );

        const svgVariants: Variants = {
            normal: {
                scale: 1,
                rotate: 0,
            },
            animate: {
                scale: [1, 1.15, 0.92, 1],
                rotate: [0, -4, 4, 0],
                transition: {
                    duration: 0.9 * duration,
                    ease: "easeOut",
                },
            },
        };

        const pathVariants: Variants = {
            normal: {
                pathLength: 1,
                opacity: 1,
            },
            animate: {
                pathLength: [0.2, 1],
                opacity: [0.4, 1],
                transition: {
                    duration: 0.8 * duration,
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
                    variants={svgVariants}
                >
                    <motion.path
                        d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7 a1 1 0 0 1 1-1h3z"
                        variants={pathVariants}
                    />
                </motion.svg>
            </motion.div>
        );
    },
);

FacebookIcon.displayName = "FacebookIcon";
export { FacebookIcon };
