const express = require('express');
require('express-async-errors');
const cookieParser = require('cookie-parser');

const { configViewEngine } = require('./config/viewEngine');

const appRoutes = require('./routes');

const { auth } = require('./middlewares/authMiddleware');
const { errorHandler } = require('./middlewares/errorHandlerMiddleware');

const app = express();

configViewEngine(app);

app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('public'));
app.use(cookieParser());
app.use(auth);

app.use(appRoutes);

app.use(errorHandler);
app.get('*', (req, res) => {
    res.status(404).render('404');
});

module.exports = app;
