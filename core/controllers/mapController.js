module.exports = function(req, res) {
    res.render('map.ejs', {
        user: req.user
    })
}