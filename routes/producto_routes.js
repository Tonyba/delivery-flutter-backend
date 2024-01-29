const router = require('express').Router();
const { validarCampos } = require('../middlewares/validar-campos')
const { check } = require('express-validator');
const passport = require('passport');
const { createProd, getProdByCat } = require('../controllers/producto_controller');
const upload = require('../helpers/upload');

router.get('/all/:id_categoria', passport.authenticate('jwt', {session: false}), getProdByCat)

router.post('/create', [
    passport.authenticate('jwt', {session: false}),
    check('product.*.nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('product.*.precio', 'El precio es obligatorio').not().isEmpty(), 
    check('product.*.precio', 'El precio debe ser numerico').not().isNumeric(), 
    check('product.*.id_categoria', 'La categoria es obligatoria').not().isEmpty(), 
    upload.array('image', 10),
    validarCampos
], createProd);

module.exports = router;