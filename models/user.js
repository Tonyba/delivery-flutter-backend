const db = require('../database/config');

const User = {};

const table_name = 'usuario';

User.getAll = () => {
    const sql = `
        SELECT
            *
        FROM 
            ${table_name}
    `;

    return db.manyOrNone(sql);
}

User.create = (user) => {
    const sql = `
        INSERT INTO 
            ${table_name}(
                nombre,
                apellido,
                correo,
                telefono,
                imagen,
                password,
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
            $7,
            $8
        ) RETURNING id
    `;

    return db.oneOrNone(sql, [
        user.nombre,
        user.apellido,
        user.correo,
        user.telefono,
        user.imagen,
        user.password,
        new Date(),
        new Date()
    ])
}

User.update = (user) => {
    const sql = `
        UPDATE
            usuario
        SET
            nombre = $2,
            apellido = $3,
            telefono = $4
            imagen = $5,
            updated_at = $6
        WHERE 
            id = $1
    `;

    return db.none(sql, [
        user.id,
        user.nombre,
        user.telefono,
        user.imagen,
        new Date()
    ]);
}
 
User.checkIfExist = (email,phone) => {
    const sql = `
        SELECT
            COUNT(*)
        FROM
            ${table_name}
        WHERE
            correo = $1
        OR  telefono = $2
    `;

    return db.oneOrNone(sql, [
        email,
        phone
    ]);
}

User.checkIfPhoneExist = (phone) => {
    const sql = `
        SELECT
            COUNT(*)
        FROM
            ${table_name}
        WHERE
            telefono = $1
    `;

    return db.oneOrNone(sql, [
        phone
    ]);
}

User.findByid = (id, callback) => {
    const sql = `
    SELECT
	U.id,
	U.correo,
	U.nombre,
	U.apellido,
	U.imagen,
	U.telefono,
	U.password,
	U.session_token,
	JSON_AGG(
		json_build_object(
			'id', R.id,
			'nombre', R.nombre,
			'ruta', R.ruta,
			'imagen', R.imagen
		)
	) as Roles
FROM
	${table_name} AS U

INNER JOIN
	usuario_roles AS UR
	
ON 
	U.id = UR.usuario_id

INNER JOIN
	roles as R
	
ON
	R.id = UR.role_id
	
WHERE
	U.id = $1
	
GROUP BY U.id
    `;

    return db.oneOrNone(sql, [id], e => e && e).then(user => {callback(null, user)});
}

User.finyByEmail = (email) => {
    const sql = `
    SELECT
	U.id,
	U.correo,
	U.nombre,
	U.apellido,
	U.imagen,
	U.telefono,
	U.password,
	U.session_token,
	JSON_AGG(
		json_build_object(
			'id', R.id,
			'nombre', R.nombre,
			'ruta', R.ruta,
			'imagen', R.imagen
		)
	) as Roles
FROM
	${table_name} AS U

INNER JOIN
	usuario_roles AS UR
	
ON 
	U.id = UR.usuario_id

INNER JOIN
	roles as R
	
ON
	R.id = UR.role_id
	
WHERE
	U.correo = $1
	
GROUP BY U.id
    `;

    return db.oneOrNone(sql, email);
}

module.exports = User;