"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface TwitterIconHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface TwitterIconProps extends HTMLMotionProps<"div"> {
    size?: number;
    duration?: number;
    isAnimated?: boolean;
}

const TwitterIcon = forwardRef<TwitterIconHandle, TwitterIconProps>(
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

        const svgVariants: Variants = {
            normal: { y: 0, scale: 1, rotate: 0 },
            animate: {
                y: [0, -4, 0, -2, 0],
                scale: [1, 1.08, 0.95, 1],
                rotate: [0, -2, 2, 0],
                transition: { duration: 1.2 * duration, ease: "easeInOut" },
            },
        };

        const pathVariants: Variants = {
            normal: { opacity: 1, scale: 1 },
            animate: {
                opacity: [0.9, 1, 1],
                scale: [1, 1.12, 1],
                transition: { duration: 0.8 * duration, ease: "easeOut", delay: 0.15 },
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
                    stroke="currentColor"
                    fill="currentColor"
                    viewBox="0 0 512 512"
                    height={size}
                    width={size}
                    animate={controls}
                    initial="normal"
                    variants={svgVariants}
                >
                    <motion.path
                        d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 
               106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 
               389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"
                        variants={pathVariants}
                        initial="normal"
                        animate={controls}
                    />
                </motion.svg>
            </motion.div>
        );
    },
);

TwitterIcon.displayName = "TwitterIcon";
export { TwitterIcon };
