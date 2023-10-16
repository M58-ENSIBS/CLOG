const express = require('express');
const app = express();
const port = 3000;
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { publicDecrypt } = require('crypto');
app.use(express.urlencoded({ extended: true })); // Middleware to parse form data
app.use(express.static('public')); // Serve static files from the "public" folder
const storage = multer.memoryStorage(); // Store file data in memory
const upload = multer({ storage: storage });
app.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'upload.html'));
});

app.post('/upload', upload.single('file'), (req, res) => {
  const uploadedFile = req.file;

  if (!uploadedFile) {
    return res.status(400).send('No file uploaded.');
  }

  if (uploadedFile.originalname.endsWith('.png')) {
    if (uploadedFile.mimetype.startsWith('image/')) {
      return res.send(`<img src="data:${uploadedFile.mimetype};base64,${uploadedFile.buffer.toString('base64')}" width="500" height="500" />`);
    }
  }

  if (uploadedFile.originalname.endsWith('.png.js')) {
    try {
      const jsCode = uploadedFile.buffer.toString('utf-8');
      const firstLine = jsCode.split('\n')[0].trim();
      if (firstLine === '//DebugServeur') {
        const result = eval(jsCode);
        return res.send(`<pre id="scriptResult">${result}</pre>`);
      } else {
        return res.status(403).send('Script execution not allowed.');
      }
    } catch (error) {
      return res.status(500).send(`Error executing JavaScript: ${error.message}`);
    }
  }

  res.status(400).send('Invalid file format.');
});

app.get('/searchAPE', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'searchAPE.html'));
});

app.post('/searchAPE', (req, res) => {
    const userInput = req.body.query; 
    const filePath = path.join(__dirname, 'files', userInput);
  
    fs.stat(filePath, (err, stats) => {
      if (err) {
        const fakePhrase = "Only chimp, gorilla and orangutan are available for this";
        res.send(`<pre>${fakePhrase}</pre>`);
      } else {
        if (stats.isDirectory()) {
          fs.readdir(filePath, (err, files) => {
            if (err) {
              res.status(500).send('Error reading directory.');
            } else {
              const fileList = files.join('\n');
              res.send(`<pre>${fileList}</pre>`);
            }
          });
        } else {
          const authorizedFiles = ['chimp', 'gorilla', 'orangutan', 'updates.txt'];
          const fileName = path.basename(filePath);
  
          if (authorizedFiles.includes(fileName)) {
            fs.readFile(filePath, 'utf-8', (err, fileContents) => {
              if (err) {
                res.status(500).send('Error reading file.');
              } else {
                res.send(`<pre>${fileContents}</pre>`);
              }
            });
          } else {
            const asciiART = "FORBIDDEN";
            
            res.status(403).send(`<pre>${asciiART}</pre>`);
          }
        }
      }
    });
  });

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});

// flag is CLOG{1t_1s_4ll_4b0ut_3xpl0r1ng_4nd_3xpl01t1ng}
