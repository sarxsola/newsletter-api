const bodyParser = require("body-parser");
const express = require("express");
const request = require("express"); 
const https = require("https");

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const { API_KEY } = process.env;


const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html")
})

app.post("/", function(req, res) {
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);
    var key = process.env.API_KEY;
    console.log(key);
    const url = "https://us2.api.mailchimp.com/3.0/lists/f9cbe17eee";
    const options = {
        method: "POST",
        auth: `username:${API_KEY}`
    }

    const request = https.request(url, options, function(response) {
        
        if(response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }
        else {
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
    

});

app.post("/failure", function(req, res) {
    res.redirect("/");
})

app.listen(PORT, function() {
    console.log("App started at port " + PORT);
})


// API KEY
// de5d3239ee8391d3e8879ec58f6e36c5-us2

// LIST ID
// f9cbe17eee
