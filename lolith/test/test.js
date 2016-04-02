var assert = require('assert');
describe('Array', function() {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5)); 
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

//----Real Tests Below-------------------------

//IMPORT STATEMENT?

//playerLookUp Level Test
//var assert = require('assert');
//var level = 36 //change this if incorrect

//describe('int', function() {
//  describe('#playerLookUp()', function () {
//    it('should return tdub's summoner level when requested', function () {
//      assert.equal(level, playerLookUp(tdub).level); //not correct
//    });
//  });
//});
