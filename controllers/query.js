//to verify the callback url from dashboard side - cloud api side
const qaData = require('../queries')
const axios = require("axios");
require('dotenv').config();
const token = process.env.TOKEN;
const mytoken = process.env.MYTOKEN;
const queries = require("../models/queries");
const { find } = require('../models/user');



exports.test1 = async (req, res) => {
    res.status(200).send("working");
};

exports.webhook = async (req, res) => {
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

};

exports.test2 = async (req, res) => {

    res.send("hiii");
}

// exports.webhook_ = async (req, res) => {

//     let body_param = req.body;

//     console.log(JSON.stringify(body_param, null, 2));

//     if (body_param.object) {
//         console.log("inside body param");
//         if (body_param.entry &&
//             body_param.entry[0].changes &&
//             body_param.entry[0].changes[0].value.messages &&
//             body_param.entry[0].changes[0].value.messages[0]
//         ) {
//             let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
//             let from = body_param.entry[0].changes[0].value.messages[0].from;
//             let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

//             console.log("phone number " + phon_no_id);
//             console.log("from " + from);
//             console.log("boady param " + msg_body);
//             const numberPattern = /^[1-9]|10$/;
//             const status = numberPattern.test(msg_body);
//             var customizedMessage = "Welcome to Dolomites Dream help center! 📞"
//             if (status === false) {
//                 var customizedMessage = `
//                                 Welcome to Dolomites Dream help center! 📞  

//                                 Please select a number corresponding to your question:

//                                 1. Which products do we find in apartment/home?
//                                 2. Troubles with safety box for keys, how it works?
//                                 3. Wifi; password?
//                                 4. Is there a parking lot?
//                                 5. Is tap water drinkable?
//                                 6. Where to put rubbish?
//                                 7. Missing Electricity / electricity lack
//                                 8. Is it possible for an early check-in?
//                                 9. Is it possible for a late check-out?

//                                 Simply reply with the number of the question you're interested in, and we'll provide you with the answer you need. If you have any other questions, feel free to ask! 😊
//                                 `.trim().replace(/^\s+/gm, '');

//             } else {
//                 var selectedQuestionNumbers = msg_body
//                     .split(',')
//                     .map(number => parseInt(number.trim()))
//                     .filter(number => !isNaN(number) && number >= 1 && number <= qaData.length);

//                 // Generate the customized message
//                 var customizedMessage = selectedQuestionNumbers.map(number => {
//                     const qaPair = qaData[number - 1]; // Arrays are 0-indexed
//                     if (qaPair) {
//                         return `${number}. ${qaPair.question}\n${qaPair.answer}\n`;
//                     }
//                 }).join('\n');
//             }

//             axios({
//                 method: "POST",
//                 url: "https://graph.facebook.com/v13.0/" + phon_no_id + "/messages?access_token=" + token,
//                 data: {
//                     messaging_product: "whatsapp",
//                     to: from,
//                     text: {
//                         body: customizedMessage
//                     }
//                 },
//                 headers: {
//                     "Content-Type": "application/json"
//                 }

//             });

//             res.sendStatus(200);
//         } else {
//             res.sendStatus(404);
//         }

//     }
// };


