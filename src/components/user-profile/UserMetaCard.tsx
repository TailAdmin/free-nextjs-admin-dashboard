"use client";
import React, { useRef, useState, useEffect } from "react";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../ui/modal";
import Input from "../form/input/InputField";
import Label from "../form/Label";
import Image from "next/image";
import { useUpdateProfileInfo, useUpdateProfileImage } from "@/hooks/useProfile";
import { Button } from "../ui/button";

type UserMetaCardProps = {
  user: {
    nombre: string | null;
    apellido: string | null;
    correo: string;
    rol: string;
  };
  profile: any;
};

export default function UserMetaCard({ user, profile }: UserMetaCardProps) {
  const { isOpen, openModal, closeModal } = useModal();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: updateProfile, isPending: isUpdatingProfile } = useUpdateProfileInfo();
  const { mutate: updateImage, isPending: isUpdatingImage } = useUpdateProfileImage();

  const [formData, setFormData] = useState({
    nombre: user.nombre || "",
    apellido: user.apellido || "",
    numero: profile?.numero || "",
    bio: user.rol || "User",
  });

  useEffect(() => {
    setFormData({
        nombre: user.nombre || "",
        apellido: user.apellido || "",
        numero: profile?.numero || "",
        bio: user.rol || "User",
    })
  }, [user, profile])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData, {
      onSuccess: () => {
        closeModal();
      }
    });
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);
      updateImage(formData);
    }
  };

  const fullName = `${user.nombre || ""} ${user.apellido || ""}`.trim() || "Usuario";
  const location = profile?.ciudad && profile?.estado ? `${profile.ciudad}, ${profile.estado}` : "Ubicación no establecida";

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="relative w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800 group cursor-pointer" onClick={handleImageClick}>
              <Image
                width={80}
                height={80}
                src={profile?.imagen || "/images/user/owner.jpg"}
                alt="user"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white text-xs">Cambiar</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {fullName}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user.rol}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {location}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-auto"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Editar
          </button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Editar Información Personal
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Actualiza tus detalles para mantener tu perfil al día.
            </p>
          </div>
          <form className="flex flex-col" onSubmit={handleSave}>
            <div className="custom-scrollbar h-[450px] overflow-y-auto px-2 pb-3">
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Información Personal
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Nombre</Label>
                    <Input 
                        type="text" 
                        value={formData.nombre} 
                        onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Apellido</Label>
                    <Input 
                        type="text" 
                        value={formData.apellido} 
                        onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Correo Electrónico</Label>
                    <Input type="text" defaultValue={user.correo} disabled className="bg-gray-100" />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Teléfono</Label>
                    <Input 
                        type="text" 
                        value={formData.numero} 
                        onChange={(e) => setFormData({...formData, numero: e.target.value})}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Rol</Label>
                    <Input type="text" defaultValue={user.rol} disabled className="bg-gray-100" />
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 px-2 mt-6 lg:justify-end">
              <Button size="sm" variant="outline" onClick={closeModal} type="button">
                Cerrar
              </Button>
              <Button size="sm" type="submit" disabled={isUpdatingProfile}>
                {isUpdatingProfile ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
