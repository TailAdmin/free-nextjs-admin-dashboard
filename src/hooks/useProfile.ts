import { useMutation } from "@tanstack/react-query";
import { updateProfileInfo, updateAddressInfo, updateProfileImage } from "@/actions/profile";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export const useUpdateProfileInfo = () => {
  const router = useRouter();
  const { update } = useSession();

  return useMutation({
    mutationFn: updateProfileInfo,
    onSuccess: async () => {
      await update();
      toast.success("Perfil actualizado");
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al actualizar perfil");
    },
  });
};

export const useUpdateAddressInfo = () => {
  const router = useRouter();
  const { update } = useSession();

  return useMutation({
    mutationFn: updateAddressInfo,
    onSuccess: async () => {
      await update();
      toast.success("Dirección actualizada");
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al actualizar dirección");
    },
  });
};

export const useUpdateProfileImage = () => {
  const router = useRouter();
  const { update } = useSession();

  return useMutation({
    mutationFn: updateProfileImage,
    onSuccess: async () => {
      await update();
      toast.success("Imagen de perfil actualizada");
      router.refresh();
    },
    onError: (error) => {
      console.error(error);
      toast.error("Error al actualizar imagen");
    },
  });
};
