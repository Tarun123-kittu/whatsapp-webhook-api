let user = require("../models/user")
let bcrypt = require("bcrypt")
let jwt = require('jsonwebtoken')
require('dotenv').config();
let secret_key = process.env.SECRET_KEY
let otpgenerator=require("otp-generator")
let nodemailer=require("nodemailer");



exports.login = async (req, res) => {
    try {
        let { email, password } = req.body
       
        if (!email || !password) {
            return res.json("Fill all the fields")

        }   
        let isuser = await user.findOne({ email: email })
        if (!isuser) {
            return res.json("This email is not registered")
        } else {
            let comparepassword = await bcrypt.compare(password, isuser.password)
            if (!comparepassword) {
                return res.json("Pasword dosen't match")
            } else {
                let token = jwt.sign({
                    id: isuser._id,
                    email: email
                }, secret_key)
                var objData = isuser.toObject() 
                objData.token = token
                req.session.token = token;
                // res.redirect("/dashboard")
                let access_token= req.session.token
                if(access_token){
                    res.status(200).json({
                        message: "loggedIn",
                        data: objData,
                        token: token // Include the token in the response if needed
                    });
                }
               else{
                console.log("something went wong")
               }
            }
        }
    } catch (error) {
        console.log("ERROR::", error)
    }
}

exports.getforgetpassword=async(req,res)=>{
   res.render("forgetpassword")
}

exports.forgetpassword=async(req,res)=>{
        let { email } = req.body;
        if (!email) {
            return res.json("email is required ")
        }
        let result = await user.findOne({ email: email })
        if (!result) {
            return res.json("user not found")
        }
        else {
    
            let date = new Date()
    
            let code = otpgenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            await user.findOneAndUpdate({ email: email }, {
                $set: {
                    otp: code,
                    otp_createdAt: date,
                  
                }
            })                                                                                                          
       
            let transporter = nodemailer.createTransport({
                // host: "smtp.zoho.in",
                // port: 465,                                                                                      
                // secure: true,
                service: 'gmail',
                auth: {
                    user: 'akshitatomarbca05@gmail.com',
                    pass: process.env.GMAIL_PASSWORD
                   }
            })
            let mailDetails = {
                from: "akshitatomarbca05@gmail.com",
                to: email,
                subject: 'whatsAppbot reset password',
                text: 'whatsAppbot reset password',
                html: "<div style='padding:30px; text-align:center; color:black; background-color:blue;'> <h2> " + code + "</h2></div>"
            }
            transporter.sendMail(mailDetails,
                (error, data) => {
                    if (error) {
                        return res.json("something went wrong " + error)
                    } else {
                        return res.json("otp sent to your email")
                    }
                })
        }
    
    
}

exports.getverifyotp=async(req,res)=>{
  return  res.render("otpverification")
}

exports.verifyotp=async(req,res)=>{
        let { otp } = req.body;
        if ( !otp) {
            return res.json("Please fill the otp")
        }
        if(isNaN(otp)){
            return res.json("enter valid otp")
        }
        let result1 = await user.findOne({ otp: otp })
        if (result1) {
            // var dt = dateTime.create();yyy
            // var formatted = dt.format('Y-m-d H:M:S');
            var createdAt = new Date(result1.otp_createdAt);
            let end_at = new Date()
    
            let otp_time = parseInt(Math.abs(end_at.getTime() - createdAt.getTime()) / (1000));
            if (otp_time < 120) {
                if (otp == result1.otp) {
                    await user.findOneAndUpdate({ otp: otp }, {
                        $set: {
                            otp_verified: true,
                            otp_createdAt: new Date(),
                        }
                    })
                    return res.json("otp verified")
    
                } else {
                    return res.json("otp is not correct")
                }
            } else {
                return res.json("otp time expired please resend otp")
            }
        } else {
            return res.json("wrong otp")
        }
    

}

exports.resendotp=async(req,res)=>{
        let  email  = req.query.email;
        if (!email) {
            return res.json("Complete the step of forget password")
        }
        let result = await user.findOne({ email: email })
        if (result) {
            var formatted = new Date();
            let code = otpgenerator.generate(4, { lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false });
            await user.findOneAndUpdate({ email: email }, {
                $set: {
                    otp: code,
                    otp_createdAt: formatted,
                }
            })
            let transporter = nodemailer.createTransport({
                // host: "smtp.zoho.in",
                // port: 465,
                // secure: true,
                service: 'gmail',
                auth: {
                    user: 'akshitatomarbca05@gmail.com',
                    pass: process.env.GMAIL_PASSWORD
                }
            })
            let mailDetails = {
                from: "akshitatomarbca05@gmail.com",
                to: email,  
                subject: 'whatsAppbot resend password',
                text: 'whatsAppbot resend password',
                html: "<div style='padding:30px; text-align:center; color:black; background-color:blue;'> <h2> " + code + "</h2></div>"
            }
            transporter.sendMail(mailDetails,
                (error, data) => {
                    if (error) {    
                        return res.json(" " + error)
                    } else {
                        return res.json("otp sent to your email")
                    }
                })
        } else {
            return res.json("You are not registered")
        }
    
 
}

exports.getresetpassword=async(req,res)=>{
   res.render("resetpassword")
}

exports.resetpassword= async(req,res)=>{
    let {  password, confirm_password } = req.body;
    let email=req.query.email
    if ( !password || !confirm_password) {
        return res.json(" please fill all the parameters")
    }
    let result = await user.findOne({ email: email })
    if (result) {
        if (result.otp_verified == false) {
            return res.json("you cannot update password without verification")
        }
        else {
            let pass = password;
            let confirm_pass = req.body.confirm_password;
            if (pass == confirm_pass) {
                let salt = await bcrypt.genSalt(10)
                let passhash = await bcrypt.hash(confirm_password, salt)
                let result2 = await user.findOneAndUpdate({ email: email }, {
                    $set: {
                        password: passhash,
                        otp_verified: false
                    }
                })
                return res.json("password updated successfully")
            } else {
                return res.json("confirm password dosen't match with password")
            }
        }
    } else {
        return res.json("email not recognised")
    }
}

exports.logout=async(req,res)=>{
    
        req.session.destroy(); // Remove the entire session
        res.clearCookie('jwt'); // Clear the JWT cookie
        return res.send("token destroyed")
}

exports.getchangepassword=async(req,res)=>{
    return res.render("changepassword")
}

exports.changepassword=async(req,res)=>{

        let { password, new_password } = req.body
        
        if (!password || !new_password) {
    
            return res.json("fill all the parameters")
        }
        
        let result = await user.findOne({ _id: req.result.id })


        if (!result) {
    
            return res.json("user not found")
    
        } else {
    
            let ispasswordmatch = await bcrypt.compare(req.body.password, result.password)
            console.log(ispasswordmatch)
            if (ispasswordmatch === true) {
    
                let salt = await bcrypt.genSalt(10);
                let passhash = await bcrypt.hash(new_password, salt)
                await user.findOneAndUpdate({ _id: req.result.id }, {
                    $set: {
                        password: passhash,
                    }
                })
                return res.json("password changed")
            } else {
                return res.json("you are entering incorrect password")
            }
        }
   
}