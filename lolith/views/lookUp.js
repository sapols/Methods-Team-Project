function lookUp(summonerName){
	var xhr = new XMLHttpRequest()
	xhr.onload = function(){
		console.log(xhr.responseText)
		var user = JSON.parse(xhr.responseText)
	}
	xhr.open('GET', 'https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/' + summonerName + '?api_key=ea292ea8-35ca-4f74-9d2c-ab12d67d6fe0')
	xhr.send()
	console.log(data)
}
