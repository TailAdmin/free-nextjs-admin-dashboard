-- CreateTable
CREATE TABLE "Vendor" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "RFC" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "user" TEXT,
    "ip_last_login" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),

    CONSTRAINT "Vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productos" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(60) NOT NULL,
    "descripcion" VARCHAR(120) NOT NULL,
    "altura" REAL,
    "largo" REAL,
    "ancho" REAL,
    "peso" REAL,
    "precio" DECIMAL(10,2) NOT NULL,
    "categoria" VARCHAR,
    "inventario" INTEGER NOT NULL DEFAULT 0,
    "color" VARCHAR(40) NOT NULL,
    "marca" VARCHAR(60) NOT NULL,
    "slug" VARCHAR(120) NOT NULL,
    "vendedor" VARCHAR(80) NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "vendidos" INTEGER NOT NULL DEFAULT 0,
    "sku" VARCHAR(60) NOT NULL,
    "idPerfil" INTEGER,
    "idVendedor" INTEGER,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "product_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carrito" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "activo" BOOLEAN NOT NULL,
    "usuarioId" INTEGER,
    "productoId" INTEGER,

    CONSTRAINT "carrito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorito" (
    "id" SERIAL NOT NULL,
    "fecha_agregado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "usuarioId" INTEGER,
    "productoId" INTEGER,

    CONSTRAINT "favorito_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "review_images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "orden" INTEGER NOT NULL DEFAULT 0,
    "reviewId" INTEGER NOT NULL,

    CONSTRAINT "review_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "created_coupons" (
    "id" TEXT NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "created_coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gifted_coupons" (
    "id" TEXT NOT NULL,
    "user_id" INTEGER NOT NULL,

    CONSTRAINT "gifted_coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "contrasena" VARCHAR,
    "rol" VARCHAR NOT NULL DEFAULT 'usuario',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR,
    "apellido" VARCHAR,
    "correo" VARCHAR NOT NULL,
    "contrasena" VARCHAR,
    "confirmado" BOOLEAN NOT NULL DEFAULT false,
    "token" VARCHAR,
    "token_created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "rol" VARCHAR NOT NULL DEFAULT 'usuario',
    "profileId" INTEGER,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(30) NOT NULL,
    "apellido" VARCHAR(30) NOT NULL,
    "numero" VARCHAR(10),
    "estado" VARCHAR NOT NULL,
    "ciudad" VARCHAR NOT NULL,
    "fraccionamiento" VARCHAR NOT NULL,
    "calle" VARCHAR NOT NULL,
    "codigoPostal" VARCHAR(5) NOT NULL,
    "imagen" TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dgpd2ljyh/image/upload/v1748920792/default_nlbjlp.jpg',
    "stripeCustomerId" VARCHAR,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "misdireccione" (
    "id" SERIAL NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "calle" VARCHAR(100) NOT NULL,
    "colonia_fraccionamiento" VARCHAR(100) NOT NULL,
    "numero_interior" INTEGER,
    "numero_exterior" INTEGER,
    "numero_celular" VARCHAR(100) NOT NULL,
    "codigo_postal" VARCHAR(5) NOT NULL,
    "estado" VARCHAR(50) NOT NULL,
    "municipio" VARCHAR(100) NOT NULL,
    "mas_info" VARCHAR(100),
    "usuario_id" INTEGER,

    CONSTRAINT "misdireccione_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" SERIAL NOT NULL,
    "stripeCardId" TEXT NOT NULL,
    "last4" TEXT NOT NULL,
    "brand" TEXT NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pedido" (
    "id" SERIAL NOT NULL,
    "total" DECIMAL NOT NULL,
    "status" TEXT NOT NULL,
    "fecha" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
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

    CONSTRAINT "Pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PedidoProducto" (
    "id" SERIAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "n_guia" TEXT,
    "productoId" INTEGER NOT NULL,
    "pedidoId" INTEGER NOT NULL,

    CONSTRAINT "PedidoProducto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" SERIAL NOT NULL,
    "total" DECIMAL NOT NULL,
    "diaTransaccion" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TransactionContents" (
    "id" SERIAL NOT NULL,
    "precio" DECIMAL NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "productoId" INTEGER,
    "transactionId" INTEGER,

    CONSTRAINT "TransactionContents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facturas" (
    "id" SERIAL NOT NULL,
    "numero_factura" TEXT NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "sucursal" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "productos" TEXT NOT NULL,
    "fecha_creacion" DATE NOT NULL DEFAULT CURRENT_DATE,
    "fecha_vencimiento" DATE NOT NULL,
    "profileId" INTEGER,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "solicitud_vendedor" (
    "id" SERIAL NOT NULL,
    "nombre_tienda" TEXT NOT NULL,
    "categoria_tienda" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "email" TEXT,
    "direccion_fiscal" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "curp" TEXT NOT NULL,
    "img_uri" TEXT,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "solicitud_vendedor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proveedores" (
    "id" SERIAL NOT NULL,
    "proveedor" TEXT NOT NULL,
    "sub" TEXT NOT NULL,
    "id_usuario" INTEGER NOT NULL,
    "correo_asociado" TEXT,

    CONSTRAINT "proveedores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unidades" (
    "id" TEXT NOT NULL,
    "tipo_vehiculo" INTEGER NOT NULL,
    "placas" TEXT NOT NULL,
    "volumen_carga" DECIMAL(10,2) NOT NULL,
    "num_ejes" INTEGER NOT NULL,
    "num_llantas" INTEGER NOT NULL,
    "fecha_alta" TIMESTAMP NOT NULL,
    "tarjeta_circulacion" TEXT NOT NULL,
    "curp_conductor" TEXT,
    "clave_oficina" VARCHAR(5) NOT NULL,
    "zona_asignada" VARCHAR(5),
    "estado" TEXT NOT NULL DEFAULT 'disponible',

    CONSTRAINT "unidades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipos_vehiculos" (
    "id" SERIAL NOT NULL,
    "tipo_vehiculo" TEXT NOT NULL,
    "capacidad_kg" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "tipos_vehiculos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tipo_vehiculo_sucursal" (
    "id" SERIAL NOT NULL,
    "tipo_vehiculo" INTEGER NOT NULL,
    "tipo_oficina" TEXT NOT NULL,

    CONSTRAINT "tipo_vehiculo_sucursal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conductores" (
    "id" SERIAL NOT NULL,
    "nombre_completo" TEXT NOT NULL,
    "curp" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "licencia" TEXT NOT NULL,
    "licencia_vigente" BOOLEAN NOT NULL,
    "telefono" TEXT NOT NULL,
    "correo" TEXT NOT NULL,
    "fecha_alta" TIMESTAMP NOT NULL,
    "clave_oficina" VARCHAR(5) NOT NULL,
    "disponibilidad" BOOLEAN NOT NULL,

    CONSTRAINT "conductores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "oficinas" (
    "id_oficina" SERIAL NOT NULL,
    "clave_oficina_postal" VARCHAR(5) NOT NULL,
    "clave_cuo" VARCHAR(5) NOT NULL,
    "clave_inmueble" VARCHAR(5) NOT NULL,
    "clave_inegi" VARCHAR(10) NOT NULL,
    "clave_entidad" VARCHAR(2) NOT NULL,
    "nombre_entidad" VARCHAR(50) NOT NULL,
    "nombre_municipio" VARCHAR(50) NOT NULL,
    "tipo_cuo" TEXT NOT NULL,
    "nombre_cuo" VARCHAR(100) NOT NULL,
    "domicilio" VARCHAR(200) NOT NULL,
    "codigo_postal" VARCHAR(5) NOT NULL,
    "clave_unica_zona" TEXT,
    "telefono" VARCHAR(20) NOT NULL,
    "pais" VARCHAR(50) NOT NULL DEFAULT 'México',
    "latitud" DECIMAL NOT NULL,
    "longitud" DECIMAL NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "horario_atencion" VARCHAR(150),
    "fecha_registro" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "oficinas_pkey" PRIMARY KEY ("id_oficina")
);

-- CreateTable
CREATE TABLE "asignaciones_historial" (
    "id" SERIAL NOT NULL,
    "nombre_conductor" VARCHAR(255) NOT NULL,
    "curp" VARCHAR(18) NOT NULL,
    "placas_unidad" VARCHAR(20) NOT NULL,
    "oficina_salida" VARCHAR(5) NOT NULL,
    "clave_cuo_destino" VARCHAR(10) NOT NULL,
    "clave_oficina_actual" VARCHAR(10),
    "fecha_asignacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_llegada_destino" TIMESTAMP,
    "fecha_finalizacion" TIMESTAMP,

    CONSTRAINT "asignaciones_historial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "envios" (
    "id" TEXT NOT NULL,
    "id_guia" UUID NOT NULL,
    "id_unidad" TEXT,
    "estado_envio" TEXT NOT NULL DEFAULT 'pendiente',
    "fecha_asignacion" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_entrega_programada" DATE NOT NULL,
    "nombre_receptor" TEXT,
    "evidencia_entrega" TEXT,
    "motivo_fallo" TEXT,
    "fecha_entregado" DATE,
    "fecha_fallido" DATE,

    CONSTRAINT "envios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "guias" (
    "id_guia" UUID NOT NULL,
    "numero_de_rastreo" TEXT NOT NULL,
    "situacion_actual" TEXT NOT NULL,
    "id_remitente" UUID,
    "id_destinatario" UUID,
    "alto_cm" DECIMAL(5,2) NOT NULL,
    "largo_cm" DECIMAL(5,2) NOT NULL,
    "ancho_cm" DECIMAL(5,2) NOT NULL,
    "peso_kg" DECIMAL(4,2) NOT NULL,
    "valor_declarado" DECIMAL(10,2) NOT NULL,
    "fecha_creacion" TIMESTAMPTZ NOT NULL,
    "fecha_actualizacion" TIMESTAMPTZ NOT NULL,
    "fecha_entrega_estimada" TIMESTAMPTZ,
    "key_pdf" TEXT,

    CONSTRAINT "guias_pkey" PRIMARY KEY ("id_guia")
);

-- CreateTable
CREATE TABLE "contactos_guias" (
    "id_contacto" UUID NOT NULL,
    "id_usuario" TEXT,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "calle" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "numero_interior" TEXT,
    "asentamiento" TEXT NOT NULL,
    "codigo_postal" TEXT NOT NULL,
    "localidad" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "pais" TEXT,
    "lat" DECIMAL(65,30),
    "lng" DECIMAL(65,30),
    "referencia" TEXT,

    CONSTRAINT "contactos_guias_pkey" PRIMARY KEY ("id_contacto")
);

-- CreateTable
CREATE TABLE "shipping_rates" (
    "id" SERIAL NOT NULL,
    "kg_min" DECIMAL(5,2) NOT NULL,
    "kg_max" DECIMAL(5,2) NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "zone_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,

    CONSTRAINT "shipping_rates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" SERIAL NOT NULL,
    "service_name" VARCHAR(100) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "zones" (
    "id" SERIAL NOT NULL,
    "zone_name" VARCHAR(50) NOT NULL,
    "min_distance" INTEGER NOT NULL,
    "max_distance" INTEGER,

    CONSTRAINT "zones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "international_zones" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "international_zones_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "international_countries" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "iso_code" VARCHAR(3),
    "zone_id" INTEGER,

    CONSTRAINT "international_countries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_correo_key" ON "User"("correo");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_profileId_key" ON "usuarios"("profileId");

-- CreateIndex
CREATE UNIQUE INDEX "facturas_numero_factura_key" ON "facturas"("numero_factura");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_placas_key" ON "unidades"("placas");

-- CreateIndex
CREATE UNIQUE INDEX "unidades_tarjeta_circulacion_key" ON "unidades"("tarjeta_circulacion");

-- CreateIndex
CREATE UNIQUE INDEX "tipos_vehiculos_tipo_vehiculo_key" ON "tipos_vehiculos"("tipo_vehiculo");

-- CreateIndex
CREATE UNIQUE INDEX "conductores_curp_key" ON "conductores"("curp");

-- CreateIndex
CREATE UNIQUE INDEX "conductores_rfc_key" ON "conductores"("rfc");

-- CreateIndex
CREATE UNIQUE INDEX "oficinas_clave_cuo_key" ON "oficinas"("clave_cuo");

-- CreateIndex
CREATE UNIQUE INDEX "guias_numero_de_rastreo_key" ON "guias"("numero_de_rastreo");

-- CreateIndex
CREATE UNIQUE INDEX "international_zones_code_key" ON "international_zones"("code");

-- CreateIndex
CREATE UNIQUE INDEX "international_countries_name_key" ON "international_countries"("name");

-- AddForeignKey
ALTER TABLE "productos" ADD CONSTRAINT "productos_idVendedor_fkey" FOREIGN KEY ("idVendedor") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_images" ADD CONSTRAINT "product_images_productId_fkey" FOREIGN KEY ("productId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito" ADD CONSTRAINT "carrito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carrito" ADD CONSTRAINT "carrito_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorito" ADD CONSTRAINT "favorito_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorito" ADD CONSTRAINT "favorito_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_productId_fkey" FOREIGN KEY ("productId") REFERENCES "productos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "review_images" ADD CONSTRAINT "review_images_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "reviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "created_coupons" ADD CONSTRAINT "created_coupons_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gifted_coupons" ADD CONSTRAINT "gifted_coupons_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usuarios" ADD CONSTRAINT "usuarios_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "misdireccione" ADD CONSTRAINT "misdireccione_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pedido" ADD CONSTRAINT "Pedido_direccionId_fkey" FOREIGN KEY ("direccionId") REFERENCES "misdireccione"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoProducto" ADD CONSTRAINT "PedidoProducto_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PedidoProducto" ADD CONSTRAINT "PedidoProducto_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionContents" ADD CONSTRAINT "TransactionContents_productoId_fkey" FOREIGN KEY ("productoId") REFERENCES "productos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionContents" ADD CONSTRAINT "TransactionContents_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_tipo_vehiculo_fkey" FOREIGN KEY ("tipo_vehiculo") REFERENCES "tipos_vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_curp_conductor_fkey" FOREIGN KEY ("curp_conductor") REFERENCES "conductores"("curp") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_clave_oficina_fkey" FOREIGN KEY ("clave_oficina") REFERENCES "oficinas"("clave_cuo") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "unidades" ADD CONSTRAINT "unidades_zona_asignada_fkey" FOREIGN KEY ("zona_asignada") REFERENCES "oficinas"("clave_cuo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tipo_vehiculo_sucursal" ADD CONSTRAINT "tipo_vehiculo_sucursal_tipo_vehiculo_fkey" FOREIGN KEY ("tipo_vehiculo") REFERENCES "tipos_vehiculos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "shipping_rates" ADD CONSTRAINT "shipping_rates_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_rates" ADD CONSTRAINT "shipping_rates_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "international_tariffs" ADD CONSTRAINT "international_tariffs_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "international_zones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "international_countries" ADD CONSTRAINT "international_countries_zone_id_fkey" FOREIGN KEY ("zone_id") REFERENCES "international_zones"("id") ON DELETE SET NULL ON UPDATE CASCADE;
