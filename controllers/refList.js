'use strict';
var _ = require('underscore');
var Foxx = require('org/arangodb/foxx');
var joi = require('joi');
var ArangoError = require('org/arangodb').ArangoError;

var RefDataRepo = require('../repositories/refData');
var RefList = require('../models/reflist');
var refListRepo = new RefDataRepo(
  applicationContext.collection('refList'),
  {model: RefList}
);

var controller = new Foxx.Controller(applicationContext);

var refListKeySchema = joi.string().required()
.description('The key of the refList')
.meta({allowMultiple: false});

/** Lists of all refList.
 *
 * This function simply returns the list of all RefList.
 */
controller.get('/', function (req, res) {
  res.json(_.map(refListRepo.all(), function (model) {
    return model.forClient();
  }));
});

/** Creates a new refList.
 *
 * Creates a new refList. The information has to be in the
 * requestBody.
 */
controller.post('/', function (req, res) {
  var refList = req.parameters.refList;
  res.json(refListRepo.save(refList).forClient());
})
.bodyParam('refList', {
  description: 'The refList you want to create',
  type: RefList
});

/** Reads a refList.
 *
 * Reads a refList.
 */
controller.get('/:key', function (req, res) {
  var key = req.urlParameters.key;
  res.json(refListRepo.byId(key).forClient());
})
.pathParam('key', refListKeySchema)
.errorResponse(ArangoError, 404, 'The refList could not be found');

/** Replaces a refList.
 *
 * Changes a refList. The information has to be in the
 * requestBody.
 */
controller.put('/:key', function (req, res) {
  var key = req.urlParameters.key;
  var refList = req.parameters.refList;
  res.json(refListRepo.replaceById(key, refList));
})
.pathParam('key', refListKeySchema)
.bodyParam('refList', {
  description: 'The refList you want your old one to be replaced with',
  type: RefList
})
.errorResponse(ArangoError, 404, 'The refList could not be found');

/** Updates a refList.
 *
 * Changes a refList. The information has to be in the
 * requestBody.
 */
controller.patch('/:key', function (req, res) {
  var key = req.urlParameters.key;
  var patchData = req.parameters.patch;
  res.json(refListRepo.updateById(key, patchData));
})
.pathParam('key', refListKeySchema)
.bodyParam('patch', {
  description: 'The patch data you want your refList to be updated with',
  type: joi.object().required()
})
.errorResponse(ArangoError, 404, 'The refList could not be found');

/** Removes a refList.
 *
 * Removes a refList.
 */
controller.delete('/:key', function (req, res) {
  var key = req.urlParameters.key;
  refListRepo.removeById(key);
  res.json({success: true});
})
.pathParam('key', refListKeySchema)
.errorResponse(ArangoError, 404, 'The refList could not be found');
