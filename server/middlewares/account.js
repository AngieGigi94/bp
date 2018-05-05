const Account = require('../models/Account');
const jwt = require("jsonwebtoken");
require('dotenv').config();


const accountMiddlewares = {
    checkUser: function(req, res, next){
        Account.findOne({$or: [ {user_email: req.body.email}, {display_name: req.body.name}]}) 
        .exec((err, user) => {
            if(err) { 
                console.log(err)
                res.status(500).json({message: 'Internal Server Error', type: 'error'});
            }
            
            if(user) {
                res.json( {
                    message : ( 
                        user.user_email === req.body.email ? "Email" : "Display Name" 
                    ) + " is already taken",
                    type: 'error'
                });
            } else {
                next();
            }
        });
    },

    verifyToken: (req, res, next) => {
        const token = req.headers.authorization.slice(7 - req.headers.authorization.length);
        jwt.verify(token, process.env.KEY1, function(err, decoded) {
            if(err) {
                res.status(401).json({
                    message: "Your session has expired, please login to continue where you left off",
                    type: 'error',
                    code: 401
                });
            }
            
            if(decoded){
                next();
            } 
        });
    }

};

module.exports = accountMiddlewares;