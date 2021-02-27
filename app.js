
var express = require("express");
var bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
var md5 = require('md5');
var httpRequest = require("https");

var app = express();

mailchimp.setConfig({
    apiKey: '....... added api key here ........',
    server: 'us1',
});

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"))

app.get("/", function(req, res){
    res.sendFile(__dirname+"/signup.html")
});

app.post("/", function(req, res){
    var firstName = req.body.firstName
    var lastName = req.body.lastName
    var email = req.body.inputEmail

    var url = "https://us1.api.mailchimp.com/3.0/lists/c71742a9da/members/"
    var data = {
        "email_address": email,
        "status_if_new": "subscribed",
        "email_type": "text",
        "status": "subscribed",
        "merge_fields": {
            FNAME: firstName,
            LNAME: lastName,
        },
        "interests": {},
        "language": "",
        "vip": false,
        "location": {
          "latitude": 0,
          "longitude": 0
        },
        "marketing_permissions": [],
        "ip_signup": "",
        "timestamp_signup": "",
        "ip_opt": "",
        "timestamp_opt": ""
      }
    var jsonData = JSON.stringify(data);
    const options = {
        method: "POST",
        auth: "suraj:....... added api key here ........"
    }
    var request = httpRequest.request(url, options, function(response){
        if (response.statusCode==200) {
            res.sendFile(__dirname + "/success.html")
        }
        else if (response.statusCode==400) {
            res.sendFile(__dirname + "/alreadySubscribed.html")
        }
        else {
            res.sendFile(__dirname + "/failure.html")
        }
        response.on("data", function(data){
            console.log(JSON.parse(data))
        })
    });
    request.write(jsonData);
    request.end();
});

app.post("/continue", function(req, res){
    res.redirect("/")
});

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running...")
});
