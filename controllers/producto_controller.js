const { response } = require("express");
const storage  = require('../helpers/cloud_storage');

const Producto = require('../models/producto');
const Categoria = require('../models/categoria');

const asyncForEach = require('../helpers/async_foreach');
const ProductoImagen = require("../models/product_imagen");


async function getProdByCat(req, res = response) {
    
    const id_categoria = req.params.id_categoria;
    
    if(!id_categoria) return res.status(400).json({
        success: false,
        msg: 'La categoria es obligatoria'
    });

    try {

        const data = await Producto.getProdsByCat(id_categoria);

        return res.json({
            success: true,
            data
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'GET PROD BY CAT: Error Server'
           });
    }
}

async function createProd(req, res = response) {
    try {
        let data = JSON.parse(req.body.producto);
        let bodyProd = data;

        const cat_exist = await Categoria.getOne(data.id_categoria);

        if(!cat_exist) return res.status(404).json({
            success: false,
            msg: 'La categoria no existe'
        });
    
        const files = req.files;
        let inserts = 0;

        if(files.length === 0) {
            return res.json(400).json({
                success: false,
                msg: 'El producto debe tener al menos una imagen'
            });
        }

        if(files.length > 10) {
            return res.json(400).json({
                success: false,
                msg: 'Solo se pueden subir un maximo de 10 imagenes'
            });
        }
        
        const prod = await Producto.create(data);
        bodyProd.id = prod.id;

        const start = async () => {
            await asyncForEach(files, async (file) => {
                const pathImage = `image_${Date.now()}`;
                const url = await storage(file, pathImage);
                
                if(url !== undefined && url !== null ) {
                    if(inserts == 0) {
                       data.imagen = url; 
                    } else {
                       await ProductoImagen.create(bodyProd.id, url);
                    }
                }

                inserts++;

                if(inserts == files.length) {
                    await Producto.update(data);
                    return res.status(201).json({
                        success: true,
                        msg: 'El producto se he registrado correctamente'
                    });
                }
            });
        };

        start();

    } catch (error) {
       console.log(error);
       return res.status(500).json({
        success: false,
        msg: 'CREATE PROD: Error Server'
       });
    }
}

module.exports = {
    createProd,
    getProdByCat
};