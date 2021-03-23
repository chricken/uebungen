
'use strict';

import dom from './dom.js';
import op from './beoperationen.js';

let ausgabe = document.querySelector('main');

// FUNKTIONEN
const paintContent = daten => {
    //console.log(daten);
    let index = localStorage.getItem('aufgabenIndex');
    ausgabe.innerHTML = '';

    //console.log(index);
    //console.log(daten[index]);

    daten[index].parts.forEach((part, partIndex) => {
        let partDOM = dom.erzeugen({
            eltern: ausgabe,
            klassen: ['part']
        })
        // Part-Überschrift
        dom.erzeugen({
            eltern: partDOM,
            typ: 'input',
            value: part.name,
            attr: { type: 'text' },
            klassen: ['partHeader'],
            listeners: {
                change(evt) {
                    part.name = evt.target.value;
                    op.saveAll(daten);
                    paintContent(daten);
                }
            }
        })

        dom.templates.adder({
            eltern: partDOM,
            clickListener() {
                daten[index].parts.splice(
                    partIndex + 1,
                    0,
                    {
                        name: '',
                        fragen: [{
                            frage: '',
                            typ: 'praxis',
                            schwierigkeit: 0,
                            antworten: []
                        }]
                    }
                )
                op.saveAll(daten);
                paintContent(daten);
            }
        })
        dom.templates.remover({
            eltern: partDOM,
            clickListener() {
                daten[index].parts.splice(
                    partIndex,
                    1
                )
                op.saveAll(daten);
                paintContent(daten);
            }
        })
        part.fragen.forEach((frage, frageIndex) => {
            dom.templates.frageBE({
                frage,
                eltern: partDOM,
                partIndex,
                frageIndex,
                daten: daten,
                part: part.fragen,
                refreshFunktion: paintContent
            })
        })
    })
}

const paintLinks = daten => {
    document.querySelector('header').innerHTML = '';
    // Links setzen
    daten.forEach((el, index) => {
        dom.erzeugen({
            typ: 'input',
            klassen: ['navLinks'],
            value: el.name,
            eltern: dom.$('header'),
            listeners: {
                click(evt) {
                    localStorage.setItem('aufgabenIndex', index);
                    paintContent(daten);
                    dom.$$('header .navLinks').
                        forEach(el => el.classList.remove('aktiv'));
                    evt.currentTarget.classList.add('aktiv');
                },
                change(evt) {
                    daten[index].name = evt.target.value;
                    op.saveAll(daten);
                    paintLinks(daten);
                }
            }
        })

        // Link hinzufügen
        let adder = dom.templates.adder({
            eltern: document.querySelector('header'),
            clickListener() {
                daten.splice(index + 1, 0, {
                    name: "",
                    parts: [
                        {
                            name: "",
                            fragen: [
                                {
                                    "frage": "",
                                    "typ": "praxis",
                                    "schwierigkeit": 0,
                                    "antworten": []
                                }
                            ]
                        }
                    ]
                })

                op.saveAll(daten);
                paintLinks(daten);
            }
        })
        adder.classList.add('inline');

        // Link wieder entfernen
        let remover = dom.templates.remover({
            eltern: document.querySelector('header'),
            clickListener() {
                daten.splice(index, 1)
                op.saveAll(daten);
                paintLinks(daten);
            }
        })
        remover.classList.add('inline');
    })
    paintContent(daten);

    // Diese Syntax, damit die Funktion nur einmal 
    dom.$('#btnSpeichern').onclick = evt => {
        op.saveAll(daten);
        paintLinks(daten);
    }
}

const init = () => {


    fetch('aufgaben.json').then(
        antwort => antwort.json()
    ).then(
        antwort => paintLinks(antwort.root)
    )
}

// INIT
init();
