const mongoose = require ('mongoose')
const config = require('./src/config/config');


module.exports = {
    connect: ()=>{
        return mongoose.connect(config.DB_URL, {}).then(connection =>{
            console.log('Conexion a base de datos exitosa')
        }).catch(err => console.log(err) )
    }
}