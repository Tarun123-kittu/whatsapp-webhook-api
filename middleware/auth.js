const jwt = require('jsonwebtoken');
require('dotenv').config();
let secret_key = process.env.SECRET_KEY


const verifyToken = (req, res, next) => {
    try {

        let token = req.headers.authorization;
        console.log("token1-->",token)
        if (token) {
            token = token.split(" ")[1];
            console.log("token2-->",token)
            let user = jwt.verify(token,"HHH")
            
            req.result=user
        next();

        } else {
             return res.status(401).json({ message: "unauthorized user" })
        }


    } catch (error) {

        console.log(error);
        
        return res.status(401).json({ message: "unauthorized user" })
    }

};

module.exports = verifyToken;



// const verifyToken = (req, res, next) => {
//     try {
//         const token = req.headers.authorization.split(' ')[1];
//         console.log('Token received:', token);
        
//         const decodedToken = jwt.verify(token, 'HHH');
//         console.log('Decoded token:', decodedToken);

//         req.userData = decodedToken; // Store the decoded token data for later use
//         next(); // Move on to the next middleware
//     } catch (error) {
//         console.error('Error verifying token:', error);
//         return res.status(401).json({ message: 'Authentication failed' });
//     }
// };

// module.exports = verifyToken;
