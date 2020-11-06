const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController() {
    const _getRedirectedUrl = (req) => {
        return req.user.role === 'admin' ? '/admin/orders' : '/customer/orders'
    }
    
    return {
        login(req,res) {
            res.render('auth/login');
        },

        postLogin(req,res,next) {
            const { email, password } = req.body
            if(!email || !password) {
                req.flash("error", "Missing email or password")
                res.redirect('/login')
            }

            passport.authenticate('local', (err,user,info)=>{
                if(err) {
                    req.flash("error", info.message);
                    return next(err);
                }

                if(!user) {
                    req.flash("error", info.message);
                    return res.redirect('/login');
                }

                req.logIn(user, (err) =>{
                    if(err) {
                        req.flash("error", info.message);
                        return next(err);
                    }
                    return res.redirect(_getRedirectedUrl(req))
                });
            })(req,res,next);
        },

        register(req,res) {
            res.render('auth/register'); 
        },
        
        async postRegister(req,res) {
            const { name, email, password } = req.body;
            if(!name || !email || !password) {
                req.flash("error", "All fields are required")
                req.flash("name", name);
                req.flash("email", email);
                return res.redirect('/register');
            }

            User.exists({ email }, (err,result)=>{  // Check If email already exists
                if(result) {                        //If email exists
                    req.flash("error", "Email is already taken")
                    req.flash("name", name);
                    req.flash("email", email);
                    return res.redirect('/register');
                }
            });

            const hashedPassword = await bcrypt.hash(password,10)  //Hashing the password

            const newUser = new User({ name, email, password: hashedPassword })  //Creating new user

            newUser.save().then((user) =>{
                // return res.redirect('/')
                req.logIn(newUser, (err)=>{
                    if(err) {
                        req.flash("error", info.message);
                        return next(err);
                    }
                    return res.redirect('/')
                })
            }).catch(err => {
                req.flash("error", "Something went wrong")
                return res.redirect('/register');
            })
        },

        logout(req,res) {
            req.logOut();
            return res.redirect('/login');
        }
    }
}

module.exports = authController