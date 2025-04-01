const usersController = require('../controllers/usersController');
const passport = require('passport')
module.exports = (app, upload) => {

    // GET -> OBTENER DATOS
    // POST -> ALMACENAR DATOS
    // PUT -> ACTUALIZAR DATOS
    // DELETE -> ELIMINAR DATOS

    app.get('/api/users/find', usersController.findById);
    app.post('/api/users/login', usersController.login);
    app.get('/api/users/me',passport.authenticate('jwt', {session:false}), usersController.getUser)

}