exports.webhook_ = async (req, res) => {
    let body_param = req.body;
    if (body_param.object) {
        if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]
        ) {
            let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

            const numberPattern = /^[1-9]|10$/;
            const status = numberPattern.test(msg_body);
            if (status === false) {
                let allqueries = await queries.find()
                const filteredAndSorted = allqueries.sort((a, b) => a.step - b.step);

                let customizedMessage_ = "Welcome to Dolomites Dream help center! 📞"
                customizedMessage_ = filteredAndSorted.map((element, index) => {
                    return element.step + "." + element.question
                })
                customizedMessage_.unshift('Please select a number corresponding to your question:', 'Welcome to Dolomites Dream help center! 📞');
                customizedMessage_.push("Simply reply with the number of the question you're interested in, and we'll provide you with the answer you need. If you have any other questions, feel free to ask! 😊")
                var customizedMessage = customizedMessage_.join('\n');
                
            } else {
                let qaData = await queries.find()
                if (qaData.length > 0) {
                    var selectedQuestionNumbers = msg_body
                        .split(',')
                        .map(number => parseInt(number.trim()))
                        .filter(number => !isNaN(number) && number >= 1 && number <= qaData.length);
                    if (selectedQuestionNumbers.length < 1) {
                        let allqueries = await queries.find()
                        const filteredAndSorted = allqueries.sort((a, b) => a.step - b.step);
        
                        let customizedMessage_ = "Welcome to Dolomites Dream help center! 📞"
                        customizedMessage_ = filteredAndSorted.map((element, index) => {
                            return element.step + "." + element.question
                        })
                        customizedMessage_.unshift('Please select a number corresponding to your question:', 'Welcome to Dolomites Dream help center! 📞');
                        customizedMessage_.push("Simply reply with the number of the question you're interested in, and we'll provide you with the answer you need. If you have any other questions, feel free to ask! 😊")
                        var msg = customizedMessage_.join('\n');
                         var customizedMessage = msg
                    }else{
                       
                            selectedQuestionNumbers= selectedQuestionNumbers.filter((item,
                                index) => selectedQuestionNumbers.indexOf(item) === index);
                        
                          // Generate the customized message
                    var customizedMessage = selectedQuestionNumbers.map(number => {
                        const qaPair = qaData.find(item => item.step === number); // Find the QA pair with matching step
                        if (qaPair) {
                            return `${number}. ${qaPair.question}\n${qaPair.answer}\n`;
                        }
                    }).join('\n');
                    }
                } else {
                    return res.json("There is no stored queries")
                }
            }
            axios({
                method: "POST",
                url: "https://graph.facebook.com/v17.0/" + phon_no_id + "/messages?access_token=" + token,
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
};


// exports.webhook_ = async (req, res) => {
//     let msg_body=req.body.messages
//    let allqueries= await queries.find()
//    const filteredAndSorted = allqueries.sort((a,b) => a.step - b.step);
//    let customizedMessage_ = "Welcome to Dolomites Dream help center! 📞"
//    customizedMessage_ = filteredAndSorted.map((element,index)=>{
//     return element.step +"." + element.question
//    })
//    customizedMessage_.unshift('Please select a number corresponding to your question:', 'Welcome to Dolomites Dream help center! 📞');
//    customizedMessage_.push("Simply reply with the number of the question you're interested in, and we'll provide you with the answer you need. If you have any other questions, feel free to ask! 😊")

// var customizedMessage = customizedMessage_.join('\n')
// let qaData=await queries.find()
//                 if(qaData.length>0){ 
//                     var selectedQuestionNumbers = msg_body
//                     .split(',')
//                     .map(number => parseInt(number.trim()))
//                     .filter(number => !isNaN(number) && number >= 1 && number <= qaData.length);
//                    console.log("selected ",selectedQuestionNumbers.length)
//                    if(selectedQuestionNumbers.length<1){
//                     return res.send(customizedMessage)
//                    }
//                 // Generate the customized message
//                 var customizedMessage = selectedQuestionNumbers.map(number => {
//                     const qaPair = qaData.find(item => item.step === number); // Find the QA pair with matching step
//                     if (qaPair) {
//                         return `${number}. ${qaPair.question}\n${qaPair.answer}\n`;
//                     }
//                 }).join('\n');

//                 return res.send(customizedMessage)
// }
// }


exports.addqueries = async (req, res) => {
    try {

        let obj = [
            {
                "question": "Which products do we find in apartment/home?",
                "answer": "Towels and linen, soap for dishes and hands, a piece of toilet paper, sponge for dishes and teacloth.",
                "step": 1
            },
            {
                "question": "Troubles with safety box for keys, how it works?",
                "answer": "Look at the videos which we sent you before your arrival, insert the code and push down the black button to unlock.",
                "step": 2
            },
            {
                "question": "Wifi; password?",
                "answer": "In apartment you’ll find a book with all informations and the wifi password. If not in the book check under the router or nera it, you’ll find it written",
                "step": 3
            },
            {
                "question": "Is there a parking lot?",
                "answer": "Most of your homes have a parking lot, please check informations which we sent you or the book which is in your apartment. Please respect your assigned parking lot, in order to not create uneases to the other guests or owners.",
                "step": 4
            },
            {
                "question": "Is tap water drinkable ?",
                "answer": "Yes sure. If there’ll be unforeseen communications we immediately comunicate you.",
                "step": 5
            },
            {
                "question": "Where put rubbish?",
                "answer": "Please remember that separate garbage it’s really important to respect our beautiful environment . Outside of your home you find bins to put garbage. If you don’t remember or don’t know how to do, check on the book you have in apartment. Thanks in advance to help us in this important activity!",
                "step": 6
            },
            {
                "question": "Missing Electricity /electricity lack",
                "answer": "Follow instruction that we sent you in the video before your arrival",
                "step": 7
            },
            {
                "question": "It’s possibile early check in?",
                "answer": "Available on demand and if possibile at the price of € 30",
                "step": 8
            },
            {
                "question": "It’s possibile late check out?",
                "answer": "Available on demand and if possibile at the price of € 30",
                "step": 9
            }
        ]

        await queries.create(obj)
        return res.send("success")

    } catch (error) {
        console.log("ERROR::", error)
    }
}

exports.updatequeries = async (req, res) => {
    try {
        let { question, answer } = req.body;
        let id = req.query.id;
        if (!question || !answer) {
            return res.json("fill all the fields")
        } const updatedQuery = await queries.findOneAndUpdate(
            { _id: id },
            { $set: { question: question, answer: answer } },
            { new: true } // Return the updated document
        );
        return res.json("query updated")
        // return res.redirect("/dashboard")
    } catch (error) {
        console.log("ERROR::", error);
        res.status(500).send("Error updating query");
    }
}

exports.deletequeries = async (req, res) => {
    try {
        const id = req.query.id;

        // Find the document being deleted to determine its step value
        const docToDelete = await queries.findOne({ _id: id });

        if (!docToDelete) {
            return res.status(404).send("Query not found.");
        }

        // Delete the document
        await queries.deleteOne({ _id: id });

        // Update step values for remaining documents
        await queries.updateMany(
            { step: { $gt: docToDelete.step } },
            { $inc: { step: -1 } }
        );

        return res.send("Selected query deleted successfully");
    } catch (error) {
        console.log("ERROR::", error);
        res.status(500).send("Error occurred while deleting query.");
    }
};

exports.dashboard = async (req, res) => {
    try {
        let result = await queries.find();
        res.render('dashboard', { result: result });
    } catch (error) {
        console.log("ERROR::", error);
    }
}

exports.getqueriebyid = async (req, res) => {
    try {
        let id = req.query.id;
        let query = await queries.findOne({ _id: id });
        res.render('updatequerie', { query: query });
    } catch (error) {
        console.log("ERROR::", error);
    }
}

exports.addmorequerie = async (req, res) => {
    res.render("addqueries")
}

exports.addquerie = async (req, res) => {
    try {
        let { question, answer } = req.body
        if (!question || !answer) {
            return res.json("fill all the fields")
        }
        let result = await queries.find()
        if (!result) {
            result = 1
        }
        let obj = {
            question: question,
            answer: answer,
            step: result.length + 1
        }

        await queries.create(obj)
        return res.json("query added")
        // return res.send("record added successfully")
    } catch (error) {
        console.log("error", error)
    }
}   