import DefaultLayout from "@/components/Layouts/DefaultLayout";
import RoomsPage from "@/components/Rooms/page";
import Photo from "../../../public/images/product/free.jpeg"
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import UserDetails from "@/components/Booking-table/user";

export default function Home() {
  const RoomCard = [
    {
      name: "Room 35",
      status:"vaccant",
      price: "$500",
      description:
        "3 bed room flat with bungalow and duplex bed room flat with bungalow and duplex bed room flat with bungalow and duplex",
      amenities: "ameniteis",
      Photo: Photo,
    },
    {
        name: "Baby",
        status:"Occupied",
        price: "$500",
        description:
          "3 bed room flat with bungalow and duplex bed room flat with bungalow and duplex bed room flat with bungalow and duplex",
        amenities: "ameniteis",
        Photo: Photo,
      },
      {
        name: "Room 35",
        status:"vaccant",
        price: "$500",
        description:
          "3 bed room flat with bungalow and duplex bed room flat with bungalow and duplex bed room flat with bungalow and duplex",
        amenities: "ameniteis",
        Photo: Photo,
      },

  ];
  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Rooms"/>
        <RoomsPage RoomCard={RoomCard} />
      </DefaultLayout>
    </>
  );
}
