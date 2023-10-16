const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const puppeteer = require('puppeteer');

express.static.mime.define({ 'application/javascript': ['js'] });


app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Middleware to check and set the isAdmin cookie
app.use((req, res, next) => {
  const initialCookieValue = 'aXNBZG1pbj1mYWxzZQ';
  const decodedCookie = Buffer.from(req.cookies.initialCookie || '', 'base64').toString('utf-8');

  // Check if the decoded cookie contains "isAdmin=true"
  if (decodedCookie === 'isAdmin=true') {
    req.isAdmin = true;
  } else {
    req.isAdmin = false;
  }

  // Set the initial cookie (if it doesn't exist)
  if (!req.cookies.initialCookie) {
    res.cookie('initialCookie', initialCookieValue);
  }

  next();
});


// Handle login POST request
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Check if the login credentials are correct
  if (username === 'admin' && password === '6c8ec5a630d38b8cd1873b38e6512c14') {
    // Set "isAdmin=true" in the initial cookie upon successful login
    res.cookie('initialCookie', 'aXNBZG1pbj10cnVl');
    res.redirect('/adminPanel');
  } else {
    res.send('Invalid login credentials.');
  }
});


app.post('/capture-screenshot', async (req, res) => {
  const urlToCapture = req.body.url;

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the cookie for the specified domain and path
    await page.setCookie({
      name: 'SuperSecretCookie',
      value: 'UltraSecretCookieForUltraSecuredWebSite=)',
      domain: 'localhost:3000', // Replace with the actual domain
      path: '/', // Replace with the desired path
    });

    await page.goto(urlToCapture);

    const screenshotBuffer = await page.screenshot();
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Disposition', 'inline; filename=screenshot.png');
    res.send(screenshotBuffer);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while capturing the screenshot.');
  }
});

app.post('/execute-js', (req, res) => {
  const jsCode = req.body.jsCode;
  try {
    // Execute the provided JavaScript code
    const result = eval(jsCode);
    res.json({ result });
  } catch (error) {
    res.json({ error: error.message });
  }
  // Make this script never crash
  process.on('uncaughtException', () => {});
});


app.post('/ToBeDeleted!', (req, res) => {
  const { name, surname, age, job } = req.body;

  // Display user information in the resume as HTML
  const resume = `
    <h1>Resume</h1>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Surname:</strong> ${surname}</p>
    <p><strong>Age:</strong> ${age}</p>
    <p><strong>Job:</strong> `+job+`</p> 
    <img src="https://static.nationalgeographic.fr/files/styles/image_3200/public/chimpanzee_01.jpg?w=1900&h=1264" alt="Chimpanzee" width="250" height="250">
  `;
  // Send the HTML resume as a response
  res.send(resume);
});

app.get('/ToBeDeleted!', (req, res) => {
  // Return admin credentials
  res.json({
    name: 'admin',
    surname: 'CLOG{1_w4s_w4it1nG_4_U_:)}',
    age: 30,
    job: 'admin',
  });
});

app.get('/api/checkCookie', (req, res) => {
  if (req.isAdmin) {
    res.json({ isAdmin: true });
  } else {
    res.json({ isAdmin: false });
  }
});


app.get('/adminPanel', (req, res) => {
  // Check if req. is true
  if (req.isAdmin) {
    res.sendFile(path.join(__dirname, '/public/adminPanel.html'));
  } else {
    res.status(403).send('Access denied');
  }
});

app.get('/sandbox', (req, res) => {

  if (req.cookies.SuperSecretCookie === 'UltraSecretCookieForUltraSecuredWebSite=)') {
    res.sendFile(path.join(__dirname, '/public/sandbox.html'));
  } else {
    res.status(403).send('Access denied');
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/login.html'));
});


app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/login.html'));
}
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
