const mysql = require('mysql2') //sacar el 2 si no funciona, ambos paquetes son validos

const db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'ChilliWilly2203#',
    database: 'wynflex'
})

db.connect(function(err){
    if(err) throw err;
    console.log('db conectada');
    
})

module.exports = db