const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const md5 = require('md5');

const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(bodyParser.json());

app.post('/calculate', (req, res) => {
    const input = req.body.calculation;

    if (input.includes('require') || input.includes('child_process') || input.includes('fs')) {
        res.status(400).json({ error: 'No no no :)' });
        return;
    }
    if (input.startsWith('eval')) {
        res.status(400).json({ error: 'WTF !!!' });
        return;
    }
    if (input.length > 84) {
        res.status(400).json({ error: 'Too long, your length : ' + input.length + ' my length : 84' });
        return;
    }
    try {
        const result = eval(input);
        if (result === undefined) {
            res.status(400).json({ error: 'Dumb APE' });
        } else {
            res.json({ result: result.toString() }); // Convert result to a string
        }
    } catch (error) {
        res.status(400).json({ error: 'Invalid input' });
    }
});

app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const hash = md5(password);

    if (username === 'admin' && hash === '97f766423f1b8edd9f788210b2d717c4') {
        res.json({ message: 'You are logged in', flag: 'CLOG{mY_3y3s_4r3_0p3n}' });
    } else {
        res.status(400).json({ error: 'Invalid credentials' });
    }
});

app.get('/calculate', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'calculate.html'));
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
