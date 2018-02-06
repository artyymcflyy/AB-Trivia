function searchGiphy(searchText, callback){
	
	let api_key = "k9v9QnUD49JrDdhYDRFDC781VrmfAlrK";
	let giphyURL = encodeURI("https://api.giphy.com/v1/gifs/search?q="+searchText+"&api_key="+api_key+"&limit=3&offset=2")
	
	$.ajax({
		url: giphyURL,
		method: 'GET'
	}).then(callback);
}

function addGiphy(searchText, height, width){

	searchGiphy(searchText, function(response){
		let randomNumber = Math.floor(Math.random() * 3);

		let imgURL = response.data[randomNumber].images.original.url || "No response returned";

		let image = $("<img>");
		
		$("#endRound").remove();
		let endRoundDiv = $("<div>").attr("id", "endRound");

		image.attr("src", imgURL).attr("class", "img-fluid").css({"width": width, "height": height});

		$("#answerSection").empty().append(endRoundDiv);
		$("#endRound").append(image);
	});
}
