const passport = require('passport');
const { getAll, login, findByid, registerWithImg, updateUser, logout, checkToken, getAllRepartidores } = require('../controllers/user_controller');
const { validarCampos } = require('../middlewares/validar-campos')
const { check } = require('express-validator');
const router = require('express').Router();

const upload = require('../helpers/upload');

router.get('/', getAll);
router.get('/deliverymen', passport.authenticate('jwt', {session: false}), getAllRepartidores)
router.get('/findById/:id',  passport.authenticate('jwt', {session: false}) ,findByid);
router.get('/checkToken', passport.authenticate('jwt', {session: false}), checkToken);

router.post('/register', [
    check('user.*.nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('user.*.apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('user.*.correo', 'El correo debe ser valido').isEmail(),
    check('user.*.telefono', 'El numero de telefono debe ser valido').isMobilePhone('es-VE'),
    check('user.*.password', 'La contraseña es obligatoria').not().isEmpty(),
    upload.array('image', 1),
    validarCampos
], registerWithImg);

router.post('/login', [
    check('correo', 'El correo debe ser valido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('password', 'La contraseña debe tener minimo 6 caracteres').not().isLength({
        min: 6
    })
], login);
router.post('/logout', logout);

router.put('/update', [
    passport.authenticate('jwt', {session: false}),
    check('user.*.nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('user.*.apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('user.*.telefono', 'El numero de telefono debe ser valido').isMobilePhone('es-VE'),
    upload.array('image', 1),
    validarCampos
], updateUser);


module.exports = router;