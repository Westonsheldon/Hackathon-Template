module.exports = function(req, res) {
    res.render('index.ejs', {
        user: req.user
    })
}