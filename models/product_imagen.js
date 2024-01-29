const db = require('../database/config');

const ProductoImagen = {};

const table_name = 'productos_imagenes';

ProductoImagen.create = (producto_id, ruta) => {
    const sql = `
    INSERT INTO
        ${table_name}
            (
                producto_id, 
                ruta
            )
        VALUES(
            $1,
            $2
        )
    `;

    return db.none(sql, [producto_id, ruta]);
}


module.exports = ProductoImagen;
