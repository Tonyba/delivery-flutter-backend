const { response } = require('express');
const Pedido = require("../models/pedido");
const PedidoProducto = require('../models/pedido_producto');
const Producto = require('../models/producto');




async function getOrdersByStatus(req, res = response) {
    try {
        const estado = req.params.estado;
        const data = await Pedido.findByStatus(estado);
       
        return res.json({
            success: true,
            data
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'GET PEDIDOS POR ESTADO: Error server'
        });
    }
}

async function createPedido(req, res = response) {
    try {

        const data = req.body;
        total = 0;
        data.estado = 'PAGADO';

        for (const producto of data.productos) {
            const {precio} = await Producto.getById(producto.id);
            total += precio * producto.quantity;
        }

        data.total = total;
        const saved = await Pedido.create(data);
        
        for (const producto of data.productos) {
            await PedidoProducto.create(saved.id, producto.id, producto.quantity);
        }

        return res.status(201).json({
            success: true,
            msg: 'Pedido creado correctamente',
            data: saved.id
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'CREATE PEDIDO: Error server'
        });
    }
}

async function updatePedidoToDespachado(req, res = response) {
    try {

        const data = req.body;
        data.estado = 'DESPACHADO';

        await Pedido.update(data);
        
        return res.status(201).json({
            success: true,
            msg: 'Pedido actualizado correctamente'        
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'UPDATE PEDIDO: Error server'
        });
    }
}

module.exports = {
    createPedido,
    getOrdersByStatus,
    updatePedidoToDespachado
}