const router = require('express').Router();
const { validarCampos } = require('../middlewares/validar-campos')
const { check } = require('express-validator');
const passport = require('passport');
const { addAddress, getAddresses } = require('../controllers/direcciones_controller');


router.get('/get-addresses/:id_usuario', passport.authenticate('jwt', {session: false}), getAddresses)

router.post('/create', [
    passport.authenticate('jwt', {session: false}),
    check('id_usuario', 'El id del usuario es obligatorio').not().isEmpty(), 
    check('direccion', 'La direccion es obligatoria').not().isEmpty(), 
    check('lat', 'La latitud es obligatoria').not().isEmpty(), 
    check('lat', 'La latitud debe ser numerica').isNumeric(), 
    check('lng', 'La longitud es obligatoria').not().isEmpty(), 
    check('lng', 'La longitud debe ser numerica').isNumeric(), 
    validarCampos
], addAddress);

module.exports = router;