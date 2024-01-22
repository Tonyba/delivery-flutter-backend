const jwt = require('jsonwebtoken');

const genJWT = (id) => {

   return new Promise((resolve, reject) => {
        const payload = {
            id
        };

        jwt.sign(payload, process.env.JWT_KEY, {
            expiresIn: '24h'
        }, (err, token) => {
            if(err) {
                reject('error creating token');
            } else {
                resolve(token);
            }
        });
   })


};

module.exports = {
    genJWT
}