const Categoria = require("../models/categoria");
const { response } = require('express');


async function getCats(req, res =response) {
    try {
        const cats  = await Categoria.getAll();

        return res.json({
            success: true,
            categorias: cats,
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'GET CATS: Error server'
        });
    }
}

async function createCat(req, res = response) {
    try {
        const data = req.body;

        const saved = await Categoria.create(data);

        return res.status(201).json({
            success: true,
            msg: 'Categoria creada correctamente',
            data: saved.id
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'CREATE CAT: Error server'
        });
    }
}

module.exports = {
    createCat,
    getCats
}