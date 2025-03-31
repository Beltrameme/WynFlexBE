const db = require('../config/config')
const bcrypt = require('bcryptjs')

const User = {}

User.findById = (id, result) => {
    const sql=`
    SELECT
        id,
        email,
        rol,
        password
    FROM
        users
    WHERE
        id = ?
    `;
    db.query(
        sql,
        [id],
        (err, user) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario obtenido:', user[0]);
                result(null, user[0]);
            }
        }
    )
}

User.findByEmail = (email,result) => {
    const sql = `
    SELECT
        id,
        email,
        rol,
        password
    FROM
        users
    WHERE
        email = ?
    `;
    db.query(
        sql,
        [email],
        (err, user) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario obtenido:', user[0]);
                result(null, user[0]);
            }
        }
    )
}

module.exports = User