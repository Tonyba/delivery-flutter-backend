const { response } = require('express');
const Pedido = require("../models/pedido");
const PedidoProducto = require('../models/pedido_producto');
const Producto = require('../models/producto');


async function getClientOrdersAndStatus(req, res = response) {
    try {
        const id_usuario = req.params.id_usuario;
        const estado = req.params.estado;

        const data = await Pedido.getPedidosClienteAndEstado(id_usuario, estado);
       
        return res.json({
            success: true,
            data
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'GET PEDIDOS CLIENTE: Error server'
        });
    }
}


async function getAssignedOrdersAndStatus(req, res = response) {
    try {
        const id_repartidor = req.params.id_repartidor;
        const estado = req.params.estado;

        const data = await Pedido.getPedidosAsignadosAndEstado(id_repartidor, estado);
       
        return res.json({
            success: true,
            data
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'GET PEDIDOS ASIGNADOS: Error server'
        });
    }
}

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

async function updatePedidoToEnCamino(req, res = response) {
    try {

        const data = req.body;
        data.estado = 'EN CAMINO';

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
    getAssignedOrdersAndStatus,
    updatePedidoToDespachado,
    updatePedidoToEnCamino,
    getClientOrdersAndStatus
}