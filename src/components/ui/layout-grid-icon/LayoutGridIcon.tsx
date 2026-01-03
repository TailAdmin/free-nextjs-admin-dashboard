"use client";

import { cn } from "@/lib/utils";
import type { HTMLMotionProps, Variants } from "motion/react";
import { motion, useAnimation, useReducedMotion } from "motion/react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

export interface LayoutGridHandle {
    startAnimation: () => void;
    stopAnimation: () => void;
}

interface LayoutGridProps extends HTMLMotionProps<"div"> {
    size?: number;
    duration?: number;
    isAnimated?: boolean;
}

const LayoutGridIcon = forwardRef<LayoutGridHandle, LayoutGridProps>(
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
            (e?: React.MouseEvent<HTMLDivElement>) => {
                if (!isControlled.current) {
                    controls.start("normal");
                } else onMouseLeave?.(e as any);
            },
            [controls, onMouseLeave]
        );

        const gridVariants: Variants = {
            normal: { scale: 1, rotate: 0 },
            animate: {
                scale: [1, 1.03, 1],
                rotate: [0, 1, 0],
                transition: {
                    duration: 0.6 * duration,
                    ease: "easeInOut" as const,
                },
            },
        };

        const tileVariants: Variants = {
            normal: { opacity: 1, scale: 1 },
            animate: (i: number) => ({
                opacity: [0.4, 1],
                scale: [0.85, 1.08, 1],
                transition: {
                    duration: 0.55 * duration,
                    delay: 0.08 * i,
                    ease: "easeOut" as const,
                },
            }),
        };

        const sweepVariants: Variants = {
            normal: { x: -26, y: -26, opacity: 0 },
            animate: {
                x: [-26, 26],
                y: [-26, 26],
                opacity: [0, 0.35, 0],
                transition: {
                    duration: 0.8 * duration,
                    ease: "easeInOut" as const,
                    delay: 0.1,
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
                    className="lucide lucide-layout-grid-icon lucide-layout-grid"
                >
                    <defs>
                        <linearGradient id="grid-sweep" x1="0" y1="0" x2="1" y2="1">
                            <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
                            <stop offset="50%" stopColor="currentColor" stopOpacity="0.35" />
                            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    <motion.g variants={gridVariants} initial="normal" animate={controls}>
                        <motion.rect
                            width="7"
                            height="7"
                            x="3"
                            y="3"
                            rx="1"
                            variants={tileVariants}
                            custom={0}
                            initial="normal"
                            animate={controls}
                        />
                        <motion.rect
                            width="7"
                            height="7"
                            x="14"
                            y="3"
                            rx="1"
                            variants={tileVariants}
                            custom={1}
                            initial="normal"
                            animate={controls}
                        />
                        <motion.rect
                            width="7"
                            height="7"
                            x="14"
                            y="14"
                            rx="1"
                            variants={tileVariants}
                            custom={2}
                            initial="normal"
                            animate={controls}
                        />
                        <motion.rect
                            width="7"
                            height="7"
                            x="3"
                            y="14"
                            rx="1"
                            variants={tileVariants}
                            custom={3}
                            initial="normal"
                            animate={controls}
                        />

                        <motion.rect
                            x="2"
                            y="2"
                            width="20"
                            height="20"
                            rx="3"
                            fill="url(#grid-sweep)"
                            variants={sweepVariants}
                            initial="normal"
                            animate={controls}
                            style={{ pointerEvents: "none" }}
                        />
                    </motion.g>
                </motion.svg>
            </motion.div>
        );
    }
);

LayoutGridIcon.displayName = "LayoutGridIcon";
export { LayoutGridIcon };
