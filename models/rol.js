const db = require('../database/config');

const Rol = {};

const table_name = 'usuario_roles';

Rol.create = (id_user, id_rol) => {
    const sql = `
        INSERT INTO
            ${table_name}(
                usuario_id,
                role_id,
                created_at,
                updated_at
            )
        VALUES(
            $1,$2,$3,$4
        ) 
    `;

    return db.none(sql, [
        id_user,
        id_rol,
        new Date(),
        new Date()
    ]);
}


module.exports = Rol;