const express = require('express');
require('express-async-errors');
const cookieParser = require('cookie-parser');

const { provideViewEngine } = require('./providers/viewEngine');

const appRoutes = require('./routes');

const { authenticate } = require('./middlewares/authMiddleware');
const { errorHandler } = require('./middlewares/errorHandlerMiddleware');

const app = express();

provideViewEngine(app);

app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('public'));
app.use(cookieParser());
app.use(authenticate);

app.use(appRoutes);

app.use(errorHandler);
app.get('*', (req, res) => {
    res.status(404).render('404');
});

module.exports = app;
