const express = require('express');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();
app.use(bodyParser.json());
app.use(express.static(__dirname + "/dist"));

app.post('/api/save_diff', (req, res) => {
    const { text1, text2 } = req.body;

    if (!text1 || !text2) {
        res.status(400).json({ error: 'Both text1 and text2 are required.' });
        return;
    }

    const id = uuidv4();
    const data = {
        text1,
        text2,
    };

    fs.writeFile(path.join(__dirname, "temp", `${id}.json`), JSON.stringify(data), (err) => {
        if (err) {
            res.status(500).json({ error: 'Failed to write file.' });
        } else {
            res.json({ id });
        }
    });
});

app.get('/api/diff/:id', (req, res) => {
    const { id } = req.params;

    fs.readFile(path.join(__dirname, "temp", `${id}.json`), 'utf8', (err, data) => {
        if (err) {
            console.log(`opening file ${path.join(__dirname, "temp", `${id}.json`)}`)
            res.status(404).json({ error: 'File not found.' });
        } else {
            res.json(JSON.parse(data));
        }
    });
});

app.get('/*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html');
});

const port = process.env.PORT || "8080";

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
