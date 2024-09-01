import express from "express";
import path from "path";
import bodyParser from "body-parser";   // To extract data from html body

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;



app.use(bodyParser.urlencoded({ extended: true })); // middleware to parse body parameters


app.use(express.static(path.join(__dirname, 'public')));


app.post("/submit-form",(req,res) =>{

// getting user input
    const user = req.body.username;     // reading name parameter from body -- name = "username"
    const pass = req.body.password;     // same as above
    console.log(user,pass);


// sending username (email) and password to Lambda function to verify,
    const url = "https://5odknxrvbf.execute-api.ap-south-1.amazonaws.com/auth_code/validate_cred";
    const data = {useremail:user,
                   password:pass}
    
    fetch(url,{method:"POST",headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
    .then(response=>response.json())
    .then(data=>{
        console.log(data.statusCode);
        if (data.statusCode===200){
            console.log(data.body);
            global.auth_code = data.body;
            console.log(global.authcode);
        }
        //alert('Add Successful');
    })

// sending response to user
    res.send(`<h1>Thank you, ${user}!</h1>`);
})


// Get to Privacy page
app.get('/privacy', (req, res) => {
    res.sendFile(__dirname + '/public/privacy.html');
});



// double check client id and parameters and display terms of use page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
     global.ClientID = req.body.client_id;    // naming Convention - both letter caps
     global.StateValue = req.body.state;
     global.RedirectUri = req.body.redirect_uri;

    console.log(ClientID);
    console.log(StateValue);
    console.log(RedirectUri);

    if (ClientID === "rohit_123"){

        const state = StateValue;
        const code = auth_code;
        const client_id = ClientID;

        // Get to TermsofUse page
        app.get('/termsofuse', (req, res) => {
            res.sendFile(__dirname + '/public/termsofuse.html');
        });
  
    }

});

// Redirect when accept button is pressed 
app.post('/redirect', (req, res) => {

    console.log(global.auth_code);
    console.log(global.ClientID);
    console.log(global.StateValue);
    res.redirect('https://alexa.amazon.co.jp/spa/skill/account-linking-status.html?vendorId=M35TYDB34J5VU5&state=${encodeURIComponent(global.StateValue)}&code=${encodeURIComponent(global.auth_code)}&client_id=${encodeURIComponent(global.ClientID)}');
    res.redirect("https://pitangui.amazon.com/spa/skill/account-linking-status.html?vendorId=M35TYDB34J5VU5&state=${encodeURIComponent(global.StateValue)}&code=${encodeURIComponent(global.auth_code)}&client_id=${encodeURIComponent(global.ClientID)}");
    res.redirect("https://layla.amazon.com/spa/skill/account-linking-status.html?vendorId=M35TYDB34J5VU5&state=${encodeURIComponent(global.StateValue)}&code=${encodeURIComponent(codeglobal.auth_code)}&client_id=${encodeURIComponent(global.ClientID)}");

})

app.listen(port, () => {
    console.log("server running at port",port);
})
