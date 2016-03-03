'use strict';
var Foxx = require('org/arangodb/foxx');
var joi = require('joi');


class RefdatumModel extends Foxx.Model {};

RefdatumModel.prototype.schema = joi.object().keys({
  _key: joi.string()
  ,list: joi.string().required()
  ,code: joi.string().required()
  ,value: joi.string().required()
}).unknown(true);


module.exports = RefdatumModel;
