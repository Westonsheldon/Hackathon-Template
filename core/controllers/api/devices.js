var DB_API = require('../../db_api/db_api.js');
module.exports = function(req, res) {
    DB_API.devices.getAll()
    .then(devices => {
        res.json(devices);
    })
}