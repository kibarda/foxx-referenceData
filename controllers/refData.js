'use strict';
var _ = require('underscore');
var joi = require('joi');
var Foxx = require('org/arangodb/foxx');
var ArangoError = require('org/arangodb').ArangoError;
var RefDatum = require('../models/refdatum');
var controller = new Foxx.Controller(applicationContext);

var RefData = require('../repositories/refData');
var refData = new RefData(
  applicationContext.collection('refData'),
  {model: RefDatum}
);

var refDatumKeySchema = joi.string().required()
.description('The key of the refData')
.meta({allowMultiple: false});

var refDataListCodeSchema = joi.string().required()
.description('The code of the refData list')
.meta({allowMultiple: false});

var refDataCategorySchema = joi.string().required()
.description('The category used to restrict the selected refData')
.meta({allowMultiple: false});

var refDataCodeSchema = joi.string().required()
.description('The code used to identify refData in a specific reference list')
.meta({allowMultiple: false});


/** Lists of all refData.
 *
 * This function simply returns the list of all RefDatum.
 */
controller.get('/', function (req, res) {
  res.json(_.map(refData.all(), function (model) {
    return model.forClient();
  }));
});

/** Creates a new refDatum.
 *
 * Creates a new refDatum. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var refDatum = req.parameters.refDatum;
  res.json(refData.save(refDatum).forClient());
})
.bodyParam('refDatum', {
  description: 'The refDatum you want to create',
  type: RefDatum
});

/** Reads a refDatum.
 *
 * Reads a refDatum.
 */
controller.get('/item/:key', function (req, res) {
  var key = req.urlParameters.key;
  res.json(refData.byId(key).forClient());
})
.pathParam('key', refDatumKeySchema)
.errorResponse(ArangoError, 404, 'The refDatum could not be found');


/** Gets refData in a list.
 *
 * Get refData based on a list and a code; eg: /list/COUNTRY/DK
 */
controller.get('/item/:listcode/:code', function (req, res) {
  var listcode = req.urlParameters.listcode;
  var code = req.urlParameters.code;

  res.json(_.map(refData.byExample({"list":listcode, "code":code}), function (model) {
    return model.forClient();
  }));
})
.pathParam('listcode', refDataListCodeSchema)
.pathParam('code', refDataCodeSchema)
.errorResponse(ArangoError, 404, 'The refDatum could not be found');


/** Lists all refData for a given list code and category
 *
 * Lists all refData for a given list code  and category eg. /list/CURRENCY/DK
 */
controller.get('/list/:listcode/:category', function (req, res) {
  var listcode = req.urlParameters.listcode;
  var category = req.urlParameters.category;

  res.json(_.map(refData.byExample({"list":listcode, "category1":category}), function (model) {
    return model.forClient();
  }));
})
.pathParam('listcode', refDataListCodeSchema)
.pathParam('category', refDataCategorySchema)
.errorResponse(ArangoError, 404, 'The refDadata list could not be found');



/** Lists all refData for a given list code
 *
 * Lists all refData for a given list code .
 */
controller.get('/list/:listcode', function (req, res) {
  var listcode = req.urlParameters.listcode;
  res.json(_.map(refData.byExample({"list":listcode}), function (model) {
    return model.forClient();
  }));
})
.pathParam('listcode', refDataListCodeSchema)
.errorResponse(ArangoError, 404, 'The refDadata list could not be found');



/** Replaces a refDatum.
 *
 * Changes a refDatum. The information has to be in the
 * requestBody.
 */
controller.put('/:key', function (req, res) {
  var key = req.urlParameters.key;
  var refDatum = req.parameters.refDatum;
  res.json(refData.replaceById(key, refDatum));
})
.pathParam('key', refDatumKeySchema)
.bodyParam('refDatum', {
  description: 'The refDatum you want your old one to be replaced with',
  type: RefDatum
})
.errorResponse(ArangoError, 404, 'The refDatum could not be found');

/** Updates a refDatum.
 *
 * Changes a refDatum. The information has to be in the
 * requestBody.
 */
controller.patch('/:key', function (req, res) {
  var key = req.urlParameters.key;
  var patchData = req.parameters.patch;
  res.json(refData.updateById(key, patchData));
})
.pathParam('key', refDatumKeySchema)
.bodyParam('patch', {
  description: 'The patch data you want your refDatum to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The refDatum could not be found');

/** Removes a refDatum.
 *
 * Removes a refDatum.
 */
controller.delete('/:key', function (req, res) {
  var key = req.urlParameters.key;
  refData.removeById(key);
  res.json({success: true});
})
.pathParam('key', refDatumKeySchema)
.errorResponse(ArangoError, 404, 'The refDatum could not be found');
