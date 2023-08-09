const express = require('express');
const { Router } = express;
const routerSession = new Router();
const passport = require('passport');


routerSession.get('/', (req, res) => {
    res.render('login', { messages: req.flash('error') });
});

routerSession.get('/view/login', (req, res) => {
    res.render('login', { messages: req.flash('error') });
});

// Define la ruta POST para la autenticación del inicio de sesión
routerSession.post('/auth/login-auth', passport.authenticate('login', {
    successRedirect: '/view/profile', // Redirige al perfil del usuario después del inicio de sesión exitoso
    failureRedirect: '/view/login', // Redirige a la página de inicio de sesión en caso de fallo de autenticación
    failureFlash: true, // Habilita mensajes flash para el fallo
    successFlash: 'Inicio de sesión exitoso.', // Mensaje flash para el éxito
}));
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/view/login');
};

routerSession.get('/view/profile', ensureAuthenticated, (req, res) => {
    // Acceder a las variables de sesión del usuario y mostrar la información en la plantilla
    res.render('profile', {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        age: req.user.age,
        role: req.user.role
    });
});

module.exports = routerSession;