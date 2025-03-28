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
    }
}