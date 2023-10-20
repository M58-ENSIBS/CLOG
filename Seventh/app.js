const express = require('express');
const app = express();
// app.js
const PORT = process.env.PORT || 3000;
const path = require('path');
const bodyParser = require('body-parser');
var exec = require('child_process').exec;
const sanitizeHtml = require('sanitize-html');
const cookieParser = require('cookie-parser');
const authConnect = require('http-auth-connect');
var auth = require('http-auth');
const fs = require('fs');
const child_process = require('child_process');




app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser()); // Use cookie-parser

// Create a database of type of apes
const Phone = {
    // Generate 10 phone numbers
    1 : {number: '06 01 02 03 04'},
    2 : {number: '07 01 02 03 04'},
    3 : {number: '06 01 02 03 04'},
    4 : {number: '07 01 02 03 04'},
    5 : {number: '06 01 02 03 04'},
    6 : {number: '07 01 02 03 04'},
    7 : {number: '06 01 02 03 04'},
    8 : {number: '07 01 02 03 04'},
    9 : {number: '06 01 02 03 04'},
    10 : {number: '07 01 02 03 04'},
}

const secret = {
    1 : {secret: "I'm passionate about coding"},
    2 : {secret: "My favorite color is blue"},
    3 : {secret: "I love to eat"},
    4 : {secret: "Enzo is my secret crush"},
    5 : {secret: "My GF is only 14"},
    6 : {secret: "XD?"},
    147258 : {secret: "Password (encrypted) For Intranet : oAeCisG7B6YSTb5pMN0M69UU5WqCSIL0"},
}

const avatar = {
    1 : {link: 'https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_male_user-512.png'},
    2 : {link: 'https://cdn1.iconfinder.com/data/icons/website-internet/48/website_-_female_user-512.png'},
}

  const classmates = {
    1: { name: 'Directeur', surname: 'M. SADOU', age: 23, phone_number: 1, avatar: 1, secret: 1},
    2: { name: 'Lucas', surname: 'CHAPRON', age: 21, phone_number: 2, avatar: 2, secret: 2},
    3: { name: 'Marc', surname: 'BERNARD', age: 23, phone_number: 3, avatar: 1, secret: 3},
    4: { name: 'Enzo', surname: 'DENOUE', age: 22, phone_number: 4, avatar: 1, secret: 4},
    5: { name: 'Bastien', surname: 'COUTAND', age: 30, phone_number: 5, avatar: 1, secret: 5},
    6: { name: 'Copine', surname: 'ENZO', age: 14, phone_number: 6, avatar: 2, secret: 6},
    458: { name: 'Secret', surname: 'Data', age: 99, phone_number: 7, avatar:1, secret: 147258},
  };

// Serve static files (CSS) 
app.use(express.static('public'));

// Define a route to handle classmate search
app.get('/Internal__Directory', (req, res) => {
  const classmateNumber = req.query.user;
  const classmate = classmates[classmateNumber];

  if (classmate) {
    res.send(`
      <html>
        <head>
          <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 90vh;
          }
          
          h1 {
            color: #333;
          }
          
          p {
            color: #666;
            text-decoration: bold;
          }
            </style>
        </head>
        <body>
          <div>
            <h1>Classmate Information</h1>
            <img src="${avatar[classmate.avatar].link}" alt="Cat">
            <p>Name: ${classmate.name}</p>
            <p>Surname: ${classmate.surname}</p>
            <p>Age: ${classmate.age}</p>
            <p>Phone: ${Phone[classmate.phone_number].number}</p>
            <p>Secret: ${secret[classmate.secret].secret}</p> 
            <form action="/DecryptSecret" method="post">
            <input type="hidden" name="Rights" value="0">
            <input type="hidden" name="EncryptedHash" valueclassmate?user=1="X">
            <input type="submit" value="Decrypt Secret">
            </form>
          </div>
        </body>
      </html>
    `);
  } else {
    // Send a picture of a cat if the classmate is not found
    res.send(`
      <html>
        <head>
          <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            background-color: #f0f0f0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 90vh;
          }
          
          h1 {
            color: #333;
          }
          
          p {
            color: #666;
            text-decoration: bold;
          }
            </style>
        </head>
        <body>
          <div>
            <h1>Classmate Not Found</h1>
            <img src="https://media.tenor.com/XGKsolGpZAsAAAAd/monkey-ape.gif" alt="Cat">
          </div>
        </body>
      </html>
    `);
  }
});



const SecretDecoded = "SuperSecurePassword!!))(("

