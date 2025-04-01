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
            //comentado porque todavia no esta la encriptacion de la password
            /*const isPasswordValid = await bcrypt.compare(password, myUser.password)*/

            if(/*isPasswordValid*/ password == myUser.password){
                const token = jwt.sign({id: myUser.id, email: myUser.email}, keys.secretOrKey, {})

                const data = {
                    id: `${myUser.id}`,
                    rol: myUser.rol,
                    session_token: `JWT ${token}`
                }
                return res.status(201).json({
                    success: true,
                    message: 'Login correcto',
                    data: data
                })
            }
            else {
                return res.status(401).json({
                    success: false,
                    message: 'El password es incorrecto'
                });
            }
        })
    },
    getUser(req,res){
        try {
            //enviar la data en el header con authorization como "bearer [token]"
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({
                    success: false,
                    message: 'Authorization header missing or invalid'
                });
            }

            const token = authHeader.split(' ')[1];
            
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: 'No se envio un token'
                });
            }
    
            const decoded = jwt.verify(token, keys.secretOrKey);
            
            const userData = {
                id: decoded.id,
                email: decoded.email,
                rol: decoded.rol
            };
    
            return res.status(200).json({
                success: true,
                message: 'User Encontrado',
                user: userData
            });
    
        } catch (error) {
            console.log("error");
            console.log(error);
            
            
            let message = 'Fallo al autenticar usuario';
            if (error instanceof jwt.JsonWebTokenError) {
                message = 'Token invalido';
            } else if (error instanceof jwt.TokenExpiredError) {
                message = 'Token expirado';
            }
    
            return res.status(401).json({
                success: false,
                message: message
            });
        }  
    }
}