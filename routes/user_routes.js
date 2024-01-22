const { getAll, register, login, registerWithImg } = require('../controllers/user_controller');
const { validarCampos } = require('../middlewares/validar-campos')
const { check } = require('express-validator');
const multer = require('multer');

const router = require('express').Router();

const upload = multer({
    storage: multer.memoryStorage()
});

router.get('/', getAll);
router.post('/register', [
    check('user.*.nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('user.*.apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('user.*.correo', 'El correo debe ser valido').isEmail(),
    check('user.*.telefono', 'El numero de telefono debe ser valido').isMobilePhone('es-VE'),
    check('user.*.password', 'La contraseña es obligatoria').not().isEmpty(),
    upload.array('image', 1),
    validarCampos
], registerWithImg);

router.put('/update', [
    check('user.*.nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('user.*.apellido', 'El apellido es obligatorio').not().isEmpty(),
    check('user.*.telefono', 'El numero de telefono debe ser valido').isMobilePhone('es-VE'),
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

module.exports = router;