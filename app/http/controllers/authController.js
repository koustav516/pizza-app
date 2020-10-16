const User = require('../../models/user');
const bcrypt = require('bcrypt');

function authController() {
    return {
        login(req,res) {
            res.render('auth/login');
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
                return res.redirect('/')
            }).catch(err => {
                req.flash("error", "Something went wrong")
                return res.redirect('/register');
            })
        }
    }
}

module.exports = authController