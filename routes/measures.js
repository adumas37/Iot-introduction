var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET measures listing. */
router.get('/', function(req, res, next) {
  res.send(getMeasuresFromFile());
});

/* GET measure. */
router.get('/:id', function(req, res, next) {
  measure = getMeasure(req.params.id);

  if (measure) {
    res.send(measure);
  }

  res.status(404).send('Not found');
});

/* POST measure. */
router.post('/', function(req, res, next) {
  addMeasureInFile(req.body);

  res.send();
});

/* PUT measure. */
router.put('/:id', function(req, res, next) {
  patchMeasure(req.params.id, req.body);

  res.send();
});

/* DELETE measure. */
router.delete('/:id', function(req, res, next) {
  deleteMeasure(req.params.id);

  res.send();
});

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
  getMeasuresFromFile().forEach(measure => {
    if (measure.id == id) {
      return measure;
    }
  });

  return null;
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

module.exports = router;
