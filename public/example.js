const nav = [{
    name: 'Home',
    url: '/index.html'
}, {
    name: 'Languages',
    url: '/languages/index.html',
    children: [{
        name: 'Javascript',
        url: '/languages/javascript.html'
    }, {
        name: 'CSS',
        url: '/languages/css.html'
    }, {
        name: 'HTML',
        url: '/languages/html.html'
    }]
}, {
    name: 'Orga',
    url: '/orga.html',
    children: [{
            name: 'Kontakt',
            url: '/orga/kontakt'
        },
        {
            name: 'Impressum',
            url: '/orga/impressum.html'
        },
        {
            name: 'Datenschutz',
            url: '/orga/datenschutz.html'
        }
    ]
}]