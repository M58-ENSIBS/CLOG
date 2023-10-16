var express = require('express');
var app = express();
var port = 4444;
var http = require('http');
process.env.PWD = process.cwd()
var fs = require('fs');
var htmlspecialchars = require('htmlspecialchars');
const path = require('path')
const stream = require('stream')
const { PDFDocument, rgb } = require('pdf-lib')
var auth = require('http-auth');
const authConnect = require('http-auth-connect');
const _ = require('lodash'); // Administrat0r_of_APE_Empire
const latex = require('node-latex')


var basic = auth.basic({
    realm: "Moderator Place Only ! "},
    function (username, password, callback) {
        callback(username === "MeTheOnlyOne" && password === "Best_P4ssw0rD_f0r_b3st_S3cUr1tY");
    });

app.get('/Most_Secure_WebPageFor_Moderator_Only', authConnect(basic) , function(req, res) {
    res.sendFile(path.join(__dirname, 'public', 'Most_Secure_WebPageFor_Moderator_Only.html'));
});


/**
 * In case there is a leak with my Latex implementation, I delete all the pages except for the first one
 */


app.get('/latex', function(req, res, err) {
    const input = fs.createReadStream('input.tex')
    fs.writeFile('/tmp/lastname.tex', req.query.lastname, {
        encoding: 'utf8'
    }, function(err, result) {
        if (err) console.log('error', err);
    });
    fs.writeFile('/tmp/firstname.tex', req.query.firstname, {
        encoding: 'utf8'
    }, function(err, result) {
        if (err) console.log('error', err);
    });
    fs.writeFile('/tmp/age.tex', req.query.age, {
        encoding: 'utf8'
    }, function(err, result) {
        if (err) console.log('error', err);
    });
    fs.writeFile('/tmp/situation.tex', req.query.situation, {
        encoding: 'utf8'
    }, function(err, result) {
        if (err) console.log('error', err);
    });
    fs.writeFile('/tmp/skills.tex', req.query.skills, {
        encoding: 'utf8'
    }, function(err, result) {
        if (err) console.log('error', err);
    });
    fs.writeFile('/tmp/motivation.tex', req.query.motivation, {
        encoding: 'utf8'
    }, function(err, result) {
        if (err) console.log('error', err);
    });

    function generateRandomString(length) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }
    random = generateRandomString(15);

    const output = fs.createWriteStream('./mycv/' + random + ".pdf")
    const pdf = latex(input)
    const pdfData = [];
    const captureStream = new stream.Writable({
        write(chunk, encoding, callback) {
            pdfData.push(chunk);
            callback();
        },
    });

    pdf.pipe(captureStream);

    pdf.on('finish', async () => {
        console.log('[+] Generated pdf : ' + random + ".pdf");
    
        const pdfDoc = await PDFDocument.load(Buffer.concat(pdfData));
    
        const newPdfDoc = await PDFDocument.create();
        const [firstPage] = await newPdfDoc.copyPages(pdfDoc, [0]);
        newPdfDoc.addPage(firstPage);
    
        const pdfBytes = await newPdfDoc.save();
    
        fs.writeFileSync('./mycv/' + random + ".pdf", pdfBytes);
    
        res.setHeader('Content-Disposition', `attachment; filename=${random}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
    
        res.end(pdfBytes);
    });


});

app.get('/mycv', function sleep(req, res) {
    if (req.session.pdfuuid) {
        res.sendFile(
            path.join(__dirname, "/mycv/" + random + ".pdf")
        );
    } else {
        res.redirect("/");
    }
});

app.get('/', function(req, res) {
    app.use(express.static(process.env.PWD + '/img'));
    fs.readFile(__dirname + '/public/index.html', {
        encoding: 'utf8'
    }, (err, text) => {
        res.send(text);
    });
});


// PPB

app.use(express.json())
let user = {
    username: 'rick00',
    robot: false,
    bday: '1997.11.27'
}

app.post('/process', (req, res) => {
    console.log('Data:', req.body )
    let defaults = {
        a: 0,
        b: 0,
        c: 0
    }
    _.merge( defaults, req.body )

    console.log('Global admin prototype value:', ({}).Administrat0r_of_APE_Empire )

    let {a,b,c} = defaults
    return res.send(`Done with PROTO ${a+b+c}`)
})

app.get('/AdminORMonkeyOnly', (req, res) => {
    if (!user.Administrat0r_of_APE_Empire) {
        console.log('User access rejected.')
        return res.sendStatus(403)
    }
    return res.json('Well done ! Here is your flag : CLOG{Prot0tYp3_1s_4w3s0m3}')
})


app.listen(port, function() {
    console.log('http://localhost:' + port);
});


