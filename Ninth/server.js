const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const cookieParser = require('cookie-parser');


app.use(cookieParser());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/searchProfessor', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/professor.html'));
});

app.get('/css/index.css', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/css/index.css'));
});

app.get('/css/singes.css', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/css/singes.css'));
});

app.get('/css/ent.css', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/css/ent.css'));
});

app.get('/singes', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/singes.html'));
});

app.get('/ENT', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/ent.html'));
});


app.post('/loginENT', (req, res) => {
    const { pseudo, password } = req.body;
    console.log(`${pseudo} is ${password}`);

    if(pseudo === 'admin' && password === 'admin') {
        res.cookie('token', '97ad1930ef8197ad1930ef814ac914092279ada248994ac914092279ada24899', { maxAge: 900000, httpOnly: true });
        res.redirect('/ent_admin');
    }
    else if (pseudo === 'BernardMarc' && password === 'DumbPassword') {
        res.redirect('/bernard_projects');
    }
    else {
        res.redirect('/ENT');
    }
});


app.get('/ent_admin', function(req, res) {
    console.log(req.cookies);
    try {
        const token = req.cookies.token;
        console.log(token);
        if(token === '97ad1930ef8197ad1930ef814ac914092279ada248994ac914092279ada24899') {
            res.sendFile(path.join(__dirname, 'public/ent_admin.html'));
        } else {
            res.redirect('/ENT');
        }
    } catch(e) {
        res.redirect('/ENT');
    }

});

app.get('/__creds__/bernard-marc', (req, res) => {
    let cookie = "CookieHyperSecure145578";
    try { 
        for (let i = 0; i < cookie.length; i++) {
            if(req.cookies.mycookie[i] !== cookie[i]) {
                if (typeof req.cookies.mycookie[i] === 'undefined') {
                    res.send('Length of cookie do not match');
                    return
                }
                res.send(req.cookies.mycookie[i] + ' is incorrect');
                return
            }
        }
        res.send('BernardMarc:DumbPassword');
    }
    catch(e) {
        res.send('"mycookie" is undefined, wait is this a CWE for Information Exposure Through an Error Message ?');
    }
});

app.get('/ent_marco', (req, res) => {   
    res.sendFile(path.join(__dirname, 'public/ent_marco.html'));
});

app.get('/bernard_projects', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/bernard_projects.html'));
});

app.get('/bernard_projects/monkeygen', (req, res) => {
    let { sexe } = req.query;

    console.log(sexe);
    if (sexe.length == 1) {
        const filepath = path.resolve("./names/" + sexe);
        const lines = fs.readFileSync(filepath, "utf-8").split("\n");
        const name = lines[Math.floor(Math.random() * lines.length)];

        res.status(200);
        res.send({ name });
        return;
      } else {
        res.send({ error: "Only one letter is allowed and sexe can't be neutral XD" });
    
      res.status(500);
      res.send({ error: "Unable to generate ape name" });
    }
});

app.get('/js/ent_admin.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/js/ent_admin.js'));
});

app.get('/js/bernard_projects.js', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/js/bernard_projects.js'));
});

app.get('/css/ent_admin.css', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/css/ent_admin.css'));
});

app.get('/css/bernard_projects.css', function(req, res) {
    res.sendFile(path.join(__dirname, 'public/css/bernard_projects.css'));
});

app.get('/CryptoNique', function(req, res) {
    res.send(`
    random.seed(random.randrange(0, 1337))
    task_clear = REDACTED
    task_out = ''.join(random.choices(flag, k=len(task_clear)*5))
    print(task_out)
`);
}
);

app.get('/', function(req, res) {
    res.status(200);
    res.sendFile(path.resolve("./public/index.html"));
});

app.get('*', function(req, res) {
    res.redirect('/');
});

// Start Application
app.listen(3000, () => console.log('http://localhost:3000'));


// flag => CLOG{This_Monkey_BernardMarc_Is_Retarded_He_Thinks_He_Is_A_Programmer}
