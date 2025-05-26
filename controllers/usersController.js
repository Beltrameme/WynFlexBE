const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
const nodemailer = require('nodemailer');

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
            const isPasswordValid = await bcrypt.compare(password, myUser.password)

            if(isPasswordValid){
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
            //enviar la data en el header con authorization como "jwt [token]"
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith('jwt ')) {
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
    },
    register(req,res) {
        const user = req.body
        User.create(user, (err,data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
            });
        })
    },
    getAll(req,res){
        User.getAll((err,data) => {
        if (err) {
            return res.status(501).json({
                success: false,
                message: 'Hubo un error',
                error: err
            });
        }

        return res.status(201).json({
            success: true,
            message: 'todos los users',
            data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
        });
    })
    },
    delete(req,res) {
        const id = req.params.id
        User.delete(id, (err, data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con la eliminacion',
                    error: err
                });
            }
            return res.status(201).json({
                success: true,
                message: 'El user se elimino correctamente',
                data: `${id}`
            });
        }) 
    },
    update(req,res){
        const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE

        User.update(user, (err, data) => {

        
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El usuario se actualizo correctamente',
                data: user
            });
            

        }); 
    },
    recovery(req,res){
        const email = req.body.email
        console.log(email);
        

        User.findByEmail(email, (err,data) => {
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'No se encontro al usuario',
                    error: err
                });
            }
            else{
                try {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: 'beltrameme@gmail.com', // Your email
                            pass: 'zsxozpirfadantqe' // Your password or app password
                        }
                    });
            
                    // Email content
                    const mailOptions = {
                        from: 'beltrameme@gmail.com',
                        to: email,
                        subject: 'Contraseña',
                        text: `aca te va: ${data.password}\n\nno la compartas.`
                    };
            
                    // Send email
                    transporter.sendMail(mailOptions);
                    
                    return res.status(201).json({
                        success: true,
                        message: 'La password se envio al email',
                    })
                } catch (error) {
                    console.log(error);
                    
                    return res.status(500).json({
                        success: false,
                        message: 'error inesperado',
                        error: error
                    });
                }
            }
        })
    }
}