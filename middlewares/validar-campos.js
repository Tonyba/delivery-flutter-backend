const { validationResult } = require("express-validator");

const validarCampos = (req, res, next) => {
    const errores = validationResult(req);
    
    // return res.status(400).json({
    //     success: false,
    //     msg: 'testing'
    // })

    if(!errores.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errores.mapped()
        });
    }

    next();

}

module.exports = {
    validarCampos
}