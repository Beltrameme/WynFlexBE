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
    app.post('/api/users/register', usersController.register)
    app.get('/api/users/getall', usersController.getAll)
    app.delete('/api/users/delete/:id',passport.authenticate('jwt', {session:false}), usersController.delete);
    app.put('/api/users/update',passport.authenticate('jwt', {session:false}), usersController.update);

}   