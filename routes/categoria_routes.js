const router = require('express').Router();
const { createCat, getCats } = require('../controllers/categoria_controller');
const { validarCampos } = require('../middlewares/validar-campos')
const { check } = require('express-validator');
const passport = require('passport');

router.get('/all', passport.authenticate('jwt', {session: false}), getCats);

router.post('/create', [
    passport.authenticate('jwt', {session: false}),
    check('nombre').not().isEmpty(), 
    validarCampos
], createCat);

module.exports = router;