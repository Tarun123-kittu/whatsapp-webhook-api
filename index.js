const express = require("express");
const body_parser = require("body-parser");
const axios = require("axios");
const qaData = require('./queries')
require('dotenv').config();

const app = express().use(body_parser.json());

const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;

app.listen(process.env.PORT, () => {
    console.log("webhook is listening");
});

//to verify the callback url from dashboard side - cloud api side
app.get("/webhook", (req, res) => {
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];


    if (mode && token) {

        if (mode === "subscribe" && token === mytoken) {
            res.status(200).send(challange);
        } else {
            res.status(403);
        }

    }

});

app.post("/test",(req , res) => {

res.send("hiii");
})

app.post("/webhook", (req, res) => {

    let body_param = req.body;

    console.log(JSON.stringify(body_param, null, 2));

    if (body_param.object) {
        console.log("inside body param");
        if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
        ) {
            let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

            console.log("phone number " + phon_no_id);
            console.log("from " + from);
            console.log("boady param " + msg_body);
            const numberPattern = /^[1-9]|10$/;
            const status = numberPattern.test(msg_body);
            var customizedMessage = "Welcome to Dolomites Dream help center! 📞"
            if (status === false) {
                var customizedMessage = `
                            Welcome to Dolomites Dream help center! 📞

                            Please select a number corresponding to your question:

                            1. Which products do we find in apartment/home?
                            2. Troubles with safety box for keys, how it works?
                            3. Wifi; password?
                            4. Is there a parking lot?
                            5. Is tap water drinkable?
                            6. Where to put rubbish?
                            7. Missing Electricity / electricity lack
                            8. Is it possible for an early check-in?
                            9. Is it possible for a late check-out?

                            Simply reply with the number of the question you're interested in, and we'll provide you with the answer you need. If you have any other questions, feel free to ask! 😊
                            `.trim().replace(/^\s+/gm, '');

            } else {
                var selectedQuestionNumbers = msg_body
                    .split(',')
                    .map(number => parseInt(number.trim()))
                    .filter(number => !isNaN(number) && number >= 1 && number <= qaData.length);

                // Generate the customized message
                var customizedMessage = selectedQuestionNumbers.map(number => {
                    const qaPair = qaData[number - 1]; // Arrays are 0-indexed
                    if (qaPair) {
                        return `${number}. ${qaPair.question}\n${qaPair.answer}\n`;
                    }
                }).join('\n');
            }

            axios({
                method: "POST",
                url: "https://graph.facebook.com/v13.0/" + phon_no_id + "/messages?access_token=" + token,
                data: {
                    messaging_product: "whatsapp",
                    to: from,
                    text: {
                        body: customizedMessage
                    }
                },
                headers: {
                    "Content-Type": "application/json"
                }

            });

            res.sendStatus(200);
        } else {
            res.sendStatus(404);
        }

    }

});

app.get("/", (req, res) => {
    res.status(200).send("working");
});