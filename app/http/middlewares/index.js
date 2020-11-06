const user = require("../../models/user");

const middlewareObj = {
    guest(req,res,next) {
        if(!req.isAuthenticated()) {
            return next()
        }
        return res.redirect('/');
    },
    isLoggedIn(req,res,next) {
        if(req.isAuthenticated()) {
            return next()
        }
        return res.redirect('/');
    },
    isAdmin(req,res,next) {
        if(req.isAuthenticated() && req.user.role === 'admin') {
            return next()
        }
        return res.redirect('/')
    }
}

module.exports = middlewareObj
