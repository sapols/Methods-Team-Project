var assert = require('assert');

global.document = require('jsdom').jsdom('<html></html>');
global.window = document.defaultView;
global.$ = require('jquery')(window);
var $ = require("../public/scripts/jquery-1.12.1.min.js");

//----Copied From summonerLookUp---------------------------------------------
 var API_KEY = "a043453c-dae3-4855-aebc-a4191544f448" //Shawn's Key
 var API_KEY2 = "5529dcf1-5457-48d2-9c12-eab24c41a382" //Alicia's key

var level;
var id;
var winPercentage = 0;

function playerLookUp(name, enemyName){
        //Pulls player ID and level from API
        $.ajax({
        	async: false,
        	url: "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + name + "?api_key=" + API_KEY, 
        	success: function(player) {
            	playerID = player[name].id;
            	$("#sLevel").text(player[name].summonerLevel)
            	$("#sID").text(playerID)

            	//Testing variables
            	level = player[name].summonerLevel;
            	id =    player[name].id;

            	//New JSON request to get player's matchlist
            	$.getJSON("https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/" + playerID + "?api_key=" + API_KEY, function(playerMatchList){
                	var playerMatches = playerMatchList;
                	//Once we get the matchlist from the player, do the same for "enemy" player, sending it player matchlist
                	enemyLookUp(enemyName, playerMatches, playerID);
            	});
            
        	}
    });
}
//-----------------------------------------------------------------------------   

//-----Default Mocha Test------------------------------------------------------


describe('Array', function() {

  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

//----LoLith Tests------------------------------------------------------

describe('tdub', function() {

  var name = "tdub"
  playerLookUp(name, "bringerofredrain");

  describe('summonerLevel', function () {
  	it('should return 30 for the level of tdub', function() {
  		assert.equal(30, level)
    });
  });
});


describe('bringerofredrain', function() {

  var name = "bringerofredrain"
  playerLookUp(name, "tdub");

  describe('playerID', function () {
  	it('should return 25201594 for the playerID of BringerOfRedRain', function() {
  		assert.equal(25201594, id)
    });
  });
});


