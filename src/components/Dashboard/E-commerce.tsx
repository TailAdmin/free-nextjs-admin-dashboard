"use client";
import React from "react";
import ChartOne from "../Charts/ChartOne";
import CardDataStats from "../CardDataStats";
import { IoDuplicateOutline } from "react-icons/io5";
import { BsHouses } from "react-icons/bs";
import { IoBedOutline } from "react-icons/io5";
import { IoCashOutline } from "react-icons/io5";
import { DataTableDemo, Payment } from "../Booking-table/Table";


const ECommerce: React.FC = () => {
  const CardData = [
    { title: "Total Bookings", counts: "$45,2K", icon: <IoDuplicateOutline size={25} />, rate: "0.2%" },
    { title: "Room Occupancy Rate", counts: "$3.456K", icon: <IoBedOutline size={25} />, rate: "0.43%" },
    { title: "Revenue", counts: "$45,2K", icon: <IoCashOutline size={25} />, rate: "0.55%" },
    { title: "Estimate", counts: "$45,2K", icon: <BsHouses size={25} />, rate: "22.2%" },
  ]

  const data: Payment[] = [
    {
      id: "m5gr84i9",
      guestName: "John Doe",
      status: "success",
      checkInDate: "2024-02-10",
      checkOutDate: "2024-02-15",
      roomType: "Deluxe Suite",
    },
    {
      id: "3u1reuv4",
      guestName: "Alice Smith",
      status: "success",
      checkInDate: "2024-02-12",
      checkOutDate: "2024-02-17",
      roomType: "Standard Room",
    },
    {
      id: "derv1ws0",
      guestName: "Bob Johnson",
      status: "processing",
      checkInDate: "2024-02-14",
      checkOutDate: "2024-02-20",
      roomType: "Executive Suite",
    },
    {
      id: "5kma53ae",
      guestName: "Emily Wilson",
      status: "success",
      checkInDate: "2024-02-16",
      checkOutDate: "2024-02-21",
      roomType: "Standard Room",
    },
    {
      id: "bhqecj4p",
      guestName: "Michael Brown",
      status: "failed",
      checkInDate: "2024-02-18",
      checkOutDate: "2024-02-23",
      roomType: "Deluxe Suite",
    },
  ];
  
  return (
    <section className="h-auto">
      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        {CardData.map((data, index) => (
          <CardDataStats key={index} title={data.title} total={data.counts} rate={data.rate} levelUp>
            {data.icon}
          </CardDataStats>
        ))}
      </div>

      <div className="my-5 w-full">
        <ChartOne />
      </div>

      <div className="">
        <DataTableDemo data={data} />
      </div>
    </section>
  );
};

export default ECommerce;
