const db = require('../database/config');

const Pedidos = {};

const table_name = 'pedidos';

Pedidos.getPedidosClienteAndEstado = (id_usuario, estado) => {
    const sql = `
        SELECT
            P.id,
            P.id_usuario,
            P.id_direccion,
            P.id_repartidor,
            P.estado,
            P.timestamp,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', PROD.id,
                    'nombre', PROD.nombre,
                    'precio', PROD.precio,
                    'imagen', PROD.imagen,
                    'descripcion', PROD.descripcion,
                    'quantity', PP.cantidad
                )
            ) as productos,
            JSON_BUILD_OBJECT(
                'id', U.id,
                'nombre', U.nombre,
                'apellido', U.apellido,
                'imagen', U.imagen
            ) AS cliente,
            JSON_BUILD_OBJECT(
                'id', U2.id,
                'nombre', U2.nombre,
                'apellido', U2.apellido,
                'imagen', U2.imagen
            ) AS repartidor,
            JSON_BUILD_OBJECT(
                'id', D.id,
                'direccion', D.direccion,
                'direccion2', D.direccion2,
                'lat', D.lat,
                'lng', D.lng
            ) AS direccion
        FROM
            ${table_name} AS P
        INNER JOIN
            usuario AS U
        ON
            P.id_usuario = U.id

        LEFT JOIN
            usuario AS U2
        ON
            P.id_repartidor = U2.id

        INNER JOIN
            direcciones_usuario AS D
        ON
            D.id = P.id_direccion

        INNER JOIN
            pedido_producto AS PP
        ON
            PP.pedido_id = P.id

        INNER JOIN
            productos AS PROD
        ON
            PROD.id = PP.producto_id
        
        WHERE
            estado = $2
        AND
            P.id_usuario = $1

        GROUP BY
            P.id,
            U.id,
            U2.id,
            D.id
    `;

return db.manyOrNone(sql, [id_usuario, estado]);
}


Pedidos.getPedidosAsignadosAndEstado = (id_repartidor, estado) => {
    const sql = `
        SELECT
            P.id,
            P.id_usuario,
            P.id_direccion,
            P.id_repartidor,
            P.estado,
            P.timestamp,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', PROD.id,
                    'nombre', PROD.nombre,
                    'precio', PROD.precio,
                    'imagen', PROD.imagen,
                    'descripcion', PROD.descripcion,
                    'quantity', PP.cantidad
                )
            ) as productos,
            JSON_BUILD_OBJECT(
                'id', U.id,
                'nombre', U.nombre,
                'apellido', U.apellido,
                'imagen', U.imagen
            ) AS cliente,
            JSON_BUILD_OBJECT(
                'id', U2.id,
                'nombre', U2.nombre,
                'apellido', U2.apellido,
                'imagen', U2.imagen
            ) AS repartidor,
            JSON_BUILD_OBJECT(
                'id', D.id,
                'direccion', D.direccion,
                'direccion2', D.direccion2,
                'lat', D.lat,
                'lng', D.lng
            ) AS direccion
        FROM
            ${table_name} AS P
        INNER JOIN
            usuario AS U
        ON
            P.id_usuario = U.id

        LEFT JOIN
            usuario AS U2
        ON
            P.id_repartidor = U2.id

        INNER JOIN
            direcciones_usuario AS D
        ON
            D.id = P.id_direccion

        INNER JOIN
            pedido_producto AS PP
        ON
            PP.pedido_id = P.id

        INNER JOIN
            productos AS PROD
        ON
            PROD.id = PP.producto_id
        
        WHERE
            estado = $2
        AND
            P.id_repartidor = $1

        GROUP BY
            P.id,
            U.id,
            U2.id,
            D.id
    `;

return db.manyOrNone(sql, [id_repartidor, estado]);
}


Pedidos.findByStatus = (estado) => {

    const sql = `
        SELECT
            P.id,
            P.id_usuario,
            P.id_direccion,
            P.id_repartidor,
            P.estado,
            P.timestamp,
            JSON_AGG(
                JSON_BUILD_OBJECT(
                    'id', PROD.id,
                    'nombre', PROD.nombre,
                    'precio', PROD.precio,
                    'imagen', PROD.imagen,
                    'descripcion', PROD.descripcion,
                    'quantity', PP.cantidad
                )
            ) as productos,
            JSON_BUILD_OBJECT(
                'id', U.id,
                'nombre', U.nombre,
                'apellido', U.apellido,
                'imagen', U.imagen
            ) AS cliente,
            JSON_BUILD_OBJECT(
                'id', U2.id,
                'nombre', U2.nombre,
                'apellido', U2.apellido,
                'imagen', U2.imagen
            ) AS repartidor,
            JSON_BUILD_OBJECT(
                'id', D.id,
                'direccion', D.direccion,
                'direccion2', D.direccion2,
                'lat', D.lat,
                'lng', D.lng
            ) AS direccion
        FROM
            ${table_name} AS P
        INNER JOIN
            usuario AS U
        ON
            P.id_usuario = U.id

        LEFT JOIN
            usuario AS U2
        ON
            P.id_repartidor = U2.id

        INNER JOIN
            direcciones_usuario AS D
        ON
            D.id = P.id_direccion

        INNER JOIN
            pedido_producto AS PP
        ON
            PP.pedido_id = P.id

        INNER JOIN
            productos AS PROD
        ON
            PROD.id = PP.producto_id
        WHERE
            estado = $1
        
        GROUP BY
            P.id,
            U.id,
            U2.id,
            D.id
    `;

    return db.manyOrNone(sql, estado);
}

Pedidos.update = (pedido) => {
    const sql = `
    UPDATE
        ${table_name}
    SET 
        id_usuario = $2,
        id_repartidor = $3,
        id_direccion = $4,
        estado = $5,
        updated_at = $6
    WHERE
        id = $1
    `;

    return db.none(sql, [
        pedido.id,
        pedido.id_usuario,
        pedido.id_repartidor,
        pedido.id_direccion,
        pedido.estado,
        new Date()
    ]);
}

Pedidos.create = (pedido) => {
    const sql = `
    INSERT INTO
        ${table_name}
            (
                id_usuario,
                id_direccion,
                total,
                estado,
                timestamp,
                date_created,
                updated_at
            )
            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5,
                $6,
                $7
            ) RETURNING id
    `;

    return db.oneOrNone(sql, [
        pedido.id_usuario,
        pedido.id_direccion,
        pedido.total,
        pedido.estado,
        Date.now(),
        new Date(),
        new Date()
    ]);
}

module.exports = Pedidos;