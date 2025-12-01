/*
  Warnings:

  - You are about to drop the column `usuarioId` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `order_id` on the `complaints` table. All the data in the column will be lost.
  - You are about to drop the column `profile_id` on the `complaints` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `favorito` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[usuario_id]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[correo]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `coupon_id` to the `gifted_coupons` table without a default value. This is not possible if the table is not empty.
  - Made the column `contrasena` on table `user` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contrasena` on table `usuarios` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "CuponesTipoEnum" AS ENUM ('porcentaje', 'monto_fijo');

-- CreateEnum
CREATE TYPE "CuponesEstadoEnum" AS ENUM ('activo', 'inactivo', 'expirado');

-- CreateEnum
CREATE TYPE "descuentos_tipo_enum" AS ENUM ('porcentaje', 'monto_fijo');

-- CreateEnum
CREATE TYPE "descuentos_tipo_aplicacion_enum" AS ENUM ('producto', 'categoria', 'carrito', 'envio');

-- CreateEnum
CREATE TYPE "descuentos_estado_enum" AS ENUM ('activo', 'inactivo', 'programado', 'expirado');

-- DropForeignKey
ALTER TABLE "Profile" DROP CONSTRAINT "Profile_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "complaints" DROP CONSTRAINT "complaints_order_id_fkey";

-- DropForeignKey
ALTER TABLE "complaints" DROP CONSTRAINT "complaints_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "favorito" DROP CONSTRAINT "favorito_profileId_fkey";

-- DropForeignKey
ALTER TABLE "gifted_coupons" DROP CONSTRAINT "gifted_coupons_user_id_fkey";

-- DropIndex
DROP INDEX "Profile_usuarioId_key";

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "usuarioId",
ADD COLUMN     "usuario_id" INTEGER;

-- AlterTable
ALTER TABLE "complaints" DROP COLUMN "order_id",
DROP COLUMN "profile_id",
ADD COLUMN     "pedido_id" INTEGER,
ADD COLUMN     "producto_id" INTEGER,
ADD COLUMN     "profileId" INTEGER;

-- AlterTable
ALTER TABLE "favorito" DROP COLUMN "profileId",
ADD COLUMN     "usuarioId" INTEGER;

-- AlterTable
ALTER TABLE "gifted_coupons" ADD COLUMN     "coupon_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "productos" ADD COLUMN     "categoria" TEXT;

-- AlterTable
ALTER TABLE "solicitud_vendedor" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "contrasena" SET NOT NULL;

-- AlterTable
ALTER TABLE "usuarios" ALTER COLUMN "contrasena" SET NOT NULL;

-- CreateTable
CREATE TABLE "deletion_reasons" (
    "id" SERIAL NOT NULL,
    "selected_reason" TEXT NOT NULL,
    "other_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "deletion_reasons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(200) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cupones" (
    "id" SERIAL NOT NULL,
    "codigo" VARCHAR(50) NOT NULL,
    "descripcion" VARCHAR(200) NOT NULL,
    "tipo" "CuponesTipoEnum" NOT NULL DEFAULT 'porcentaje',
    "valor" DECIMAL(10,2) NOT NULL,
    "monto_minimo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "descuento_maximo" DECIMAL(10,2),
    "usos_maximos" INTEGER NOT NULL DEFAULT 1,
    "usos_actuales" INTEGER NOT NULL DEFAULT 0,
    "fecha_expiracion" TIMESTAMP(3),
    "estado" "CuponesEstadoEnum" NOT NULL DEFAULT 'activo',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_creador_id" INTEGER,
    "uso_unico_por_usuario" BOOLEAN NOT NULL DEFAULT false,
    "categorias_aplicables" JSONB,
    "productos_aplicables" JSONB,

    CONSTRAINT "cupones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidad_sucursal" (
    "id" SERIAL NOT NULL,
    "clave_sucursal" TEXT NOT NULL,
    "estado_unidad" TEXT NOT NULL,
    "conductor_unidad" TEXT NOT NULL,
    "id_unidad" INTEGER NOT NULL,

    CONSTRAINT "unidad_sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_vehiculo_sucursal" (
    "id" SERIAL NOT NULL,
    "tipo_vehiculo" INTEGER NOT NULL,
    "tipo_oficina" TEXT NOT NULL,

    CONSTRAINT "tipo_vehiculo_sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignaciones_historial" (
    "id" SERIAL NOT NULL,
    "placas_unidad" VARCHAR(20) NOT NULL,
    "oficina_salida" VARCHAR(5) NOT NULL,
    "clave_cuo_destino" VARCHAR(10) NOT NULL,
    "clave_oficina_actual" VARCHAR(10),
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_llegada_destino" TIMESTAMP(3),
    "fecha_finalizacion" TIMESTAMP(3),
    "nombre_conductor" VARCHAR(255) NOT NULL,
    "curp" VARCHAR(18) NOT NULL,
    "id_oficina" INTEGER,
    "id_unidades" INTEGER,
    "id_pedidos" INTEGER,
    "id_conductor" INTEGER,

    CONSTRAINT "asignaciones_historial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "international_zones" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "international_zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "international_countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iso_code" VARCHAR(3),
    "zone_id" INTEGER NOT NULL,

    CONSTRAINT "international_countries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "international_tariffs" (
    "id" SERIAL NOT NULL,
    "zone_id" INTEGER NOT NULL,
    "max_kg" DOUBLE PRECISION,
    "base_price" DOUBLE PRECISION,
    "iva_percent" DOUBLE PRECISION,
    "additional_per_kg" DOUBLE PRECISION,

    CONSTRAINT "international_tariffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paquetes" (
    "id" SERIAL NOT NULL,
    "estatus" VARCHAR(20) NOT NULL DEFAULT 'En proceso',
    "calle" VARCHAR(250) NOT NULL,
    "colonia" VARCHAR(250) NOT NULL,
    "cp" VARCHAR(5) NOT NULL,
    "indicaciones" VARCHAR,
    "numero_guia" VARCHAR(100) NOT NULL,
    "sku" VARCHAR(100) NOT NULL,
    "longitud" DOUBLE PRECISION NOT NULL,
    "latitud" DOUBLE PRECISION NOT NULL,
    "evidencia" VARCHAR,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paquetes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "asignacion_paquetes" (
    "id" SERIAL NOT NULL,
    "fecha_asignacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idPaqueteId" INTEGER,

    CONSTRAINT "asignacion_paquetes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "movimientos_guias" (
    "id_movimiento" TEXT NOT NULL,
    "id_guia" TEXT NOT NULL,
    "id_sucursal" VARCHAR NOT NULL,
    "id_ruta" VARCHAR NOT NULL,
    "estado" VARCHAR NOT NULL,
    "localizacion" VARCHAR NOT NULL,
    "fecha_movimiento" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "movimientos_guias_pkey" PRIMARY KEY ("id_movimiento")
);

-- CreateTable
CREATE TABLE "incidencias_guias" (
    "id_incidencia" TEXT NOT NULL,
    "id_guia" TEXT NOT NULL,
    "tipo_incidencia" VARCHAR NOT NULL,
    "descripcion" VARCHAR,
    "fecha_incidencia" TIMESTAMPTZ NOT NULL,
    "id_usuario_responsable" VARCHAR NOT NULL,

    CONSTRAINT "incidencias_guias_pkey" PRIMARY KEY ("id_incidencia")
);

-- CreateTable
CREATE TABLE "descuentos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "descripcion" TEXT,
    "tipo" "descuentos_tipo_enum" NOT NULL DEFAULT 'porcentaje',
    "valor" DECIMAL(10,2) NOT NULL,
    "tipo_aplicacion" "descuentos_tipo_aplicacion_enum" NOT NULL,
    "valores_aplicacion" JSONB,
    "monto_minimo" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "descuento_maximo" DECIMAL(10,2),
    "fecha_inicio" TIMESTAMP(3),
    "fecha_fin" TIMESTAMP(3),
    "estado" "descuentos_estado_enum" NOT NULL DEFAULT 'activo',
    "prioridad" INTEGER NOT NULL DEFAULT 10,
    "combinable" BOOLEAN NOT NULL DEFAULT true,
    "combinable_con_cupones" BOOLEAN NOT NULL DEFAULT true,
    "usos_maximos" INTEGER,
    "usos_actuales" INTEGER NOT NULL DEFAULT 0,
    "automatico" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuario_creador_id" INTEGER,

    CONSTRAINT "descuentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_Favoritos" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_Favoritos_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "cupones_codigo_key" ON "cupones"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "unidad_sucursal_id_unidad_key" ON "unidad_sucursal"("id_unidad");

-- CreateIndex
CREATE UNIQUE INDEX "asignaciones_historial_id_conductor_key" ON "asignaciones_historial"("id_conductor");

-- CreateIndex
CREATE UNIQUE INDEX "international_zones_code_key" ON "international_zones"("code");

-- CreateIndex
CREATE UNIQUE INDEX "international_countries_name_key" ON "international_countries"("name");

-- CreateIndex
CREATE INDEX "_Favoritos_B_index" ON "_Favoritos"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_usuario_id_key" ON "Profile"("usuario_id");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_correo_key" ON "usuarios"("correo");

-- AddForeignKey
ALTER TABLE "deletion_reasons" ADD CONSTRAINT "deletion_reasons_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_id_category_fkey" FOREIGN KEY ("id_category") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorito" ADD CONSTRAINT "favorito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidad_sucursal" ADD CONSTRAINT "unidad_sucursal_clave_sucursal_fkey" FOREIGN KEY ("clave_sucursal") REFERENCES "oficinas"("clave_cuo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidad_sucursal" ADD CONSTRAINT "unidad_sucursal_id_unidad_fkey" FOREIGN KEY ("id_unidad") REFERENCES "unidades"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_vehiculo_sucursal" ADD CONSTRAINT "tipo_vehiculo_sucursal_tipo_vehiculo_fkey" FOREIGN KEY ("tipo_vehiculo") REFERENCES "tipos_vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "solicitud_vendedor" ADD CONSTRAINT "solicitud_vendedor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gifted_coupons" ADD CONSTRAINT "gifted_coupons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gifted_coupons" ADD CONSTRAINT "gifted_coupons_coupon_id_fkey" FOREIGN KEY ("coupon_id") REFERENCES "cupones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_historial" ADD CONSTRAINT "asignaciones_historial_id_oficina_fkey" FOREIGN KEY ("id_oficina") REFERENCES "oficinas"("id_oficina") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_historial" ADD CONSTRAINT "asignaciones_historial_id_unidades_fkey" FOREIGN KEY ("id_unidades") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_historial" ADD CONSTRAINT "asignaciones_historial_id_pedidos_fkey" FOREIGN KEY ("id_pedidos") REFERENCES "pedido"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignaciones_historial" ADD CONSTRAINT "asignaciones_historial_id_conductor_fkey" FOREIGN KEY ("id_conductor") REFERENCES "conductores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "international_countries" ADD CONSTRAINT "international_countries_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "international_zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "international_tariffs" ADD CONSTRAINT "international_tariffs_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "international_zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "asignacion_paquetes" ADD CONSTRAINT "asignacion_paquetes_idPaqueteId_fkey" FOREIGN KEY ("idPaqueteId") REFERENCES "paquetes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "movimientos_guias" ADD CONSTRAINT "movimientos_guias_id_guia_fkey" FOREIGN KEY ("id_guia") REFERENCES "guias"("id_guia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "incidencias_guias" ADD CONSTRAINT "incidencias_guias_id_guia_fkey" FOREIGN KEY ("id_guia") REFERENCES "guias"("id_guia") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Favoritos" ADD CONSTRAINT "_Favoritos_A_fkey" FOREIGN KEY ("A") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_Favoritos" ADD CONSTRAINT "_Favoritos_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
