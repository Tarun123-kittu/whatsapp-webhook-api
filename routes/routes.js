let queries = require("../controllers/query")

module.exports = (app) => {

    app.get("/test1", queries.test1)

    app.get("/webhook", queries.webhook)

    app.post("/test", queries.test2)

    app.post("/webhook", queries.webhook_)

    app.get("/",queries.login)


}