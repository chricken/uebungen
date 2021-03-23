
'use strict';

import dom from './dom.js';
import mathekram from './mathekram.js';

let ausgabe = document.querySelector('main');

// FUNKTIONEN
const paintContent = daten => {
    let index = localStorage.getItem('aufgabenIndex');
    ausgabe.innerHTML = '';

    daten[index].parts.forEach((part, partIndex) => {
        let partDOM = dom.erzeugen({
            eltern: ausgabe,
            klassen: ['part']
        })
        // Part-Überschrift
        dom.erzeugen({
            eltern: partDOM,
            typ: 'h2',
            inhalt: part.name,
            attr: { type: 'text' },
            klassen: ['partHeader'],
        })

        part.fragen.forEach((frage, frageIndex) => {
            dom.templates.frage({
                frage,
                eltern: partDOM,
                partIndex,
                frageIndex,
                daten: daten,
                part: part.fragen,
                refreshFunktion: paintContent
            })
        })
        new ClipboardJS('.copyToClipboard');

    })
}

const paintLinks = daten => {
    document.querySelector('header').innerHTML = '';
    let lsIndex = localStorage.getItem('aufgabenIndex');

    // Links setzen
    daten.forEach((el, index) => {
        dom.erzeugen({
            klassen: ['navLinks', (lsIndex == index) ? 'aktiv' : ''],
            typ: 'a',
            inhalt: el.name,
            eltern: document.querySelector('header'),
            listeners: {
                click(evt) {
                    localStorage.setItem('aufgabenIndex', index);
                    paintContent(daten);
                    [...document.querySelectorAll('header a')].
                        forEach(el => el.classList.remove('aktiv'));
                    evt.currentTarget.classList.add('aktiv');
                }
            },
            styles: {
                color: mathekram.zufallFarbeErzeugen({
                    hue: [40, 80],
                    sat: [40, 60],
                    val: [60, 80]
                })
            }
        })
    })
    paintContent(daten);
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