app.post("/DecryptSecret", (req, res) => {
    // Get the body content from the POST request
    const bodyContent = req.body;

    // You can access the data in the body using the field names you specified in the form
    const rights = bodyContent.Rights;
    const secret = bodyContent.EncryptedHash;

    if (secret == "oAeCisG7B6YSTb5pMN0M69UU5WqCSIL0" && rights == "1") {
        res.send(`${SecretDecoded}`);
    } else {
        res.send('WTF')
    }
} );


app.get("/intranett", (req, res) => {
    res.send(`
    <html>
      <head>
        <title>Fake Intranet Login</title>
        <style>
        html {
            height: 100%;
          }
          body {
            margin:0;
            padding:0;
            font-family: sans-serif;
            background: linear-gradient(#141e30, #243b55);
          }
          
          .login-box {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 400px;
            padding: 40px;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,.5);
            box-sizing: border-box;
            box-shadow: 0 15px 25px rgba(0,0,0,.6);
            border-radius: 10px;
          }
          
          .login-box h2 {
            margin: 0 0 30px;
            padding: 0;
            color: #fff;
            text-align: center;
          }
          
          .login-box .user-box {
            position: relative;
          }
          
          .login-box .user-box input {
            width: 100%;
            padding: 10px 0;
            font-size: 16px;
            color: #fff;
            margin-bottom: 30px;
            border: none;
            border-bottom: 1px solid #fff;
            outline: none;
            background: transparent;
          }
          .login-box .user-box label {
            position: absolute;
            top:0;
            left: 0;
            padding: 10px 0;
            font-size: 16px;
            color: #fff;
            pointer-events: none;
            transition: .5s;
          }
          
          .login-box .user-box input:focus ~ label,
          .login-box .user-box input:valid ~ label {
            top: -20px;
            left: 0;
            color: #03e9f4;
            font-size: 12px;
          }
          
          .login-box form a {
            position: relative;
            display: inline-block;
            padding: 10px 20px;
            color: #03e9f4;
            font-size: 16px;
            text-decoration: none;
            text-transform: uppercase;
            overflow: hidden;
            transition: .5s;
            margin-top: 40px;
            letter-spacing: 4px
          }
          
          .login-box a:hover {
            background: #03e9f4;
            color: #fff;
            border-radius: 5px;
            box-shadow: 0 0 5px #03e9f4,
                        0 0 25px #03e9f4,
                        0 0 50px #03e9f4,
                        0 0 100px #03e9f4;
          }
          
          .login-box a span {
            position: absolute;
            display: block;
          }
          
          .login-box a span:nth-child(1) {
            top: 0;
            left: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(90deg, transparent, #03e9f4);
            animation: btn-anim1 1s linear infinite;
          }
          
          @keyframes btn-anim1 {
            0% {
              left: -100%;
            }
            50%,100% {
              left: 100%;
            }
          }
          
          .login-box a span:nth-child(2) {
            top: -100%;
            right: 0;
            width: 2px;
            height: 100%;
            background: linear-gradient(180deg, transparent, #03e9f4);
            animation: btn-anim2 1s linear infinite;
            animation-delay: .25s
          }
          
          @keyframes btn-anim2 {
            0% {
              top: -100%;
            }
            50%,100% {
              top: 100%;
            }
          }
          
          .login-box a span:nth-child(3) {
            bottom: 0;
            right: -100%;
            width: 100%;
            height: 2px;
            background: linear-gradient(270deg, transparent, #03e9f4);
            animation: btn-anim3 1s linear infinite;
            animation-delay: .5s
          }
          
          @keyframes btn-anim3 {
            0% {
              right: -100%;
            }
            50%,100% {
              right: 100%;
            }
          }
          
          .login-box a span:nth-child(4) {
            bottom: -100%;
            left: 0;
            width: 2px;
            height: 100%;
            background: linear-gradient(360deg, transparent, #03e9f4);
            animation: btn-anim4 1s linear infinite;
            animation-delay: .75s
          }
          
          @keyframes btn-anim4 {
            0% {
              bottom: -100%;
            }
            50%,100% {
              bottom: 100%;
            }
          }
          
        </style>
        </head>
        <body>
          <div class="login-box">
            <h2>Login</h2>
            <form method="post" action="/loginINTRA">
              <div class="user-box">
                <input type="text" name="username" required="" autocomplete="off">
                <label>Username</label>
              </div>
              <div class="user-box">
                <input type="password" name="password" required="" autocomplete="off">
                <label>Password</label>
              </div>
              <a href="#" onclick="document.forms[0].submit()">
                Submit
              </a>
            </form>
          </div>
        </body>
        <script>
        document.addEventListener('keydown', function(event) {
          if (event.keyCode === 13) {
            document.forms[0].submit();
          }
        });
        </script>
      </html>
    `);
  });
  
  app.post('/loginINTRA', (req, res) => {
    const { username, password } = req.body;
  
    if (username === 'Secret' && password === 'SuperSecurePassword!!))((') {
      // Place the cookie "!,Re)TRkwDbq?!?G&B-B;YU)+p*d1r" in the user's browser
      res.cookie('session', '!,Re)TRkwDbq?!?G&B-B;YU)+p*d1r');
      res.redirect('/admin');
    } else {
      res.redirect('/intranett');
    }
  });

