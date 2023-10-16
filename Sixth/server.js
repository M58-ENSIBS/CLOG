const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const path = require('path');
const crypto = require('crypto');
const pemToJwk = require('pem-jwk').pem2jwk;
const NodeRSA = require('node-rsa');

express.static.mime.define({ 'application/javascript': ['js'] });

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.post('/download-note', (req, res) => {
  const noteText = req.body.note;
  const timestamp = Math.floor(Date.now() / 1000);
  const filename = `note_${timestamp}.txt`;
  fs.writeFileSync(filename, noteText, 'utf-8');

  res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
  res.setHeader('Content-Type', 'text/plain');

  res.download(filename, () => {
    fs.renameSync(filename, `notes/${filename}`);
  });
});

const adminToken = "mY_p3rS0n4l_t0k3N_f0r_mY_0Wn_JwT"
const adminTokenEncoded = Buffer.from(adminToken).toString('base64');

function notAuthorized(res) {
  res.status(403).send(`
    You are not authorized to access this page.
    <script>
      setTimeout(function () {
        window.location.href = '/';
      }, 3000);
    </script>
  `);
}

const adminUser = { sub: 'xxxxxxxxx', b64token: "xxxxxxxxxxxxxxxxxxx" };

// Generate RSA key pair 
const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
    },
    privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
    },
});

const jwkHeader = pemToJwk(publicKey);

jwkHeader.kid = '0123456789';

const jwtHeader = {
    alg: 'RS256',
    typ: 'JWT',
    kid: '0123456789',
    jwk: jwkHeader
};

const accessToken = jwt.sign(adminUser, privateKey, { algorithm: 'RS256', header: jwtHeader });

app.use(cookieParser());
app.use((req, res, next) => {
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: true
  });
  next();
});

app.get('/administrator', (req, res) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
      notAuthorized(res);

  } else {
      try {
          const decodedHeader = jwt.decode(accessToken, { complete: true }).header;

          if (decodedHeader.alg !== 'RS256') {
              notAuthorized(res);
              return;
          }

          const key = new NodeRSA();
          key.importKey({
              n: Buffer.from(decodedHeader.jwk.n, 'base64'),
              e: Buffer.from(decodedHeader.jwk.e, 'base64')
          }, 'components-public');
          const publicKey = key.exportKey('pkcs8-public-pem');
      
          const decodedToken = jwt.verify(accessToken, publicKey);

          if (decodedToken.sub === 'administrator' && decodedToken.b64token === adminTokenEncoded) {
              res.sendFile(path.join(__dirname, '/public/administrator-panel.html'));            
          } else {
              notAuthorized(res);
          }     
      } catch (err) {
        notAuthorized(res);
      }
  }
}
);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.get('/render', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/render.html'));
});

app.get('/mailchimp', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/mailroom.html'));
} );

app.get('/404', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/404.html'));
});

app.get('/notes/note_1689018340.txt', (req, res) => {
  res.sendFile(path.join(__dirname, '/notes/note_1689018340.txt'));
});

app.get('/notes/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/404.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

