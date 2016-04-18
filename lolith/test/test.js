var assert = require('assert');

global.document = require('jsdom').jsdom('<html></html>');
global.window = document.defaultView;
global.$ = require('jquery')(window);
var $ = require("../public/scripts/jquery-1.12.1.min.js");
//var summonerLookUp = require("../public/scripts/summonerLookUp.js");

//----Copied From summonerLookUp. Currently necessary, will change---------------------------------------------
 var API_KEY = "a043453c-dae3-4855-aebc-a4191544f448" //Shawn's Key
 var API_KEY2 = "5529dcf1-5457-48d2-9c12-eab24c41a382" //Alicia's key

var level;
var level2;
var id;
var id2;
var winPercentage = 100;

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
            	$.ajax({
            		async: false,
            		url: "https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/" + playerID + "?api_key=" + API_KEY, 
            		success: function(playerMatchList){
                	var playerMatches = playerMatchList;
                	//Once we get the matchlist from the player, do the same for "enemy" player, sending it player matchlist
                	enemyLookUp(enemyName, playerMatches, playerID);
            	}});
            
        	}
    });
}

function enemyLookUp(eName, playerMatches, playerID){
        //get enemy level and ID
        $.ajax({
        	async: false,
        	url: "https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + eName + "?api_key=" + API_KEY, 
        	success: function(enemy){
            enemyID = enemy[eName].id;
            $("#eLevel").text(enemy[eName].summonerLevel)
            $("#eID").text(enemyID)

            level2 = enemy[eName].summonerLevel;
            id2 =    enemy[eName].id;

            //new JSON request to get enemy matchlist
            $.ajax({
            	async: false,
            	url: "https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/" + enemyID + "?api_key=" + API_KEY, 
            	success: function(enemyMatchList){
                var enemyMatches = enemyMatchList.matches;
                var length = enemyMatchList.totalGames;
                
                //holds enemy matches
                var eMatchList = [];
                //holds in common matches
                var inCommon = [];
                
                //add all of the enemy's match ID's to eMatchList
                for(var i = 0; i< length; i++){
                    eMatchList.push(enemyMatches[i].matchId)
                }

                //if the player's match ID is within eMatchList, add it to inCommon
                compareMatchLists(playerMatches, eMatchList, inCommon, playerID, enemyID);
                // player matchlist is a list of game objects, inCommon is a list of common matchIDs btw player1 and player2
                calculateWinPercentage(playerMatches, playerID, inCommon);
            }});
        }});
    }

    //Function to form an array of all of the matches both players were in
    function compareMatchLists(playerMatches, eMatchList, inCommon, playerID, enemyID){
        for(var i = 0; i< playerMatches.totalGames; i++){
            if(eMatchList.indexOf(playerMatches.matches[i].matchId) != -1){
                inCommon.push(playerMatches.matches[i].matchId);
            }
        }
        //REMOVEconsole.log("Setting incommon: " + inCommon)
        //determineOpponents(inCommon, playerID, enemyID);
    }

function calculateWinPercentage(playerMatches, playerID, inCommon){ 
    var wins = 0; 
    var matchesSampled = 0;
    // Iterates over each match in playerMatches, 
    // then iterates over common match sub objects to find if won (not efficient)
    for(var i = 0; i < playerMatches.totalGames; i++){
	setTimeout( function(i){
	 //common match- determine whether player (and teammate) won or lost
        if(inCommon.indexOf(playerMatches.matches[i].matchId) != -1){
	    $.ajax({
	    	async: false,
	    	url: "https://na.api.pvp.net/api/lol/na/v2.2/match/" + playerMatches.matches[i].matchId + "?api_key=" + API_KEY2, 
	    	success: function(datMatch){
            //find player1's participant id for match
            var participantList = datMatch.participantIdentities;
            var playerParticipantID = -1;
            for( j = 0; j < participantList.length; j++ )
            {
                if( participantList[j].player.summonerId == playerID ){
                    playerParticipantID = participantList[j].participantId;
		    break;
                }
            }
            if (playerParticipantID == -1){
                console.log("Unable to find playerid in participant list, call an adult");
		return;
            }
            matchesSampled++;
            //Now we go through participants stat's to find if player was winner
            var participants = datMatch.participants;
            if ( participants[playerParticipantID-1].stats.winner ){
                wins = wins + 1;
            }
            $("#winPercent").text((wins/matchesSampled*100).toPrecision(4) + "%"); 

            winPercentage = (wins/matchesSamples*100).toPrecision(4)

	    $("#numGamesSampled").text(matchesSampled);
	}});
        }
	}, 1100*i, i); 
	// Dorky way to do integer division- wait 10 seconds more per 10 calls to not exceed rate limit
    }  
}
//---------------------------------------------------------------------------------------------------  

//-----Default Mocha Test----------------------------------------------------------------------------


describe('Array', function() {

  describe('#indexOf()', function () {
    it('should return -1 when the value is not present (default mocha test)', function () {
      assert.equal(-1, [1,2,3].indexOf(5));
      assert.equal(-1, [1,2,3].indexOf(0));
    });
  });
});

//----LoLith Tests------------------------------------------------------



describe('tdub', function() {

  playerLookUp("tdub", "bringerofredrain");

  describe('summonerLevel', function () {
  	it('should return 30 for the level of tdub', function() {
  		assert.equal(30, level)
    });
  });
});

describe('tdub', function() {

  playerLookUp("tdub", "bringerofredrain");

  describe('playerID', function () {
  	it('should return 32495374 for the playerID of tdub', function() {
  		assert.equal(32495374, id)
    });
  });
});


describe('BringerOfRedRain', function() {

  playerLookUp("tdub", "bringerofredrain");

  describe('summonerLevel', function () {
  	it('should return 30 for the level of BringerOfRedRain', function() {
  		assert.equal(30, level2)
    });
  });
});

describe('BringerOfRedRain', function() {

  playerLookUp("tdub", "bringerofredrain");

  describe('playerID', function () {
  	it('should return 25201594 for the playerID of BringerOfRedRain', function() {
  		assert.equal(25201594, id2)
    });
  });
});


describe('Win Percentage', function() {

  playerLookUp("tdub", "bringerofredrain")

  describe('playerID', function () {
  	it('should return 100% for win percentage between tdub and BringerOfRedRain', function() {
  		assert.equal(100, winPercentage)
    });
  });
});

