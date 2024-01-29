const express = require('express');
const cors = require('cors');
const logger = require('morgan');
require('dotenv').config()

const userRoutes = require('./routes/user_routes');
const categoriaRoutes = require('./routes/categoria_routes');
const productoRoutes = require('./routes/producto_routes');

const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
const passport = require('passport');
const session = require('express-session');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());

app.use(
    session({
        secret: process.env.JWT_KEY,
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());
require('./helpers/passport')(passport);

app.disable('x-powered-by');


app.use('/api/user', userRoutes);
app.use('/api/category', categoriaRoutes);
app.use('/api/product', productoRoutes);


app.listen(process.env.PORT, () => {
    console.log('server on port ' + process.env.PORT);
});