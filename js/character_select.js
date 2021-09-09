
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
	$.get("characters", function(data) {
		var page = $(data);
		console.log(page);
		page.find("a").each( function (i, e) {
			console.log(e);
			if (!e.href.includes(".json")) {
				return;
			}
			
			characters.push(e.innerHTML.substr(1).substr(0, e.innerHTML.length-6));
		})
		console.log(characters);
		callback(characters);
	})
}