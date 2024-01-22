const bcrypt = require('bcryptjs');
const { response } = require('express');
const User = require('../models/user');
const Rol = require('../models/rol');
const jwt = require('jsonwebtoken');
const storage  = require('../helpers/cloud_storage');
 
async function getAll(req, res = response , next) {
    try {
        const data = await User.getAll();

        return res.json(data);

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'USER: GET_ALL server error'
        });
    }
} 

async function register(req, res = response, next) {
    try {
        const body = req.body;

        const exist = await User.checkIfExist(body.correo, body.telefono);
  
        if(exist.count === '1' ) {
            return res.status(400).json({
                success: false,
                msg: 'El email o numero de telefono ya existe'
            });
        }

        const salt = bcrypt.genSaltSync();

        body.password = bcrypt.hashSync(body.password, salt);

        const saved = await User.create(body);

        await Rol.create(saved.id, 1);

        await User.findByid(
            saved.id, 
            (_,usuario) => {
            const token = jwt.sign(
                    {
                        id: usuario.id,
                        correo: usuario.correo
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '24h'
                    }
                );
        
                usuario.session_token = token;
        
        
                return res.status(201).json({
                    success: true,
                    usuario
                });
        
            }
        );

       


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'USER: REGISTER server error'
        });
    }
}

async function registerWithImg(req, res = response, next) {
    try {
        const user = JSON.parse(req.body.user);
        const exist = await User.checkIfExist(user.correo, user.telefono);
  
        const files = req.files;

        if(files.length > 0) {
            const pathImage = `image_${Date.now()}`;
            const url = await storage(files[0], pathImage);

            if(url != undefined && url != null) {
                user.imagen = url;
            }
        }

        if(exist.count === '1' ) {
            return res.status(400).json({
                success: false,
                msg: 'El email o numero de telefono ya existe'
            });
        }

        const salt = bcrypt.genSaltSync();

        user.password = bcrypt.hashSync(user.password, salt);

        const saved = await User.create(user);

        await Rol.create(saved.id, 1);

        await User.findByid(
            saved.id, 
            (_,usuario) => {
            const token = jwt.sign(
                    {
                        id: usuario.id,
                        correo: usuario.correo
                    },
                    process.env.JWT_KEY,
                    {
                        expiresIn: '24h'
                    }
                );
        
                usuario.session_token = token;
        
        
                return res.status(201).json({
                    success: true,
                    usuario
                });
        
            }
        );

       


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'USER: REGISTER server error'
        });
    }
}

async function updateUser(req, res = response, next) {
    try {
        const user = JSON.parse(req.body.user);
        const exist = await User.checkIfPhoneExist(user.telefono);
        const files = req.files;

        if(files.length > 0) {
            const pathImage = `image_${Date.now()}`;
            const url = await storage(files[0], pathImage);

            if(url != undefined && url != null) {
                user.imagen = url;
            }
        }

        if(exist.count === '1' ) {
            return res.status(400).json({
                success: false,
                msg: 'Numero de telefono ya existe'
            });
        }

        await User.update(user);

        return res.status(201).json({
            success: true,
            msg: 'Lo datos fueron actualizados'
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'USER: REGISTER server error'
        });
    }
}


async function login(req, res= response, next) {
    try {
        const body = req.body;
        
        const usuario = await User.finyByEmail(body.correo);
        

        if(!usuario) {
            return res.status(404).json({
                success: false,
                msg: 'Crendenciales erroneas'
            });
        }


        const validPass = bcrypt.compareSync( body.password, usuario.password);

        if(!validPass) {
            return res.status(401).json({
                success: false,
                msg: 'Crendenciales erroneas'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                correo: usuario.correo
            },
            process.env.JWT_KEY,
            {
                expiresIn: '24h'
            }
        );

        const data = {
            id: usuario.id,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            correo: usuario.correo,
            telefono: usuario.telefono,
            imagen: usuario.imagen,
            session_token: `JWT ${token}`,
            roles: usuario.roles
        }

        return res.json({
            success: true,
            usuario: data
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            msg: 'USER: LOGIN server error'
        });
    }
}



module.exports = {
    getAll,
    register,
    registerWithImg,
    login,
    updateUser
}