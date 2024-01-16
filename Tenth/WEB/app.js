var express = require('express');
var app = express();
var port = 4444;
var http = require('http');
process.env.PWD = process.cwd()
var fs = require('fs');
const path = require('path')
const _ = require('lodash');

const libxml = require('libxmljs');
const bodyParser = require('body-parser');

app.use(bodyParser.text({ type: 'text/xml' }));



const avatar = {
  1: { link: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678134-sign-check-256.png' },
  2: { link: 'https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678069-sign-error-256.png' },
  3 : { link: 'https://cdn3.iconfinder.com/data/icons/tango-icon-library/48/software-update-urgent-256.png' }
};

const status = {
    1 : {text : 'Done'},
    2 : {text : 'Not Done'},
    3 : {text : 'Urgent'}
}


const sha1associated = {
  1: { 1: '356a192b7913b04c54574d18c28d46e6395428abg' },
2: { 2: 'da4b9237bacccdf19c0760cab7aec4a8359010b0g' },
3: { 3: '77de68daecd823babbb58edb1c8e14d7106e83bbg' },
4: { 4: '1b6453892473a467d07372d45eb05abc2031647ag' },
5: { 5: 'ac3478d69a3c81fa62e60f5c3696165a4e5e6ac4g' },
6: { 6: 'c1dfd96eea8cc2b62785275bca38ac261256e278g' },
49: { 49: '2e01e17467891f7c933dbaa00e1459d23db3fe4fg' }
}

const futurtasks = {
  1: { description: "Improve my site's CSS", avatar: 1 },
  2: { description: "Store my pictures in a database", avatar: 2 },
  3: { description: "Buy a new camera,, with good resolution", avatar: 1 },
  4: { description: "Try to increase my website's traffic", avatar: 2 },
  49: { description: "Update the version of 'lodash' in my project under /FeedBackEndpointTest", avatar: 3 },
};

app.get('/futureonline', (req, res) => {
  const taskHash = req.query.task;
  const taskNumber = Object.keys(sha1associated).find(number => sha1associated[number][number] === taskHash);
  const taskDetails = futurtasks[taskNumber];



  if (taskDetails) {
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
            font-weight: bold; /* fix typo in 'text-decoration' */
          }
          </style>
        </head>
        <body>
          <div>
            <h1>Task n°${taskNumber}</h1>
            <p>Description: ${taskDetails.description}</p>
            <img src="${avatar[taskDetails.avatar].link}" alt="Cat">
            <p>Status: ${status[taskDetails.avatar].text}</p>
          </div>
        </body>
      </html>
    `);
  } else {
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
            font-weight: bold; /* fix typo in 'text-decoration' */
          }

          a:before {
            content: "🙈 ";
          }

          a {
            text-decoration: none;
            color: #333;
            font-weight: bold;
          }


          </style>
        </head>
        <body>
          <div>
            <h1>Task Not Found</h1>
            <img src="https://media.tenor.com/XGKsolGpZAsAAAAd/monkey-ape.gif" alt="Cat">
            </br></br>
            <a href="/futureonline?task=356a192b7913b04c54574d18c28d46e6395428abg">Go back in safe place</a>
          </div>
        </body>
      </html>
    `);
  }
});

// PPB

app.use(express.json());
let user = {
    username: 'M58',
    robot: false,
    bday: '2000.09.26',
}

app.post('/FeedBackEndpointTest', (req, res) => {
    console.log('Data:', req.body )
    let defaults = {
        a: 0,
        b: 0,
        c: 0
    }
    _.merge( defaults, req.body )

    console.log('Global admin prototype value:', ({}).SuperAdminForSuperWebSite__)

    let {a,b,c} = defaults
    return res.send(`Done with PROTO ${a+b+c}`)
})

app.get('/FeedBackEndpointTest', (req, res) => {
    if (!user.SuperAdminForSuperWebSite__) {
        return res.send(`Forbidden, you are not 'SuperAdminForSuperWebSite__'`)
    } else {
        return res.sendFile(process.env.PWD + '/public/files/FeedBackEndpointTest.html');
    }});


function checkInput(xml) {
  // lower xml
  xml = xml.toLowerCase();
  const regex = /app.js|exp.js/g;
  return regex.test(xml);
}
  

app.post('/process', (req, res) => {
  try {
      // Retrieve the XML string directly from req.body
      const xxe = req.body;
      
      // Parsing XML with libxmljs and preventing external entity expansion
      const doc = libxml.parseXml(xxe, { noent: true });
      
      // Accessing elements from the parsed XML
      const contact = doc.get('//contact');
      const name = contact.get('name').text();
      const subject = contact.get('subject').text();
      const mail = contact.get('mail').text();
      const message = contact.get('message').text();

      if (checkInput(xxe)) {
          res.send('You are not allowed to do this !');
          return;
      }

      res.send(`Your mail form ${mail} has been sent`);
  } catch (error) {
    console.log(error);
      res.send('An error has occured');
  }
});

app.get('/css/:file', function(req, res) {
    res.sendFile(process.env.PWD + '/public/css/' + req.params.file);
});

app.get('/js/:file', function(req, res) {
    res.sendFile(process.env.PWD + '/public/js/' + req.params.file);
});

app.get('/', function(req, res) { 
    res.sendFile(process.env.PWD + '/public/files/index.html');
});

app.get('*', function(req, res) {
    res.redirect('/');
});

app.listen(port, function() {
    console.log('http://localhost:' + port);
});