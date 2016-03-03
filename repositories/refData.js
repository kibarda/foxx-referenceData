'use strict';
var Foxx = require('org/arangodb/foxx');
var fs = require("fs");

module.exports = Foxx.Repository.extend({
  // Add your custom methods here

  importData:function(pathFile) {
    var contentString = fs.readFileSync(pathFile, 'utf8');
    var fileDataArr = JSON.parse(contentString);

    var now = new Date();
    for (var i = 0; i < fileDataArr.length; i++) {
        var dataObj = fileDataArr[i];
        dataObj.lastUpdate = now.getTime();
        this.save(dataObj);
    }
  }

});
