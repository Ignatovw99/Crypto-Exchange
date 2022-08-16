const express = require('express');
const cookieParser = require('cookie-parser');

const { configViewEngine } = require('./config/viewEngine');
const { auth } = require('./middlewares/authMiddleware');
const routes = require('./routes');
const { errorHandler } = require('./middlewares/errorHandlerMiddleware');
const { initializeDatabase } = require('./config/database');
const { PORT } = require('./config/env');

const app = express();

configViewEngine(app);

app.use(express.urlencoded({ extended: false }));
app.use('/static', express.static('public'));
app.use(cookieParser());
app.use(auth);
app.use(routes);
app.use(errorHandler);
app.get('*', (req, res) => {
    res.status(404).render('404');
});

initializeDatabase()
    .then(() => {
        app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
    })
    .catch(err => console.log('The application cannot be started', err));
