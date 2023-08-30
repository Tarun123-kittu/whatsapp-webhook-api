let queries = require("../controllers/query")
let user = require("../controllers/user")
let auth = require("../middleware/auth")

module.exports = (app) => {

    app.get("/test1", queries.test1)

    app.get("/webhook", queries.webhook)

    app.post("/test", queries.test2)

    app.post("/webhook", queries.webhook_)

    app.post("/login",user.login)

    app.post("/add_queries",queries.addqueries)

    app.post("/update_queries",auth,queries.updatequeries)
     
    app.delete("/delete_queries",auth,queries.deletequeries)

    app.get("/dashboard",auth,queries.dashboard) 

    app.get("/updatequery",auth,queries.getqueriebyid)

    app.get("/add_morequerie",auth,queries.addmorequerie)

    app.post("/add_querie",queries.addquerie)

    app.get("/forget_password_",user.getforgetpassword)

    app.post("/forget_password",user.forgetpassword)

    app.get("/verify_otp_",user.getverifyotp)

    app.post("/verify_otp",user.verifyotp)

    app.post("/resend_otp",user.resendotp)

    app.get("/reset_password_",user.getresetpassword)

    app.post('/reset_password',user.resetpassword)

    app.post('/logout',user.logout)
    
    app.get("/change_password",auth,user.getchangepassword)

    app.post("/changepassword",auth,user.changepassword)
}