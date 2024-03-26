"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "../ui/button";
import { MdOutlineBedroomChild } from "react-icons/md";
import { SlOptionsVertical } from "react-icons/sl";
import { IoPricetagsOutline } from "react-icons/io5";
import { TbListDetails } from "react-icons/tb";
import { PiLightbulbFilamentLight } from "react-icons/pi";
import { CiSearch } from "react-icons/ci";
import { RiErrorWarningLine } from "react-icons/ri";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { IoLockOpenOutline } from "react-icons/io5";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoMdAdd } from "react-icons/io";
import { DrawerDemo } from "./create-room";

interface RoomCards {
    RoomCard: any[];
}

export default function RoomsPage({ RoomCard }: RoomCards) {
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [state, setState] = useState("")

    const filteredRoomCards = RoomCard.filter(
        (card) =>
            card.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            card.status.toLowerCase().includes(searchQuery.toLowerCase()),
    );
    return (
        <section className="w-full">
            <div className="relative my-4 sm:max-w-sm">
                <input
                    type="text"
                    placeholder="Search room name..."
                    className="w-full rounded border py-2 pl-7 pr-2 outline-none dark:bg-slate-900 dark:text-white"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <span className=" absolute left-2 top-[0.7rem]">
                    <CiSearch size={20} />
                </span>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 lg:p-0">
                {filteredRoomCards.map((card, _id) => (
                    <div
                        key={_id}
                        className="flex h-[350px] flex-col rounded-lg bg-white shadow-11 dark:bg-slate-950"
                    >
                        <div className="relative h-[50%]">
                            <Image
                                src={card.Photo}
                                alt=""
                                layout="fill"
                                objectFit="cover"
                                className=" rounded-t-lg object-scale-down"
                            />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        size={"icon"}
                                        className="hover:bg-gray-400 absolute right-2 top-2 z-30 rounded-full bg-white text-black"
                                    >
                                        <SlOptionsVertical size={20} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    align="end"
                                    className=" max-w-sm  rounded bg-white"
                                >
                                    <DrawerDemo  setState={() => setState("")} Trigger={<h1
                                        className=" hover:bg-gray-3 text-sm text-center md:cursor-pointer"
                                    >
                                        edit
                                    </h1>} Title="Edit Room" description="Make changes to thi room" />
                                    <DropdownMenuRadioItem
                                        value="right"
                                        className=" hover:bg-gray-3 md:cursor-pointer"
                                    >
                                        View details
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem
                                        value="bottom"
                                        className=" hover:bg-gray-3 md:cursor-pointer"
                                    >
                                        Delete
                                    </DropdownMenuRadioItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="flex flex-col p-2">
                            <div className="flex items-center gap-x-2">
                                <span>
                                    <MdOutlineBedroomChild />
                                </span>
                                <p className="text-gray-600 py-2 text-sm font-medium">
                                    {card.name}
                                </p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <span>
                                    <TbListDetails />
                                </span>
                                <p className="text-gray-600 line-clamp-2 w-full text-sm font-medium">
                                    {card.description}
                                </p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <span>
                                    <IoPricetagsOutline />
                                </span>
                                <p className="text-lg font-bold">{card.price}</p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <p>
                                    <PiLightbulbFilamentLight />
                                </p>
                                <p>{card.amenities}</p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <p>
                                    {card.status === "vaccant" ? (
                                        <IoLockOpenOutline />
                                    ) : (
                                        <HiOutlineLockClosed />
                                    )}
                                </p>
                                <p className="text-sm">{card.status}</p>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredRoomCards.length <= 0 && (
                    <div className=" flex items-center gap-x-4 rounded-md bg-white p-3 shadow-10 dark:bg-slate-900 sm:max-w-sm ">
                        <span>
                            <RiErrorWarningLine size={25} />
                        </span>
                        <span> No rooms found</span>
                    </div>
                )}
                <DrawerDemo
                setState={() => setState("")}
                    Trigger={
                        <Button
                            size={"icon"}
                            className=" fixed bottom-8 right-8 z-50  flex h-[60px] w-[60px] items-center justify-center rounded-full bg-slate-900 text-white hover:bg-slate-800"
                        >
                            <IoMdAdd size={25} />
                        </Button>
                    }
                    Title={"Create a room"}
                    description="Lets get started"
                />
            </div>
        </section>
    );
}
