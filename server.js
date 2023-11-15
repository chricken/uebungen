
'use strict';

const opn = require('better-opn');
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

let server = express();

server.use(express.static('public', {
	extensions: ['html']
}));
server.use(express.json({limit: '50mb'}));

// VARIABLEN
let pfade = {
    aufgaben: 'public/aufgaben.json'
}

let daten;

// Funktionen
const ladeDatei = pfad => {
    return new Promise((resolve, reject) => {
        fs.readFile(
            pfad,
            (err, inhalt) => {
                if (err) reject();
                else resolve(inhalt.toString());
            }
        )
    })
}
const speichereDatei = daten => {
    return new Promise((resolve, reject) => {
        fs.writeFile(
            pfade.aufgaben,
            JSON.stringify(daten),
            err => {
                if (err) reject(err);
                else resolve();
            }
        )
    })
}

const init = () => {
    ladeDatei('public/aufgaben.json').then(
        antwort => {
            daten = JSON.parse(antwort);
            server.listen(8080, err => console.log(err || 'Läuft'));
            opn('http://localhost:8080');
            opn('http://localhost:8080/be');
        }
    ).catch(
        console.log
    );
}

// Routen
server.post('/daten_speichern', (req, res) => {
    daten.root = req.body;
    speichereDatei(daten).then(
        () => res.send('ok'),
        err => res.send('Speicherfehler')
    );
})


init();


