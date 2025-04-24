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

User.create = async (user,result) => {
    const hash = await bcrypt.hash(user.password, 10);

    const sql=`
    INSERT INTO
        users(
        email,
        rol,
        password,
        created_at,
        updated_at
        )
        VALUES(?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [
            user.email,
            user.rol,
            hash,
            new Date(),
            new Date()
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id del nuevo usuario:', res.insertId);
                result(null, res.insertId);
            }
        }
    )
}

User.getAll = async (result) => {
    const sql = `
    SELECT * FROM users
    `
    db.query(
        sql,
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('todos los users:', res);
                result(null, res);
            }
        }
    )
}

User.delete = (id, result) => {
    const sql = `
    DELETE FROM
        users
    WHERE
        id = ?
    `;
    db.query(
        sql,
        id,
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id usuario eliminado:', id);
                result(null, id);
            }
        }
    )
}

User.update = async (user, result) => {
    const hash = await bcrypt.hash(user.password, 10);
    const sql = `
    UPDATE
        users
    SET
        email = ?,
        password = ?,
        rol = ?,
        updated_at = ?
    WHERE
        id = ?
    `;
    db.query
    (
        sql,
        [
            user.email,
            hash,
            user.rol,
            new Date(),
            user.id
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario Actualizado:', res.insertId);
                result(null, user.id);
            }
        }
    )
}

module.exports = User