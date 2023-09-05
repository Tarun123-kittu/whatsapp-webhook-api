// const jwt = require('jsonwebtoken');
require('dotenv').config();
let secret_key = process.env.SECRET_KEY


const jwt = require('jsonwebtoken');


const verifyToken = (req, res, next) => {
    try {
        let token = req.session.token; // Retrieve token from session
       
        if (token) {
            let user = jwt.verify(token, "HHH"); // Verify token using correct secret key
            
            req.result = user 
          
            next();
        } else {
            return res.status(401).json({ message: "Unauthorized user" });
        }
    } catch (error) {
        console.log(error);
        return res.status(401).json({ message: "Unauthorized user" });
    }
};

module.exports = verifyToken;

