"use server";

import prisma from "@/prisma/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { s3Client, AWS_S3_BUCKET } from "@/lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { revalidatePath } from "next/cache";

export async function getProfile() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return null;
  }

  const user = await prisma.usuarios.findUnique({
    where: { id: Number(session.user.id) },
    include: {
      profile: true,
    },
  });

  if (!user) return null;

  return {
    user: {
      nombre: user.nombre,
      apellido: user.apellido,
      correo: user.correo,
      rol: user.rol,
    },
    profile: user.profile,
  };
}

export async function updateProfileInfo(data: {
  nombre: string;
  apellido: string;
  numero: string;
  bio?: string; // Not in DB yet, but in UI
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = Number(session.user.id);

  // Update Usuarios (basic info)
  await prisma.usuarios.update({
    where: { id: userId },
    data: {
      nombre: data.nombre,
      apellido: data.apellido,
    },
  });

  // Upsert Profile
  const existingProfile = await prisma.profile.findUnique({
    where: { usuarioId: userId },
  });

  if (existingProfile) {
    await prisma.profile.update({
      where: { usuarioId: userId },
      data: {
        nombre: data.nombre,
        apellido: data.apellido,
        numero: data.numero,
      },
    });
  } else {
    // Create profile if it doesn't exist (requires mandatory fields)
    // Assuming default values for mandatory fields if creating from scratch
    await prisma.profile.create({
      data: {
        usuarioId: userId,
        nombre: data.nombre,
        apellido: data.apellido,
        numero: data.numero,
        estado: "",
        ciudad: "",
        fraccionamiento: "",
        calle: "",
        codigoPostal: "",
      },
    });
  }

  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function updateAddressInfo(data: {
  estado: string;
  ciudad: string;
  codigoPostal: string;
  rfc: string;
  calle?: string;
  fraccionamiento?: string;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const userId = Number(session.user.id);

  const existingProfile = await prisma.profile.findUnique({
    where: { usuarioId: userId },
  });

  if (existingProfile) {
    await prisma.profile.update({
      where: { usuarioId: userId },
      data: {
        estado: data.estado,
        ciudad: data.ciudad,
        codigoPostal: data.codigoPostal,
        RFC: data.rfc,
        calle: data.calle || existingProfile.calle,
        fraccionamiento: data.fraccionamiento || existingProfile.fraccionamiento,
      },
    });
  } else {
      // Should not happen if profile is created on registration or first login, but handle it
       const user = await prisma.usuarios.findUnique({where: {id: userId}});
       if(!user) throw new Error("User not found");

       await prisma.profile.create({
        data: {
            usuarioId: userId,
            nombre: user.nombre || "",
            apellido: user.apellido || "",
            numero: "",
            estado: data.estado,
            ciudad: data.ciudad,
            codigoPostal: data.codigoPostal,
            RFC: data.rfc,
            calle: data.calle || "",
            fraccionamiento: data.fraccionamiento || "",
        }
       })
  }
  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function updateProfileImage(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("image") as File;
  if (!file || file.size === 0) {
    throw new Error("No image provided");
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `profile-${session.user.id}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "")}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: AWS_S3_BUCKET,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })
  );

  const url = process.env.NEXT_PUBLIC_R2_DOMAIN
    ? `${process.env.NEXT_PUBLIC_R2_DOMAIN}/${fileName}`
    : `${process.env.AWS_S3_ENDPOINT}/${AWS_S3_BUCKET}/${fileName}`;

  const userId = Number(session.user.id);

  // Update Profile
  const existingProfile = await prisma.profile.findUnique({
    where: { usuarioId: userId },
  });

  if (existingProfile) {
    await prisma.profile.update({
      where: { usuarioId: userId },
      data: { imagen: url },
    });
  } else {
      const user = await prisma.usuarios.findUnique({where: {id: userId}});
       if(!user) throw new Error("User not found");
       
      await prisma.profile.create({
          data: {
              usuarioId: userId,
              nombre: user.nombre || "",
              apellido: user.apellido || "",
              numero: "",
              estado: "",
              ciudad: "",
              fraccionamiento: "",
              calle: "",
              codigoPostal: "",
              imagen: url
          }
      })
  }

  revalidatePath("/dashboard/profile");
  return { success: true, url };
}
