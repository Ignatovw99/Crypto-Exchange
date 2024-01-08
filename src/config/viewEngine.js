const hbs = require('express-handlebars');

exports.configureViewEngine = app => {
    app.engine('hbs', hbs.engine({
        extname: 'hbs'
    }));
    app.set('view engine', 'hbs');
    app.set('views', './src/views');
};
