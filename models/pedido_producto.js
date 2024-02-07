const db = require('../database/config');

const PedidoProducto = {};

const table_name = 'pedido_producto';

PedidoProducto.create = (pedido_id, producto_id, cantidad) => {
    const sql = `
    INSERT INTO
        ${table_name}
            (
                pedido_id,
                producto_id,
                cantidad,
                date_created,
                updated_at
            )
            VALUES(
                $1,
                $2,
                $3,
                $4,
                $5
            ) `;

    return db.none(sql, [
        pedido_id,
        producto_id,
        cantidad,
        new Date(),
        new Date()
    ]);
}

module.exports = PedidoProducto;