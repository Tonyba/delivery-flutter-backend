CREATE TABLE "usuario" (
  "id" BIGSERIAL PRIMARY KEY,
  "nombre" varchar(255) NOT NULL,
  "apellido" varchar(255) NOT NULL,
  "correo" varchar(255) UNIQUE NOT NULL,
  "telefono" varchar(255) UNIQUE NOT NULL,
  "imagen" varchar(255),
  "password" varchar(255) NOT NULL,
  "disponible" bool DEFAULT false,
  "session_token" varchar(255),
  "created_at" timestamp(0) NOT NULL,
  "updated_at" timestamp(0) NOT NULL
);

CREATE TABLE "usuario_roles" (
  "usuario_id" BIGSERIAL NOT NULL,
  "role_id" BIGINT NOT NULL,
  "created_at" timestamp(0) NOT NULL,
  "updated_at" timestamp(0) NOT NULL
);

CREATE TABLE "roles" (
  "id" BIGSERIAL PRIMARY KEY,
  "nombre" varchar(180) NOT NULL UNIQUE,
  "imagen" varchar(255),
  "ruta" varchar(255) NOT NULL UNIQUE,
  "created_at" timestamp(0) NOT NULL,
  "updated_at" timestamp(0) NOT NULL
);

CREATE TABLE "direcciones_usuario" (
  "id" BIGSERIAL PRIMARY KEY,
  "id_usuario" BIGINT NOT NULL,
  "direccion" varchar(255) NOT NULL,
  "direccion2" varchar(255),
  "lat" float NOT NULL,
  "lng" float NOT NULL,
  "created_at" timestamp(0) NOT NULL,
  "updated_at" timestamp(0) NOT NULL
);

DROP TABLE IF EXISTS productos;
CREATE TABLE "productos" (
  "id" BIGSERIAL PRIMARY KEY,
  "id_categoria" BIGINT,
  "nombre" varchar(255) NOT NULL,
  "precio" float NOT NULL,
  "precio_descuento" float,
  "descripcion" text,
  "imagen" varchar(255),
  "created_at" timestamp(0) NOT NULL,
  "updated_at" timestamp(0) NOT NULL
);

DROP TABLE IF EXISTS productos_imagenes;
CREATE TABLE "productos_imagenes" (
  "id" BIGSERIAL PRIMARY KEY,
  "producto_id" BIGSERIAL NOT NULL,
  "ruta" varchar(255) UNIQUE NOT NULL
);

DROP TABLE IF EXISTS categorias;
CREATE TABLE "categorias" (
  "id" BIGSERIAL PRIMARY KEY,
  "nombre" varchar(255) NOT NULL,
  "descripcion" varchar(255),
  "created_at" timestamp(0) NOT NULL,
  "updated_at" timestamp(0) NOT NULL
);

CREATE TABLE "pedidos" (
  "id" BIGSERIAL PRIMARY KEY,
  "id_usuario" BIGINT NOT NULL,
  "id_repartidor" BIGINT NULL,
  "id_direccion" BIGINT NOT NULL,
  "total" float NOT NULL,
  "estado" varchar NOT NULL DEFAULT '1',
  "tiempo_entrega" timestamp,
  "lat" DECIMAL DEFAULT 0,
  "lng" DECIMAL DEFAULT 0,
  "timestamp" BIGINT NOT NULL,
  "date_created" timestamp(0) NOT NULL,
  "updated_at" timestamp(0) NOT NULL,
  FOREIGN KEY(id_usuario) REFERENCES usuario(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(id_repartidor) REFERENCES usuario(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY(id_direccion) REFERENCES direcciones_usuario(id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE "pedido_producto" (
  "pedido_id" BIGINT NOT NULL,
  "producto_id" BIGINT NOT NULL,
  "cantidad" integer NOT NULL,
  "date_created" timestamp(0) NOT NULL,
  "updated_at" timestamp(0) NOT NULL,
  PRIMARY KEY(pedido_id, producto_id),
  FOREIGN KEY ("pedido_id") REFERENCES "pedidos" ("id") ON UPDATE CASCADE ON DELETE CASCADE;
  FOREIGN KEY ("producto_id") REFERENCES "productos" ("id");
);

CREATE TABLE "reviews" (
  "id" BIGSERIAL PRIMARY KEY,
  "pedido_id" BIGINT NOT NULL,
  "usuario_id" BIGINT NOT NULL,
  "rating" integer NOT NULL DEFAULT 0,
  "texto" varchar(255),
  "created_at" timestamp(0) NOT NULL,
  "updated_at" timestamp(0) NOT NULL,
);

COMMENT ON COLUMN "pedidos"."estado" IS '
    💸 1 = procesando, 
    ✔️ 2 = enviado, 
    ❌ 3 = cancelado,
    😔 4 = reembolsado,
       5 = entregado
  ';

ALTER TABLE "reviews" ADD FOREIGN KEY ("pedido_id") REFERENCES "pedidos" ("id");

ALTER TABLE "reviews" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id");

ALTER TABLE "productos" ADD FOREIGN KEY ("id_categoria") REFERENCES "categorias" ("id");

ALTER TABLE "productos_imagenes" ADD FOREIGN KEY ("producto_id") REFERENCES "productos" ("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "direcciones_usuario" ADD FOREIGN KEY ("id_usuario") REFERENCES "usuario" ("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "usuario_roles" ADD FOREIGN KEY ("role_id") REFERENCES "roles" ("id") ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE "usuario_roles" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuario" ("id") ON UPDATE CASCADE ON DELETE CASCADE;

INSERT INTO roles(
  "nombre",
  "ruta",
  "created_at",
  "updated_at"
)
VALUES(
  'CLIENTE',
  'products',
  '2024-01-15',
  '2024-01-15'
);

INSERT INTO roles(
  "nombre",
  "ruta",
  "created_at",
  "updated_at"
)
VALUES(
  'RESTAURANTE',
  'restaurant/orders/list',
  '2024-01-15',
  '2024-01-15'
);

INSERT INTO roles(
  "nombre",
  "ruta",
  "created_at",
  "updated_at"
)
VALUES(
  'REPARTIDOR',
  'delivery/orders/list',
  '2024-01-15',
  '2024-01-15'
);