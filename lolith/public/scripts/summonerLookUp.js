    var API_KEY = "3285b0e1-6cf7-49a8-bd06-26ff55dd8a78"
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
                    
                    getTeamID(summonerID);

                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("error getting Summoner data!");
                }
            });
        } else {}
    }

    function getTeamID(id){
         $.ajax({
                url: 'https://na.api.pvp.net/api/lol/na/v2.4/team/by-summoner/' + id + '?api_key=' + API_KEY,
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (team) {
                    var tID = team[id][0].fullId;
                    getTeamName(tID);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("error getting Team data!");
                }
            });
    }          
    function getTeamName(tID){
        $.ajax({
                url: 'https://na.api.pvp.net/api/lol/na/v2.4/team/' + tID + '?api_key=' + API_KEY,
                type: 'GET',
                dataType: 'json',
                data: {

                },
                success: function (team) {
                    var teamName = team[tID].name;
                    $("#teamName").text(teamName);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("error getting Team data!");
                }
            });
    }    