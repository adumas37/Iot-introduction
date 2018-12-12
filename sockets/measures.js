var fs = require('fs');

function handleIo(io) {
    return (socket) => {
        socket.on('get all measures', () => {
            io.emit('messages', getMeasuresFromFile());
        });

        socket.on('get measure', (id) => {            
            io.emit('messages', getMeasure(id));
        });

        socket.on('delete measure', (id) => {
            deleteMeasure(id);
            io.emit('messages', 'deleted Measure with id '+ id);
        });

        socket.on('patch measure', ({id, value}) => {
            patchMeasure(id, JSON.parse(value));            
            io.emit('messages', getMeasure(id));
        });

        socket.on('post measure', (value) => {
            addMeasureInFile(JSON.parse(value));            
            io.emit('messages', 'measure added');
        });
    }
}

module.exports = { handleIo };



function getMeasuresFromFile() {
    const fileName = process.cwd() + '/data/measures.json';

    if (!fs.existsSync(fileName)) {
        writeMeasuresToFile([]);
    }

    return JSON.parse(fs.readFileSync(fileName));
}

function writeMeasuresToFile(measures) {
    const fileName = 'data/measures.json';
    fs.writeFileSync(fileName, JSON.stringify(measures));
}

function addMeasureInFile(measure) {
    let measures = getMeasuresFromFile();
    measures.push(measure);

    writeMeasuresToFile(measures);
}

function getMeasure(id) {
    return getMeasuresFromFile().find(measure => {
        return measure.id == id;
    });
}

function patchMeasure(id, measureData) {
    const measures = getMeasuresFromFile().map(measure => {
        if (measure.id == id) {
            return measureData;
        }

        return measure;
    });

    writeMeasuresToFile(measures);
}

function deleteMeasure(id) {
    measures = getMeasuresFromFile().filter(measure => measure.id != id);

    writeMeasuresToFile(measures);
}