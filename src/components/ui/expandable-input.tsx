"use client";
import React, { useRef, useState, useEffect } from 'react';
import { motion, MotionConfig } from 'framer-motion';
import useClickOutside from '@/hooks/useClickOutside';
import { ArrowLeft, Search } from 'lucide-react';
import { cn } from "@/lib/utils";

const transition = {
  type: 'spring',
  bounce: 0.1,
  duration: 0.2,
} as const;

function Button({
  children,
  onClick,
  disabled,
  ariaLabel,
  className
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}) {
  return (
    <button
      className={cn('relative flex h-9 w-9 shrink-0 scale-100 select-none border-input appearance-none items-center justify-center rounded-md text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-800 focus-visible:ring-2 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-100', className)}
      type='button'
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}

interface ExpandableInputProps {
    placeholder?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    className?: string;
    expandedSize?: string;
}

export default function ExpandableInput({ placeholder, onChange, value, className, expandedSize = "300px" }: ExpandableInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useClickOutside(containerRef, () => {
    if (isOpen) {
        setIsOpen(false);
    }
  });

  useEffect(() => {
      if (isOpen && inputRef.current) {
          inputRef.current.focus();
      }
  }, [isOpen]);

  return (
    <MotionConfig transition={transition}>
      <div className={cn('relative h-9', className)} ref={containerRef}>
        <div className='h-9 w-fit shadow-xs transition-[color,box-shadow]  rounded-md border border-zinc-950/10 bg-white dark:bg-white/5 dark:border-white/10 overflow-hidden '>
          <motion.div
            animate={{
              width: isOpen ? `${expandedSize}` : '36px',
            }}
            initial={false}
            className="h-full"
          >
            <div className='overflow-hidden h-full'>
              {!isOpen ? (
                <div className='flex justify-center items-center w-full h-full'>
                  <Button
                    onClick={() => setIsOpen(true)}
                    ariaLabel='Search'
                  >
                    <Search className='size-4' />
                  </Button>
                </div>
              ) : (
                <div className='flex  items-center h-full'>
                  <Button onClick={() => {
                      setIsOpen(false);
                  }} ariaLabel='Back'>
                    <ArrowLeft className='size-4' />
                  </Button>
                  <div className='relative w-full '>
                    <input
                      ref={inputRef}
                      className='h-8  w-full rounded-md border-none bg-transparent text-sm p-2 text-zinc-900 dark:text-white placeholder-zinc-500 focus:outline-hidden'
                      placeholder={placeholder}
                      onChange={onChange}
                      value={value}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </MotionConfig>
  );
}
