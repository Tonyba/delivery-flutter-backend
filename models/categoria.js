const db = require('../database/config');

const Categoria = {};

const table_name = 'categorias';


Categoria.getOne = (id) => {
    const sql = `
        SELECT id
        FROM ${table_name}
        WHERE 
            id = $1
    `;

    return db.oneOrNone(sql, id);
}


Categoria.getAll = () => {
    const sql = `
        SELECT *
        FROM ${table_name}
    `;

    return db.manyOrNone(sql);
}

Categoria.create = (categoria) => {
    const sql = `
        INSERT INTO
            ${table_name}
                (
                    nombre,
                    descripcion,
                    created_at,
                    updated_at
                )
        VALUES(
            $1,
            $2,
            $3,
            $4
        ) RETURNING id
    `;

    return db.oneOrNone(sql, [
        categoria.nombre,
        categoria.descripcion,
        new Date(),
        new Date()
    ]); 
}

module.exports = Categoria;
