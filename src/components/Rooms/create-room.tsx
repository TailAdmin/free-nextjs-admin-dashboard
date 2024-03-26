'use client'

import * as React from "react"
import { useState, useEffect } from "react"
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
import { toast } from "sonner"


interface ChangestoRoom {
    Trigger: React.ReactNode;
}

export function CreateRoom({ Trigger }: ChangestoRoom) {
    const isBigScreen = useMediaQuery({ query: '(max-width: 700px)' })
    const [formData, setFormData] = useState({
        roomName: "",
        description: "",
        price: "",
        amenities: "",
        mediaUrl: {
            photo1: "",
            otherPhoto1: ""
        }
    });

    const handleSubmit = async (e: { preventDefault: () => void }) => {
        e.preventDefault();
        try {
            const response = await fetch("https://flexstay-backend.onrender.com/api/rooms/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // Include the token from local storage
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                toast.success("Room created")
                console.log(data); // Optionally handle success response
            } else {
                const errorData = await response.json();
                console.error(errorData.message || " Something went wrong");
            }
        } catch (error) {
            console.error("Error occurred:", error);
        }
    };

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
                                <DrawerTitle>Create Room</DrawerTitle>
                                {/* <DrawerDescription>{description}</DrawerDescription> */}
                            </div>
                        </DrawerHeader>
                        <div className=" max-h-[300px]  overflow-y-auto">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input type="text" name="name" id="name" value={formData.roomName} onChange={(e) => setFormData({ ...formData, roomName: e.target.value })} placeholder="Room name" className="focus:border-blue-500 rounded p-2 outline-none border text-sm" />
                                <textarea name="description" id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description"  className="focus:border-blue-500 rounded resize-none h-[100px] p-2 w-full border outline-none text-sm"></textarea>
                                <input type="text" name="price" id="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" className="focus:border-blue-500 rounded outline-none p-2 border text-sm" />
                                <input type="text" name="amenities" id="amenities" value={formData.amenities} onChange={(e) => setFormData({ ...formData, amenities: e.target.value })} placeholder="Amenities" className="focus:border-blue-500 rounded outline-none p-2 border text-sm" />
                                <HotelImageUploader
                                    mediaUrl={formData.mediaUrl}
                                    fieldChange={(files) => setFormData({ ...formData, mediaUrl: { ...formData.mediaUrl, photo1: files[0]?.name || "", otherPhoto1: files[1]?.name || "" } })}
                                />
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
                            <SheetTitle>Create room</SheetTitle>
                            {/* <SheetDescription>
                                {description}
                            </SheetDescription> */}
                        </SheetHeader>
                        <div className=" max-h-[500px] py-5  overflow-y-auto">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                                <input type="text" name="name" id="name" value={formData.roomName} onChange={(e) => setFormData({ ...formData, roomName: e.target.value })} placeholder="Room name" className="focus:border-blue-500 rounded p-2 outline-none border text-sm" />
                                <textarea name="description" id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} placeholder="Description"  className="focus:border-blue-500 rounded resize-none h-[100px] p-2 w-full border outline-none text-sm"></textarea>
                                <input type="text" name="price" id="price" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} placeholder="Price" className="focus:border-blue-500 rounded outline-none p-2 border text-sm" />
                                <input type="text" name="amenities" id="amenities" value={formData.amenities} onChange={(e) => setFormData({ ...formData, amenities: e.target.value })} placeholder="Amenities" className="focus:border-blue-500 rounded outline-none p-2 border text-sm" />
                                <HotelImageUploader
                                    mediaUrl={formData.mediaUrl}
                                    fieldChange={(files) => setFormData({ ...formData, mediaUrl: { ...formData.mediaUrl, photo1: files[0]?.name || "", otherPhoto1: files[1]?.name || "" } })}
                                />

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
