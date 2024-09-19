"use client"
import React from 'react'
import { Dialog, DialogOverlay, DialogContent } from '@radix-ui/react-dialog'
import { useRouter } from 'next/navigation'
import { DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

type ModalProps = {
    children: React.ReactNode
    btnText?: string
    isClicked?: boolean
    setIsClicked?: (value: boolean) => void
}


export const Modal = ({children, btnText, isClicked, setIsClicked}: ModalProps) => {
    const router = useRouter()

    const handleOpenChange = () => {
        router.back()
    }

    return (
    <Dialog onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
            <Button className={isClicked ? "hidden" : ""} onClick={() => setIsClicked && setIsClicked(true)} variant="outline">{btnText ? "Login" : "Get Started"}</Button>
        </DialogTrigger>
        <DialogTitle className='hidden'>Get Started</DialogTitle>
        <DialogDescription>
        </DialogDescription>
        {/* <DialogOverlay> */}
            <DialogContent className='overflow-y-hidden'>
                {children}
            </DialogContent>
        {/* </DialogOverlay> */}
    </Dialog>
  )
}
