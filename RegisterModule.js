const mysql = require('mysql');
const crypto = require('crypto');
const bigInt = require('big-integer');


const g = 7;
const N = bigInt('894B645E89E1535BBDAD5B8B290650530801B18EBFBF5E8FAB3C82872A3E9BB7', 16);

function sha1(data) {
    return crypto.createHash('sha1').update(data).digest();
}

function generateSalt() {
    return crypto.randomBytes(32);
}

function computeVerifier(username, password) {
    const h1 = sha1(`${username.toUpperCase()}:${password.toUpperCase()}`);
    const salt = generateSalt();
    const h2 = sha1(Buffer.concat([salt, h1]));

    // Преобразуем h2 в целое число в little-endian порядке
    const h2Int = bigInt.fromArray([...h2].reverse(), 256);

    const verifier = bigInt(g).modPow(h2Int, N);

    // Преобразовать обратно в массив байтов в little-endian порядке
    const verifierBytes = Buffer.from(verifier.toArray(256).value.reverse());

    return {
        salt: salt,
        verifier: verifierBytes
    };
}


function CheckForAccount(username, callback) {
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3315,
        user: 'tswow',
        password: 'password',
        database: 'auth'
    });
    var testVar;
    connection.connect();
    const userFound = connection.query(`SELECT * FROM account WHERE username = ?`, [username], function (error, result) {
        if (error) {
            callback("Произошла ошибка запроса!", false);
            return;
        }
        callback(Object.keys(result).length, true);
    });
    connection.end();
}


function registerAccount(username, password, callback) {

    CheckForAccount(username, (message, bool) => {
        if (message === 0) {
            const connection = mysql.createConnection({
                host: 'localhost',
                port: 3315,
                user: 'tswow',
                password: 'password',
                database: 'auth'
            });
            connection.connect();

            const query = 'INSERT INTO account (username, salt, verifier) VALUES (?, ?, ?)';
            const checkQuery = `SELECT * FROM account WHERE username = ?`;



            const { salt, verifier } = computeVerifier(username, password);


            connection.query(query, [username.toUpperCase(), salt, verifier], function (error, results, fields) {
                if (error) {
                    callback(error, "Произошла ошибка")
                }
                else {
                    callback(null, "Аккаунт успешно создан!")
                }
            });

            connection.end();
        }
        else {
            callback(null, "Такой никнейм уже занят!")
        }
    })



}

module.exports = { registerAccount }