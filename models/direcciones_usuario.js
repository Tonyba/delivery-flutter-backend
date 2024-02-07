const db = require('../database/config');

const DireccionesUsuario = {};

const table_name = 'direcciones_usuario';

DireccionesUsuario.findByUser = (id_user) => {
    const sql = `
        SELECT
            id,
            id_usuario,
            direccion,
            direccion2,
            lat,
            lng
        FROM
            ${table_name}
        WHERE
            id_usuario = $1
    `;

    return db.manyOrNone(sql, id_user);
}

DireccionesUsuario.create = (direcciones_usuario) => {
    const sql = `
        INSERT INTO
            ${table_name}
                (
                    id_usuario,
                    direccion,
                    direccion2,
                    lat,
                    lng,
                    created_at,
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
        direcciones_usuario.id_usuario,
        direcciones_usuario.direccion,
        direcciones_usuario.direccion2,
        direcciones_usuario.lat,
        direcciones_usuario.lng,
        new Date(),
        new Date()
    ]); 
}

module.exports = DireccionesUsuario;
