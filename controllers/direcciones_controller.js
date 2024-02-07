const { response } = require("express")
const DireccionesUsuario = require("../models/direcciones_usuario")

async function getAddresses(req, res= response) {
    const {id_usuario} = req.params;
    try {

        if(!id_usuario) return res.status(400).json({
            success: false,
            msg: 'El id es obligatorio'
        });

        const data = await DireccionesUsuario.findByUser(id_usuario);

        return res.json({
            success: true,
            data,
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'GET DIRECCIONES: Error server'
        });
    }  
}

async function addAddress(req, res= response) {
    try {
        const address = req.body;

        const data = await DireccionesUsuario.create(address);

        return res.status(201).json({
            success: true,
            message: 'La direccion se creo correctamente',
            data: data.id
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'ADD ADDRESS: Error server'
        });
    }
}

module.exports = {
    addAddress,
    getAddresses
}