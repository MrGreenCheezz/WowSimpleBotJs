const mysql = require('mysql');

function doTheStatusCheck(callback){
    const connection = mysql.createConnection({
        host: 'localhost',
        port: 3315,
        user: 'tswow',
        password: 'password',
        database: 'default.realm.characters'
    });
    connection.connect();
    const value = 1;
    const status = connection.query(`SELECT * FROM characters WHERE online = ?`, [value], function (error, result) {
        if (error) {
            callback(error, null);
            return;
        }
        callback(null, Object.keys(result).length);
    });
    connection.end();
}

module.exports = {doTheStatusCheck}