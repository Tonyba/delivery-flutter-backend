const express = require('express');
const cors = require('cors');
const logger = require('morgan');
require('dotenv').config()

const userRoutes = require('./routes/user_routes');
const app = express();
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.use(cors());

app.disable('x-powered-by');


app.use('/api/user', userRoutes);

app.listen(process.env.PORT, () => {
    console.log('server on port ' + process.env.PORT);
});