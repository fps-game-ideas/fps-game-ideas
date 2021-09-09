

function CharacterSelectionScreen() {
	$(".nav_container").addClass("hidden");
	$("#characterContent").addClass("hidden");
	GetCharactersList(function (characters) {
		var html = '<h1>Choose a character!</h1>';
		for (var i=0; i < characters.length; i++) {
			var character = characters[i];
			html += '<br><a href="?character=' + character + '">' + character + '</a>';
		}
		$("#characterList").append(html);
	});
}

function GetCharactersList(callback) {
	var characters = [];
	$.get("https://api.github.com/repos/fps-game-ideas/fps-game-ideas/contents/characters", function(data) {
		//var page = $(data);
		console.log(data);
		for (var i=0; i < data.length; i++) {
			var file = data[i];
			characters.push(file.name.substr(0, file.name.length-5));
		}
		/*
		page.find("a").each( function (i, e) {
			console.log(e);
			if (!e.href.includes(".json")) {
				return;
			}
			
			characters.push(e.innerHTML.substr(1).substr(0, e.innerHTML.length-6));
		})
		*/
		console.log(characters);
		callback(characters);
	})
}
