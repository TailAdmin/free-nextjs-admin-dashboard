/*
  Warnings:

  - You are about to alter the column `total` on the `Transaction` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to drop the column `usuarioId` on the `carrito` table. All the data in the column will be lost.
  - The primary key for the `contactos_guias` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `created_coupons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `created_coupons` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `envios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `envios` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `id_unidad` column on the `envios` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `usuarioId` on the `favorito` table. All the data in the column will be lost.
  - The primary key for the `gifted_coupons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `gifted_coupons` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `guias` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `latitud` on the `oficinas` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to alter the column `longitud` on the `oficinas` table. The data in that column could be lost. The data in that column will be cast from `Decimal` to `Decimal(65,30)`.
  - You are about to drop the column `categoria` on the `productos` table. All the data in the column will be lost.
  - You are about to drop the column `idVendedor` on the `productos` table. All the data in the column will be lost.
  - The primary key for the `unidades` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `unidades` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `profileId` on the `usuarios` table. All the data in the column will be lost.
  - You are about to drop the `Pedido` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PedidoProducto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `TransactionContents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Vendor` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `asignaciones_historial` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `international_countries` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `international_tariffs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `international_zones` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tipo_vehiculo_sucursal` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[usuarioId]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_direccionId_fkey";

-- DropForeignKey
ALTER TABLE "Pedido" DROP CONSTRAINT "Pedido_profileId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoProducto" DROP CONSTRAINT "PedidoProducto_pedidoId_fkey";

-- DropForeignKey
ALTER TABLE "PedidoProducto" DROP CONSTRAINT "PedidoProducto_productoId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionContents" DROP CONSTRAINT "TransactionContents_productoId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionContents" DROP CONSTRAINT "TransactionContents_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "carrito" DROP CONSTRAINT "carrito_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "conductores" DROP CONSTRAINT "conductores_clave_oficina_fkey";

-- DropForeignKey
ALTER TABLE "envios" DROP CONSTRAINT "envios_id_guia_fkey";

-- DropForeignKey
ALTER TABLE "envios" DROP CONSTRAINT "envios_id_unidad_fkey";

-- DropForeignKey
ALTER TABLE "favorito" DROP CONSTRAINT "favorito_usuarioId_fkey";

-- DropForeignKey
ALTER TABLE "gifted_coupons" DROP CONSTRAINT "gifted_coupons_user_id_fkey";

-- DropForeignKey
ALTER TABLE "guias" DROP CONSTRAINT "guias_id_destinatario_fkey";

-- DropForeignKey
ALTER TABLE "guias" DROP CONSTRAINT "guias_id_remitente_fkey";

-- DropForeignKey
ALTER TABLE "international_countries" DROP CONSTRAINT "international_countries_zone_id_fkey";

-- DropForeignKey
ALTER TABLE "international_tariffs" DROP CONSTRAINT "international_tariffs_zone_id_fkey";

-- DropForeignKey
ALTER TABLE "productos" DROP CONSTRAINT "productos_idVendedor_fkey";

-- DropForeignKey
ALTER TABLE "tipo_vehiculo_sucursal" DROP CONSTRAINT "tipo_vehiculo_sucursal_tipo_vehiculo_fkey";

-- DropForeignKey
ALTER TABLE "unidades" DROP CONSTRAINT "unidades_clave_oficina_fkey";

-- DropForeignKey
ALTER TABLE "unidades" DROP CONSTRAINT "unidades_zona_asignada_fkey";

-- DropForeignKey
ALTER TABLE "usuarios" DROP CONSTRAINT "usuarios_profileId_fkey";

-- DropIndex
DROP INDEX "usuarios_profileId_key";

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "usuarioId" INTEGER,
ALTER COLUMN "estado" SET DATA TYPE TEXT,
ALTER COLUMN "ciudad" SET DATA TYPE TEXT,
ALTER COLUMN "fraccionamiento" SET DATA TYPE TEXT,
ALTER COLUMN "calle" SET DATA TYPE TEXT,
ALTER COLUMN "stripeCustomerId" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "total" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "diaTransaccion" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "carrito" DROP COLUMN "usuarioId",
ADD COLUMN     "profileId" INTEGER;

-- AlterTable
ALTER TABLE "conductores" ALTER COLUMN "fecha_alta" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "clave_oficina" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "contactos_guias" DROP CONSTRAINT "contactos_guias_pkey",
ALTER COLUMN "id_contacto" SET DATA TYPE TEXT,
ADD CONSTRAINT "contactos_guias_pkey" PRIMARY KEY ("id_contacto");

-- AlterTable
ALTER TABLE "created_coupons" DROP CONSTRAINT "created_coupons_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "created_coupons_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "envios" DROP CONSTRAINT "envios_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "id_guia" SET DATA TYPE TEXT,
DROP COLUMN "id_unidad",
ADD COLUMN     "id_unidad" INTEGER,
ALTER COLUMN "fecha_asignacion" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "envios_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "facturas" ALTER COLUMN "fecha_creacion" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "favorito" DROP COLUMN "usuarioId",
ADD COLUMN     "profileId" INTEGER;

-- AlterTable
ALTER TABLE "gifted_coupons" DROP CONSTRAINT "gifted_coupons_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "gifted_coupons_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "guias" DROP CONSTRAINT "guias_pkey",
ALTER COLUMN "id_guia" SET DATA TYPE TEXT,
ALTER COLUMN "id_remitente" SET DATA TYPE TEXT,
ALTER COLUMN "id_destinatario" SET DATA TYPE TEXT,
ALTER COLUMN "fecha_creacion" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "fecha_actualizacion" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "fecha_entrega_estimada" SET DATA TYPE TIMESTAMP(3),
ADD CONSTRAINT "guias_pkey" PRIMARY KEY ("id_guia");

-- AlterTable
ALTER TABLE "oficinas" ALTER COLUMN "latitud" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "longitud" SET DATA TYPE DECIMAL(65,30),
ALTER COLUMN "fecha_registro" SET DATA TYPE TIMESTAMP(3);

-- AlterTable
ALTER TABLE "productos" DROP COLUMN "categoria",
DROP COLUMN "idVendedor",
ADD COLUMN     "id_category" INTEGER,
ADD COLUMN     "sellerId" INTEGER;

-- AlterTable
ALTER TABLE "unidades" DROP CONSTRAINT "unidades_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "fecha_alta" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "clave_oficina" SET DATA TYPE TEXT,
ALTER COLUMN "zona_asignada" SET DATA TYPE TEXT,
ADD CONSTRAINT "unidades_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "usuarios" DROP COLUMN "profileId",
ALTER COLUMN "nombre" SET DATA TYPE TEXT,
ALTER COLUMN "apellido" SET DATA TYPE TEXT,
ALTER COLUMN "correo" SET DATA TYPE TEXT,
ALTER COLUMN "contrasena" SET DATA TYPE TEXT,
ALTER COLUMN "token" SET DATA TYPE TEXT,
ALTER COLUMN "token_created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "rol" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Pedido";

-- DropTable
DROP TABLE "PedidoProducto";

-- DropTable
DROP TABLE "TransactionContents";

-- DropTable
DROP TABLE "User";

-- DropTable
DROP TABLE "Vendor";

-- DropTable
DROP TABLE "asignaciones_historial";

-- DropTable
DROP TABLE "international_countries";

-- DropTable
DROP TABLE "international_tariffs";

-- DropTable
DROP TABLE "international_zones";

-- DropTable
DROP TABLE "tipo_vehiculo_sucursal";

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" TEXT,
    "rol" TEXT NOT NULL DEFAULT 'usuario',

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido" (
    "id" SERIAL NOT NULL,
    "total" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" INTEGER NOT NULL,
    "direccionId" INTEGER,
    "estatus_pago" TEXT,
    "calle" TEXT,
    "numero_int" TEXT,
    "numero_exterior" TEXT,
    "cp" TEXT,
    "ciudad" TEXT,
    "nombre" TEXT,
    "last4" TEXT,
    "brand" TEXT,

    CONSTRAINT "pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedido_producto" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "productoId" INTEGER NOT NULL,
    "pedidoId" INTEGER NOT NULL,
    "n_guia" TEXT,

    CONSTRAINT "pedido_producto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionContent" (
    "id" SERIAL NOT NULL,
    "precio" DECIMAL(65,30) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "productoId" INTEGER,
    "transactionId" INTEGER,

    CONSTRAINT "TransactionContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "complaints" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "type" TEXT NOT NULL DEFAULT 'other',
    "resolution" TEXT,
    "priority" TEXT NOT NULL DEFAULT 'medium',
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "order_id" INTEGER,
    "profile_id" INTEGER NOT NULL,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "create_seller" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "RFC" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "user" TEXT,
    "ip_last_login" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "create_seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_complaint_products" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_complaint_products_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_correo_key" ON "user"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "create_seller_email_key" ON "create_seller"("email");

-- CreateIndex
CREATE INDEX "_complaint_products_B_index" ON "_complaint_products"("B");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_usuarioId_key" ON "Profile"("usuarioId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_sellerId_fkey" FOREIGN KEY ("sellerId") REFERENCES "create_seller"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido" ADD CONSTRAINT "pedido_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "misdireccione"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_producto" ADD CONSTRAINT "pedido_producto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedido_producto" ADD CONSTRAINT "pedido_producto_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionContent" ADD CONSTRAINT "TransactionContent_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionContent" ADD CONSTRAINT "TransactionContent_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorito" ADD CONSTRAINT "favorito_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito" ADD CONSTRAINT "carrito_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_clave_oficina_fkey" FOREIGN KEY ("clave_oficina") REFERENCES "oficinas"("clave_cuo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_zona_asignada_fkey" FOREIGN KEY ("zona_asignada") REFERENCES "oficinas"("clave_cuo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conductores" ADD CONSTRAINT "conductores_clave_oficina_fkey" FOREIGN KEY ("clave_oficina") REFERENCES "oficinas"("clave_cuo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envios" ADD CONSTRAINT "envios_id_guia_fkey" FOREIGN KEY ("id_guia") REFERENCES "guias"("id_guia") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "envios" ADD CONSTRAINT "envios_id_unidad_fkey" FOREIGN KEY ("id_unidad") REFERENCES "unidades"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guias" ADD CONSTRAINT "guias_id_remitente_fkey" FOREIGN KEY ("id_remitente") REFERENCES "contactos_guias"("id_contacto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "guias" ADD CONSTRAINT "guias_id_destinatario_fkey" FOREIGN KEY ("id_destinatario") REFERENCES "contactos_guias"("id_contacto") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gifted_coupons" ADD CONSTRAINT "gifted_coupons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_complaint_products" ADD CONSTRAINT "_complaint_products_A_fkey" FOREIGN KEY ("A") REFERENCES "complaints"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_complaint_products" ADD CONSTRAINT "_complaint_products_B_fkey" FOREIGN KEY ("B") REFERENCES "pedido_producto"("id") ON DELETE CASCADE ON UPDATE CASCADE;
