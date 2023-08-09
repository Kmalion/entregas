const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../../dao/mongo/models/modelUser');


//Estrategia para Login


passport.use('login', new LocalStrategy({
    passReqToCallback: true, // Pasar el objeto req a la función de verificación
    usernameField: 'email',
    passwordField: 'password'
}, async (req, email, password, done) => {
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado.' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return done(null, false, { message: 'Contraseña incorrecta. Por favor, verifique sus datos.' });
        }

        // Si la autenticación es exitosa, establece las variables de sesión
        req.session.first_name = user.first_name;
        req.session.last_name = user.last_name;
        req.session.email = user.email;
        req.session.age = user.age;
        req.session.role = user.role;

        done(null, user);
    } catch (error) {
        return done(error);
    }
}));


//////////////////// SERIALIZACION ///////////////

passport.serializeUser((user, done) => {
    // Serialize the user's ID
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        // Deserialize the user by fetching from the database using the ID
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});


module.exports = passport;