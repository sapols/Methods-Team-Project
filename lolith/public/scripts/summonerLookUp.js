    //Function uses a hard-coded API Key to pull summoner data for HTML display
    //var API_KEY = "a043453c-dae3-4855-aebc-a4191544f448" //Shawn's Key
    var API_KEY = "5529dcf1-5457-48d2-9c12-eab24c41a382" //Alicia's key
    var enemyNoSpaces;
    var playerNoSpaces;
    var matchWins = []
    
    //On click function. When submit button is pressed, this executes
    $("#submitPlayers").click(function(){
        var enemyName = "";
        var playerName = "";
        var enemyID;
        var playerID;
        //get the names from the user
        playerName = $("#userName").val();
        enemyName = $("#enemyName").val();
        //Change the names to be API friendly (get rid of spaces and uppercase letters)
        enemyNoSpaces = enemyName.replace(/\s/g, "").toLowerCase().trim();
        playerNoSpaces = playerName.replace(/\s/g, "").toLowerCase().trim();

        //Only call the API if the user entered BOTH names.
        if((playerName !== "") && (enemyName !== "")){
            playerLookUp(playerNoSpaces, enemyNoSpaces);
        }
    });

    //Call the API to get player info (first text box)
    function playerLookUp(name, enemyName){
        //Pulls layer ID and level from API
        $.getJSON("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + name + "?api_key=" + API_KEY, function(player){
            playerID = player[name].id;
            $("#sLevel").text(player[name].summonerLevel)
            $("#sID").text(playerID)

            //New JSON request to get player's matchlist
            $.getJSON("https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/" + playerID + "?api_key=" + API_KEY, function(playerMatchList){
                var playerMatches = playerMatchList;
                //Once we get the matchlist from the player, do the same for "enemy" player, sending it player matchlist
                enemyLookUp(enemyName, playerMatches, playerID);
            });
            
        });
    }

    //Call API to get "enemy" info. 
    function enemyLookUp(eName, playerMatches, playerID){
        //get enemy level and ID
        $.getJSON("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + eName + "?api_key=" + API_KEY, function(enemy){
            enemyID = enemy[eName].id;
            $("#eLevel").text(enemy[eName].summonerLevel)
            $("#eID").text(enemyID)

            //new JSON request to get enemy matchlist
            $.getJSON("https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/" + enemyID + "?api_key=" + API_KEY, function(enemyMatchList){
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
                
            });
        });
    }

    //Function to form an array of all of the matches both players were in
    function compareMatchLists(playerMatches, eMatchList, inCommon, playerID, enemyID){
        for(var i = 0; i< playerMatches.totalGames; i++){
            if(eMatchList.indexOf(playerMatches.matches[i].matchId) != -1){
                inCommon.push(playerMatches.matches[i].matchId);
            }
        }
        //REMOVEconsole.log("Setting incommon: " + inCommon)
        determineOpponents(inCommon, playerID, enemyID);
    }

    function determineOpponents(inCommon, playerID, enemyID){
        var playerTeam;
        var enemyTeam;
        var whoWon;

        for(var i = 0; i< inCommon.length; i++){
            //dont kill the API!
            if(inCommon.length < 11){
                $.getJSON("https://na.api.pvp.net/api/lol/na/v2.2/match/" + inCommon[i] + "?api_key=" + API_KEY, function(match){
                    console.log("Setting incommon: " + inCommon)
                    for(var i = 0; i < match.participantIdentities.length; i++){
                        if(match.participantIdentities[i].player.summonerId == playerID){
                            var partitipantID = match.participantIdentities[i].participantId;
                            playerTeam = match.participants[partitipantID-1].teamId;
                        }
                        if(match.participantIdentities[i].player.summonerId == enemyID){
                            var partitipantID = match.participantIdentities[i].participantId;
                            enemyTeam = match.participants[partitipantID-1].teamId;
                        }
                    }

                    if(playerTeam == enemyTeam){ /*do nothing*/ }
                    else{
                        if(playerTeam == 100){
                            win(match.teams[0].winner, inCommon.length);
                        }
                        else{
                            win(match.teams[1].winner, inCommon.length);  
                        }
                    }

                    
                });
                if(i == (inCommon.length - 1)){
              //      winPercentage();    
                }
            }
            
        }
    }


    function winPercentage(){
        var win = 0.0;
        var loss = 0.0;
        console.log("Commong: " + matchWins)
        for(var i = 0; i < matchWins.length; i++){
            if(matchWins[i]){
                win += 1.0;
            }
            else{
                loss += 1.0;
            }
        }
        console.log("win: " + win + " loss: " + loss)
        var percent = (win / (win+loss)).toFixed(2) * 100
        $("#winPercent").text(percent+"%");
    }

    function win(isWin, length){
        console.log(isWin)
        console.log("matchwins: " + matchWins)
        if(String(isWin) == "true"){
            matchWins.push(true);
        }
        else{
            matchWins.push(false)
        }

        if(matchWins.length == length){
            winPercentage();
        }
                //console.log("matchwins: " + matchWins)
    }

    //Append HTML on page to include a table of in-common matches
    //Currently not using, saving for later
    function addMatchesToTable(inCommon, matchWins){
        $("#gamelist").append("<tbody>");
        for(var i = 0; i < inCommon.length; i++){
            $("#gamelist").append("<tr><td>" + inCommon[i] + "</td>" + "<td>" + matchWins[i] + "</td></tr>");
        }
        $("#gamelist").append("</tbody>");
    }
