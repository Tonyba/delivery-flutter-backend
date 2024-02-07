const { createPedido, getOrdersByStatus,
    updatePedidoToDespachado } = require('../controllers/pedido_controller');
const passport = require('passport');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos')

const router = require('express').Router();

router.get('/getByStatus/:estado', 
    passport.authenticate('jwt', {session: false}),  
    getOrdersByStatus
);


router.put('/dispatch', passport.authenticate('jwt', {session: false}), updatePedidoToDespachado );

router.post('/create', [
    passport.authenticate('jwt', {session: false}),
    check('id_usuario', 'El usuario es obligatorio').not().isEmpty(), 
    check('id_direccion', 'La direccion es obligatoria').not().isEmpty(),
    validarCampos
], createPedido);

module.exports = router;