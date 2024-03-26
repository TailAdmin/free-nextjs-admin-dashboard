'use client'

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerFooter,
    DrawerHeader,
    DrawerDescription,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from 'react-responsive'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { HotelImageUploader } from "../fileuploader"


interface ChangestoRoom {
    Trigger: React.ReactNode;
    Title: string;
    description: string;
    // submiting:boolean;
    setState: React.Dispatch<React.SetStateAction<any>>;
}

export function DrawerDemo({ Trigger, Title, description, setState }: ChangestoRoom) {
    const isBigScreen = useMediaQuery({ query: '(max-width: 700px)' })

    return (
        <>
            {isBigScreen ? (<Drawer>
                <DrawerTrigger asChild>
                    {Trigger}
                </DrawerTrigger>
                <DrawerContent className="bg-white px-4">
                    <div className="mx-auto w-full max-w-sm">
                        <DrawerHeader>
                            <div className="py-5">
                                <DrawerTitle>{Title}</DrawerTitle>
                                <DrawerDescription>{description}</DrawerDescription>
                            </div>
                        </DrawerHeader>
                        <div className=" max-h-[300px]  overflow-y-auto">
                            <form action="" className="flex flex-col gap-3">
                                <input type="text" value={""} placeholder="Room name" className=" focus:border-blue-500 rounded p-2 outline-none border text-sm" />
                                <textarea name="" value={""} placeholder="Description" id="" className="focus:border-blue-500 rounded resize-none h-[100px] p-2 w-full border outline-none text-sm"></textarea>
                                <input type="text" value={""} placeholder="Price" className="focus:border-blue-500 rounded outline-none p-2 border text-sm" />
                                <input type="text" value={""} placeholder="Amenities" className="focus:border-blue-500 rounded outline-none p-2 border text-sm" />
                                <HotelImageUploader mediaUrl=""  fieldChange={() => setState("1")}/>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white my-3">Submit</Button>
                            </form>
                        </div>
                    </div>
                    <DrawerFooter>
                        <DrawerClose>
                            <Button className="w-full text-white bg-red">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>) : (
                <Sheet>
                    <SheetTrigger asChild>
                        {Trigger}
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[400px] z-[9999] sm:w-[540px] px-2 bg-white" >
                        <SheetHeader>
                            <SheetTitle>{Title}</SheetTitle>
                            <SheetDescription>
                                {description}
                            </SheetDescription>
                        </SheetHeader>
                        <div className=" max-h-[500px] py-5  overflow-y-auto">
                            <form action="" className="flex flex-col gap-3">
                                <input type="text" value={""} placeholder="Room name" className=" focus:border-blue-500 rounded p-2 outline-none border text-sm" />
                                <textarea name="" value={""} placeholder="Description" id="" className="focus:border-blue-500 rounded resize-none h-[100px] p-2 w-full border outline-none text-sm"></textarea>
                                <input type="text" value={""} placeholder="Price" className="focus:border-blue-500 rounded outline-none p-2 border text-sm" />
                                <input type="text" value={""} placeholder="Amenities" className="focus:border-blue-500 rounded outline-none p-2 border text-sm" />
                                <HotelImageUploader mediaUrl=""  fieldChange={() => setState("1")}/>
                                <Button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white my-3">Submit</Button>
                            </form>
                        </div>
                        <SheetFooter>
                            <SheetClose asChild>
                                <Button className="w-full text-white bg-red">Close</Button>
                            </SheetClose>
                        </SheetFooter>
                    </SheetContent>
                </Sheet>
            )}
        </>

    )
}
