const express = require("express");
const Router = express.Router();

Router.get("/webhooksocket", (req, res) => {
    console.log("start verifications"); 
    if (req.query['hub.mode'] && req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] === '1234567890') {
        console.log("accepted challenge");
        res.send(req.query['hub.challenge'])
        return 'accepted'
    } else {
        res.send('Error, wrong validation token')
    }
});

/***webhook socket ***/
Router.post("/webhooksocket", async(req, res) => { 
    const axios = require('axios');
    console.log('Facebook senderid changes...')
    console.log('Webhook request headers', req.headers)
    console.log('Webhook request body....', JSON.stringify(req.body))
    // console.log('websocket url',process.env.APP_REQUEST_URL)
    if (req.body.object) {

        if (req.body.entry &&
            req.body.entry[0].changes
        ) {
            let userName = "";
            if(req?.body?.entry[0]?.changes[0]?.value?.contacts && req?.body?.entry[0]?.changes[0]?.value?.contacts[0]){
                userName = req?.body?.entry[0]?.changes[0]?.value?.contacts[0]?.profile?.name;
            }

            let usernumberId = req?.body?.entry[0]?.id;

            if(req?.body?.entry && req?.body?.entry[0]?.id){
                usernumberId = req?.body?.entry[0]?.id;
            }
            
            let main_phone_no_id = ""
            if(req?.body?.entry[0]?.changes[0]?.value?.metadata?.display_phone_number){
                 main_phone_no_id = req?.body?.entry[0]?.changes[0]?.value?.metadata?.display_phone_number;
            }
           
            let facebookSendMessageId = ""
            if(req?.body?.entry[0]?.changes[0]?.value?.metadata?.phone_number_id){
                facebookSendMessageId = req?.body?.entry[0]?.changes[0]?.value?.metadata?.phone_number_id;
            }
            

            let messageId = "";
            let messageStatus = "";
            if(req?.body?.entry[0]?.changes[0]?.value?.statuses){
                messageId = req?.body?.entry[0]?.changes[0]?.value?.statuses[0]?.id;

                messageStatus = req?.body?.entry[0]?.changes[0]?.value?.statuses[0]?.status;
            }
            console.log('message ID',messageId)
           

            let userPhoneNumber = "";
            if(req?.body?.entry[0]?.changes[0].value?.messages && req?.body?.entry[0]?.changes[0].value?.messages[0].from){
                userPhoneNumber = req?.body?.entry[0]?.changes[0].value?.messages[0].from;
            }
            
            let msg_body = "";
            if(req?.body?.entry[0]?.changes[0].value?.messages && req?.body?.entry[0].changes[0].value?.messages && req?.body?.entry[0]?.changes[0].value?.messages && req?.body?.entry[0].changes[0].value?.messages[0]?.text?.body){
                console.log("messages......",req?.body?.entry[0].changes[0].value?.messages[0]) 
                msg_body = req?.body?.entry[0].changes[0].value?.messages[0]?.text?.body;
            }

            if(req?.body?.entry[0]?.changes[0].value?.messages && req?.body?.entry[0].changes[0].value?.messages && req?.body?.entry[0]?.changes[0].value?.messages && req?.body?.entry[0].changes[0].value?.messages[0]?.type == 'button'){

                msg_body = "Ok, let's test"  
            } 

            let interactive = "";
            if(req?.body?.entry[0]?.changes[0].value?.messages && req?.body?.entry[0].changes[0].value?.messages[0]?.interactive){
                interactive  = req?.body?.entry[0].changes[0].value?.messages[0]?.interactive
            }
           
            req.io.emit("new-message", { content: req.body });
            const data = {
                "name": userName,
                "phoneNumber": userPhoneNumber,
                "facebookSenderMessageId":facebookSendMessageId,
                "userNumberId": usernumberId,
                "tagslist": "",
                "mainPhoneNumber": main_phone_no_id,
                "message": msg_body,
                "interactive":interactive,
                "messageId":messageId,
                "messageStatus":messageStatus
            }; 

            console.log("send request data",data)

            //const requestUrl = `https://synkaa-api.symple.co.in/synkaa-app/api/users/webhookdev`;
            const requestUrl = `${process.env.APP_REQUEST_URL}`;
            const options = {
                headers: {
                  "user-agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.111 Safari/537.36",
                },
            };
            axios({
                url: requestUrl,
                method: 'post',
                data: data,
                headers: { 
                    'Content-Type': 'application/json'
                },
            }).then((result) => {
                req.io.emit("new-message", { content: req.body });
                return { ...result?.data?.data };
            }).catch(error => {
                console.log("application errors",error?.response?.data);
                return "exception occurs";
            });

            // You can do validation or database stuff before emiting
            return res.send({ success: true });
        }else{
            return res.send({ failure: JSON.stringify(req.body) });
        }
    } 
});

/***webhook socket ***/
Router.post("/testsocket", async(req, res) => {
    console.log('test socket')
    req.io.emit("new-message", { content: "test socket requests....." });
});

Router.get("/health-check", async(req, res) => {
    console.log('Successfully served')
    return res.send("Successfully served")
});

module.exports = Router;