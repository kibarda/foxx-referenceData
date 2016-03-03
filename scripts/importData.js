'use strict';
var db = require("org/arangodb").db;
var fs = require("fs");

var RefDataRepo = require('../repositories/refData');
var RefDatumModel = require('../models/refdatum');
var RefListModel = require('../models/reflist');

var refDataRepo = new RefDataRepo(
  applicationContext.collection('refData'),
  {model: RefDatumModel}
);
var refListRepo = new RefDataRepo(
  applicationContext.collection('refList'),
  {model: RefListModel}
);

function importRefData(filename) {
  var pathFile =  fs.join(applicationContext.basePath, filename);
  if (fs.exists(pathFile)) {
    refDataRepo.importData(pathFile);
  } else {
    console.warn('not found:', fs.exists(pathFile));
  }
}

function importListDef(filename) {
  var pathFile =  fs.join(applicationContext.basePath, filename);
  if (fs.exists(pathFile)) {
    refListRepo.importData(pathFile);
  } else {
    console.warn('not found:', fs.exists(pathFile));
  }
}

importListDef('data/countryDesc.json');
importRefData('data/countryData.json');
importListDef('data/currencyDesc.json');
importRefData('data/currencyData.json');
importListDef('data/languageDesc.json');
importRefData('data/languageData.json');