app.get('/admin', (req, res) => {
    // Check if "session" cookie is present in the user's browser
    const sessionCookie = req.cookies.session;
    if (sessionCookie === '!,Re)TRkwDbq?!?G&B-B;YU)+p*d1r') {
      res.sendFile(path.join(__dirname + '/public/admin.html'));
    } else {
      res.redirect('/intranett');
    }
  });


  app.get('/evalME', function(req, res){
    var id = req.query['id'];
    var id2 = req.query['id2']; 
    // If id and id2 are not specified, return error
    if (!id || !id2) {
        res.send('You must specify id and id2');
    }
    // If id or id2 contains 'app.js', return error
    if (id.includes('app.js') || id2.includes('app.js')) {
        res.send('You can"t use app.js in your query');
    }  
    const regexIP = /([0-9]{1,3}\.){3}[0-9]{1,3}/g;
    if (id.match(regexIP) || id2.match(regexIP)) {
        res.send('You can"t use IP in your query');
    }
   result = eval(id + id2); 
   // if result contains app.js, return error
    if (result.includes('app.js')) {
        res.send('The result of your query contains app.js, you can"t use it');
    }

    res.json({cmd: result});
  
});



  var basic = auth.basic({
    realm: "Intruder ! "},
    function (username, password, callback) {
        callback(username === "TheNewChaineOfMarco" && password === "xx_GenshinImpact_xx");
    });

app.get('/welcome', function (req, res) {
    res.sendFile(path.join(__dirname + '/public/welcome.html'));
    // Place a cookie with new Date().toLocaleDateString()) as value
    res.cookie('date', new Date().toLocaleDateString());
});

app.get('/moderator', authConnect(basic), function (req, res) {
    res.sendFile(path.join(__dirname + '/public/moderator.html'));
});

app.post('/generate', (req, res) => {
    const titre = sanitizeHtml(req.body.title);
    const message = sanitizeHtml(req.body.content);
    // Create a cookie with todays date encoded in b64
    res.send(`Title : ${titre} <br> Message : ${message}
    <!-- Sanitized :D -->
    <br> Date : ${new Date().toLocaleDateString()}
    `);    
});

const allUsers = ['Moderator, Developer, Publisher, WebsiteAdmin']

let isAdminConnected = true; // Define isAdminConnected at the top level

app.post('/Deconnect', (req, res) => {
    const bodyContent = req.body;
    const username = bodyContent.User;
    
    if (username == "Moderator") {
        // Redirect to /index 
        res.redirect('/welcome');
    } else if (username == "Developer" || username == "Publisher") {
        res.send('Disconnecting user ' + username);
    } else if (username == "WebsiteAdmin") {
        // If the cookie 'date' is = to new Date().toLocaleDateString()) , error
        res.send('OK');
        isAdminConnected = false;
    } else {
        res.send('User not found');
    }
});

app.get('/Deconnect', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/QR_SECURE.png'));
});

app.post('/loginADMIN2', (req, res) => {
    const { username, password } = req.body;
    if (username == "WebsiteAdmin" && password == "sexymama") {
          res.send('CLOG{S0_m4nY_St3pS_t0_PwN_Th3_1NtR4n3t}');
          isAdminConnected = true;
    } else {
        res.send('Wrong password or username');
    }
});

app.get('/login', function (req, res) {
    if (isAdminConnected) {
        res.send('You can"t access /login page, admin is currently connected, wait for admin to disconnect');
    } else {
        res.sendFile(path.join(__dirname, 'public', 'login.html'));
    }
});

app.get('/' , (req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
    }
);

app.get('/BackupServerGLOBAL.txt' , (req, res) => {
    res.sendFile(path.join(__dirname + '/BackupServerGLOBAL.txt'));
    });

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/public/losted.html'));
    }
);
// app.js

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});