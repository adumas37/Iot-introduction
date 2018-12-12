var fs = require('fs');

function handleSerialPort(data) {
    console.log('data :', data);
    try {
        const measure = JSON.parse(data);
        if (measure && measure.value && measure.type && measure.name && measure.unit) {
            addMeasureInFile(measure);
        }
    } catch (error) {        
    }
}

module.exports = { handleSerialPort };



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