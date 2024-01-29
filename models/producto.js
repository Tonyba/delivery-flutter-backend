const db = require('../database/config');


const Producto = {};

const table_name = 'productos';


Producto.getAll = () => {
    const sql = `
        SELECT *
        FROM ${table_name}
    `;

    return db.manyOrNone(sql);
}

Producto.getProdsByCat = (cat_id) => {
    const sql = `
        SELECT
            P.id,
            P.nombre,
            P.descripcion,
            P.precio,
            P.imagen,
            P.id_categoria,
            CASE WHEN COUNT(PI) = 0
            THEN '[]' ELSE JSON_AGG(
			  	PI.ruta
			) END as imagenes
        FROM 
            productos as P
        INNER JOIN
            categorias AS C
        ON
            C.id = P.id_categoria
        LEFT JOIN
            productos_imagenes as PI
        ON
            PI.producto_id = P.id
        WHERE
            C.id = $1
        GROUP BY
            P.id
    `;

    return db.manyOrNone(sql, cat_id);
}

Producto.update = (producto) => {
    const sql = `
        UPDATE 
            ${table_name}
        SET
            nombre = $2,
            descripcion = $3,
            precio = $4,
            imagen = $5,
            id_categoria = $6,
            updated_at = $7
        WHERE   
            id = $1
    `;

    return db.none(sql, [
        producto.id,
        producto.nombre,
        producto.descripcion,
        producto.precio,
        producto.imagen,
        producto.id_categoria,
        new Date()
    ]);
}

Producto.create = (producto) => {
    const sql = `
        INSERT INTO
            ${table_name}
                (
                    nombre,
                    precio,
                    descripcion,
                    id_categoria,
                    created_at,
                    updated_at
                )
        VALUES(
            $1,
            $2,
            $3,
            $4,
            $5,
            $6
        ) RETURNING id
    `;

    return db.oneOrNone(sql, [
        producto.nombre,
        producto.precio,
        producto.descripcion,
        producto.id_categoria,
        new Date(),
        new Date()
    ]); 
}

module.exports = Producto;
