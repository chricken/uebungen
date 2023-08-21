
'use strict';

import op from './beoperationen.js';

let dom = {
    $(sel) {
        return document.querySelector(sel);
    },
    $$(sel) {
        return [...document.querySelectorAll(sel)];
    },
    erzeugen({
        inhalt = false,
        klassen = [],
        typ = 'div',
        eltern = false,
        listeners = {},
        value = false,
        attr = {},
        styles = {},
        rndBG = false
    } = {}) {
        let neu = document.createElement(typ);
        if (klassen.length) neu.className = klassen.join(' ');
        if (inhalt) neu.innerHTML = inhalt;
        if (value) neu.value = value;
        if (eltern) eltern.appendChild(neu);
        Object.entries(listeners).forEach(listener => neu.addEventListener(...listener));
        Object.entries(attr).forEach(attribut => neu.setAttribute(...attribut));
        Object.entries(styles).forEach(style => neu.style[style[0]] = style[1]);

        if (rndBG) neu.style.backgroundColor = `hsl(${~~(Math.random() * 360)},20%,90%)`;

        return neu;
    },
    templates: {
        frage({
            frage = {},
            eltern = false,
            partIndex = 0,
            frageIndex = 0,
            daten = [],
        } = {}) {
            let container = dom.erzeugen({
                eltern,
                klassen: ['fragenContainer', 'fragenContainerFE'],
                rndBG: true
            })

            dom.erzeugen({
                eltern: container,
                klassen: ['index', `skill${frage.schwierigkeit}`],
               // inhalt: `<span class="smallText">${partIndex}</span>.${frageIndex}`
                inhalt: `${partIndex}.${frageIndex}`
            })

            let f = frage.frage;
            f = f.split('\n').join('<br />');
            dom.erzeugen({
                inhalt: f,
                eltern: container,
                klassen: ['taFrage'],
            })

            if (!frage.antworten.length) frage.antworten.push('');
            dom.erzeugen({
                typ: 'h4',
                inhalt: 'Antworten',
                eltern: container,
                listeners: {
                    click(evt) {
                        let antworten = evt.currentTarget.parentNode.querySelector('.antworten');
                        console.log(antworten);
                        antworten.classList.toggle('open');
                    }
                }
            })

            let antwortenContainer = dom.erzeugen({
                eltern: container,
                klassen: ['antworten']
            })

            frage.antworten.forEach((antwort, antwortIndex) => {
                dom.templates.antwort({
                    antwortIndex,
                    frage,
                    daten,
                    eltern: antwortenContainer,
                })
            })
            return container;
        },
        antwort({
            antwortIndex = 0,
            eltern = false,
            frage = {},
        }) {
            let antwort = frage.antworten[antwortIndex];
            let antwortHTML = antwort.split('\n').join('<br />');

            let antwortkasten = dom.erzeugen({
                inhalt: antwortHTML,
                eltern,
                klassen: ['antwort', 'antwort_fe', 'antwort_' + antwortIndex],
            })

            dom.erzeugen({
                klassen: ['copyToClipboard'],
                inhalt: 'Copy',
                eltern: antwortkasten,
                attr: {
                    'data-clipboard-text': antwort
                },
                listeners: {
                    click(evt) {
                        evt.target.innerHTML = 'Copied';
                        setTimeout(
                            () => evt.target.innerHTML = 'Copy',
                            1000
                        )
                    }
                }
            });
        },
        frageBE({
            frage = {},
            eltern = false,
            partIndex = 0,
            frageIndex = 0,
            daten = [],
            part = [],
            refreshFunktion = false
        } = {}) {
            let container = dom.erzeugen({
                eltern,
                klassen: ['fragenContainer fragenContainerBE']
            })
            dom.erzeugen({
                eltern: container,
                klassen: ['index', `skill${frage.schwierigkeit}`],
                inhalt: `${partIndex}.${frageIndex}`
            })
            dom.templates.textarea({
                value: frage.frage,
                eltern: container,
                klassen: ['taFrage'],
                listeners: {
                    change(evt) {
                        frage.frage = evt.target.value;
                        op.saveAll(daten);
                    }
                }
            })
            dom.templates.adder({
                eltern: container,
                clickListener() {
                    part.splice(frageIndex + 1, 0, {
                        frage: '',
                        typ: "praxis",
                        schwierigkeit: 0,
                        antworten: []
                    });
                    op.saveAll(daten);
                    refreshFunktion(daten);
                }
            })
            dom.templates.remover({
                eltern: container,
                clickListener() {
                    part.splice(frageIndex, 1);
                    op.saveAll(daten);
                    refreshFunktion(daten);
                }
            })
            let antwortenContainer = dom.erzeugen({
                eltern: container,
                klassen: ['antworten']
            })

            if (!frage.antworten.length) frage.antworten.push('');

            frage.antworten.forEach((antwort, antwortIndex) => {
                dom.templates.antwortBE({
                    antwortIndex,
                    frage,
                    daten,
                    eltern: antwortenContainer,
                    refreshFunktion,
                })
            })
            return container;
        },

        antwortBE({
            antwortIndex = 0,
            eltern = false,
            frage = {},
            daten = {},
            refreshFunktion = () => { }
        }) {
            let antwortContainer = dom.templates.textarea({
                value: frage.antworten[antwortIndex],
                eltern,
                klassen: ['antwort', 'antwort_' + antwortIndex],
                listeners: {
                    change(evt) {
                        frage.antworten[antwortIndex] = evt.target.value;
                        op.saveAll(daten);
                        refreshFunktion(daten);
                    }
                }
            })
            dom.templates.adder({
                eltern: antwortContainer,
                clickListener() {
                    frage.antworten.splice(antwortIndex + 1, 0, '');
                    op.saveAll(daten);
                    refreshFunktion(daten);
                }
            })
            dom.templates.remover({
                eltern: antwortContainer,
                clickListener() {
                    frage.antworten.splice(antwortIndex, 1);
                    op.saveAll(daten);
                    refreshFunktion(daten);
                }
            })
        },
        adder({
            eltern = false,
            clickListener = false     // Funktion für den Click-Event
        }) {
            let adder = dom.erzeugen({
                inhalt: '+',
                eltern,
                klassen: ['addPart'],
                listeners: clickListener && {    // Wenn listener false ist, wird false übergeben
                    click: clickListener
                }
            })
            return adder;
        },
        remover({
            eltern = false,
            clickListener = false     // Funktion für den Click-Event
        }) {
            let adder = dom.erzeugen({
                inhalt: '-',
                eltern,
                klassen: ['addPart', 'removePart'],
                listeners: clickListener && {    // Wenn listener false ist, wird false übergeben
                    click: clickListener
                }
            })
            return adder;
        },
        textarea({
            eltern = false,
            value = '',
            klassen = [],
            listeners = {},
        } = {}) {
            let outer = dom.erzeugen({
                eltern,
                klassen
            });
            dom.erzeugen({
                typ: 'textarea',
                value,
                eltern: outer,
                listeners
            });
            return outer;
        }
    },
}

export default dom;