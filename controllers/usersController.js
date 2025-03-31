const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');

module.exports = {
    findById(req,res) {
        const id = req.body

        User.findById(id, (err,data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'User: ',
                data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
            }); 
        })
    },
    login(req,res) {
        const email = req.body.email;
        const password = req.body.password;

        User.findByEmail(email, async(err, myUser) => {
            console.log('Ocurrio un error: ', err );
            console.log('USUARIO: ', myUser);
            
            if(err){
               return res.status(501).json({
                success: false,
                message: 'Ocurrio un error con el Login',
                error: err
               }) 
            }
            if(!myUser){
                return res.status(401).json({
                    success:false,
                    message: 'Email no encontrado'
                })
            }

            const isPasswordValid = await bcrypt.compare(password, myUser.password)

            if(isPasswordValid){
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey, {})

                const data = {
                    id: `${myUser.id}`,
                    rol: myUser.rol
                }
                return res.status(201).json({
                    success: true,
                    message: 'Login correcto',
                    data: data
                })
            }
            else {
                return res.status(401).json({ // EL CLIENTE NO TIENE AUTORIZACION PARTA REALIZAR ESTA PETICION (401)
                    success: false,
                    message: 'El password es incorrecto'
                });
            }
        })
    }
}