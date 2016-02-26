    var API_KEY = "bd625f19-1902-4bb1-b8f6-8b21030796ab"
    var enemyName = "";
    var playerName = "";
    var enemyID;
    var playerID;
    //var playerMatches;

    $("#submitPlayers").click(function(){
        playerName = $("#userName").val();
        enemyName = $("#enemyName").val();
        var enemyNoSpaces = enemyName.replace(" ", "").toLowerCase().trim();
        var playerNoSpaces = playerName.replace(" ", "").toLowerCase().trim();
        playerLookUp(playerNoSpaces, enemyNoSpaces);
    });

    function playerLookUp(name, enemyName){
        $.getJSON("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/" + name + "?api_key=" + API_KEY, function(player){
            playerID = player[name].id;
            $("#sLevel").text(player[name].summonerLevel)
            $("#sID").text(playerID)

            //New JSON request to get matchlist
            $.getJSON("https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/" + playerID + "?api_key=" + API_KEY, function(playerMatchList){
                var playerMatches = playerMatchList;
                enemyLookUp(enemyName, playerMatches);
            });
            
        });
    }
    function enemyLookUp(eName, playerMatches){
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
                for(var i = 0; i< playerMatches.totalGames; i++){
                    if(eMatchList.indexOf(playerMatches.matches[i].matchId) != -1){
                        inCommon.push(playerMatches.matches[i].matchId);
                    }
                }
                
                $("#gamelist").append("<tbody>");
                for(var i = 0; i < inCommon.length; i++){
                    $("#gamelist").append("<tr><td>" + inCommon[i] + "</td></tr>");
                }
                $("#gamelist").append("</tbody>");
            });
        });
    }
/*
    function summonerLookUp() {
        var SUMMONER_NAME = "";
        SUMMONER_NAME = $("#userName").val();



        if (SUMMONER_NAME !== "") {

            $.ajax({
                url: 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + SUMMONER_NAME + '?api_key=' + API_KEY,
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (json) {
                    var SUMMONER_NAME_NOSPACES = SUMMONER_NAME.replace(" ", "");

                    SUMMONER_NAME_NOSPACES = SUMMONER_NAME_NOSPACES.toLowerCase().trim();

                    summonerLevel = json[SUMMONER_NAME_NOSPACES].summonerLevel;
                    summonerID = json[SUMMONER_NAME_NOSPACES].id;

                    $("#sLevel").text(summonerLevel);
                    $("#sID").text(summonerID);
                    
                    //getMatchList(summonerID);
                    //getEnemyMatchList(enemyID);

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("error getting Summoner data!");
                }
            });
        } else {}
    }

    function getMatchList(id){
         $.ajax({
                url: 'https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/' + id + '?api_key=' + API_KEY,
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (matchlist) {
                    var length = matchlist.matches.length;
                    //
                    //$("#gamelist").append("<tr><td>" + matchID + "</td>" + "<td>" + lane + "</td>" + "<td>" + season + "</td></tr>")
                    getEnemyMatchList();
                    console.log(length);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("error getting MatchList data!");
                }
            });
    }    
    function getEnemyMatchList(eid){
        $.ajax({
                url: 'https://na.api.pvp.net/api/lol/na/v2.2/matchlist/by-summoner/' + eid + '?api_key=' + API_KEY,
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (matchlist) {
                    var length = matchlist.matches.length;
                    //$("#gamelist").append("<tbody>");
                    //$("#gamelist").append("<tr><td>" + matchID + "</td>" + "<td>" + lane + "</td>" + "<td>" + season + "</td></tr>")
                    for(var i = 0; i<length; i++){
                        var matchID = matchlist.matches[i].matchId;
                        getMatch(matchID);
                        
                    }
                    console.log(length);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("error getting MatchList data!");
                }
            });
    } 
    function getMatch(mid){
        $.ajax({
                url: 'https://na.api.pvp.net/api/lol/na/v2.2/match/' + mid + '?api_key=' + API_KEY,
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (match) {
                    console.log(match["participantIdentities"] + "\n")
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("error getting MatchList data!");
                }
            });
    }*/     