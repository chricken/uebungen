
'use strict';

let op = {
    saveAll(data) {
        let saveRequest = new Request(
            '/daten_speichern',
            {
                method: 'post',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify(data)
            }
        )
        console.log(saveRequest);
        
        fetch(saveRequest).then(
            antwort => antwort.text()
        ).then(
            console.log
        ).catch(
            console.log
        )
    }
}

export default op;

