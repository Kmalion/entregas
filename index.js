require('dotenv').config();
const express = require("express")
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('./src/config/passport/passport-config'); 
const Database = require('./db');
const MongoStore = require('connect-mongo');
const app = express()
const http = require('http');
const handlebars = require('express-handlebars');
const server = http.createServer(app);
const routerSession = require('./src/routes/session.router')

//Middelware Sesiones
app.use(
    session({
        store: MongoStore.create({
            mongoUrl: process.env.DB_CONNECTION_STRING, // Utilizamos la variable de entorno para la conexión a MongoDB
        }),
        secret: process.env.SESSION_SECRET, // Utilizamos la variable de entorno para la clave secreta de la sesión
        resave: true,
        saveUninitialized: true,
    })
);

// Inicializar passport 
app.use(passport.initialize());
app.use(passport.session());
// Configurar connect-flash
app.use(flash());

//Variables globales Flash
app.use((req, res, next) => {
    res.locals.error = req.flash('error');
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});


// Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) res.send('Failed logout');
        res.redirect('/view/login');
    });
});

app.use(express.static(__dirname + '/public'));


// Configuracion de HandleBars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

//MiddleWares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/', routerSession);
app.use('/auth', routerSession)
app.use('/view', routerSession)


server.listen(8000, () => {
    console.log('Servidor en puerto http://localhost:8000')
    //Ejecuto la base de datos
    Database.connect();
})