const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const logger = require('morgan')
const cors = require('cors')
const multer = require('multer')
const passport = require('passport');
const session = require('express-session');

const userRoutes = require('./routes/userRoutes');

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({
    extended:true
}))
app.use(cors())
app.use(session({ secret: 'somevalue' }))
app.disable('x-powered-by')
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport);
const port = process.env.PORT || 3000
app.set('port',port)

const upload = multer({
    storage: multer.memoryStorage()
})

server.listen(3000, '192.168.0.17' || 'localhost', function(){
    console.log("Aplicacion de NodeJS " + process.pid + " Iniciada")
})

app.get('/', (req,res) => {
    res.send('raiz del backend')
})

userRoutes(app, upload);

//error handling
app.use((err,req,res,next) => {
    console.log(err)
    res.status(err.status || 500).send(err.stack)
})