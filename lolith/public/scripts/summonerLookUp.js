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
                    
                    getMatchList(summonerID);

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
                    $("#gamelist").append("<tbody>");
                    for(var i = 0; i<length; i++){
                        var matchID = matchlist.matches[i].matchId;
                        var lane = matchlist.matches[i].lane;
                        var season = matchlist.matches[i].season;
                        $("#gamelist").append("<tr><td>" + matchID + "</td>" + "<td>" + lane + "</td>" + "<td>" + season + "</td></tr>")
                    }
                    console.log(length);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    alert("error getting MatchList data!");
                }
            });
    }          